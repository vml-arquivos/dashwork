import { Request, Response, NextFunction } from "express";
import { normalizeRole } from "./auth.ts";
import { getPermissoes, temPermissao, podeGerenciar, cargosGerenciaveis, Permissoes } from "../../shared/cargos.ts";
import { systemPool } from "../databasePools";
import { carregarFeatureAccessConfig, isFeatureEnabledForUser } from "../services/featureAccessService";
import { ACCOUNT_CONTROLLED_FEATURES } from "../../shared/accountProfiles";
import { modulesForUserActivity, normalizarAtividade } from "../../shared/userActivities";

/**
 * Middleware de autorização por cargo.
 * Aceita lista de cargos permitidos (strings normalizadas ou originais).
 *
 * Uso: app.get("/rota", auth, authorize(["administrador", "diretor"]), handler)
 */
export function authorize(allowedRoles: string[]) {
  const normalizedAllowedRoles = allowedRoles.map((role) => normalizeRole(role));

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }

    const userRole = normalizeRole(req.user?.role || req.user?.cargo);

    if (!normalizedAllowedRoles.includes(userRole)) {
      res.status(403).json({ error: "Acesso não autorizado" });
      return;
    }

    next();
  };
}

/**
 * Middleware de autorização por permissão específica.
 * Mais granular que authorize() — verifica uma permissão do mapa de cargos.
 *
 * Uso: app.post("/contratos", auth, requirePermissao("gerarContratos"), handler)
 */
export function requirePermissao(permissao: keyof Permissoes) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }

    const cargo = req.user?.cargo || req.user?.role;
    if (!temPermissao(cargo, permissao)) {
      res.status(403).json({
        error: "Permissão insuficiente",
        detalhe: `Cargo "${cargo}" não possui a permissão "${permissao}".`,
      });
      return;
    }

    next();
  };
}

/**
 * Gating server-side por módulo da conta. A interface pode ocultar menus, mas
 * qualquer endpoint controlado também precisa consultar a conta no banco para
 * impedir acesso direto por alteração manual de URLs/IDs.
 */
export function requireAccountFeature(featureKey: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }
    try {
      const { rows } = await systemPool.query(
        `SELECT cp.status,
                cp.modulos_ativos AS conta_modulos_ativos,
                to_jsonb(c)->>'atividade' AS atividade,
                COALESCE(NULLIF(to_jsonb(c)->>'modulos_ativos', '')::jsonb, '[]'::jsonb) AS usuario_modulos_ativos
           FROM contas_plataforma cp
           LEFT JOIN colaboradores c ON c.id = $2 AND c.conta_id = cp.id
          WHERE cp.id = $1
          LIMIT 1`,
        [req.user.conta_id, req.user.id],
      );
      const account = rows[0];
      if (!account || account.status !== "ativo") {
        res.status(403).json({ error: "Conta sem acesso ativo à plataforma." });
        return;
      }
      const modules = Array.isArray(account.conta_modulos_ativos)
        ? account.conta_modulos_ativos.map(String)
        : [];
      if (ACCOUNT_CONTROLLED_FEATURES.includes(featureKey) && modules.length > 0 && !modules.includes(featureKey)) {
        res.status(403).json({ error: "Esta função não está ativa para a conta." });
        return;
      }
      const userModules = Array.isArray(account.usuario_modulos_ativos) && account.usuario_modulos_ativos.length > 0
        ? account.usuario_modulos_ativos.map(String)
        : modulesForUserActivity(normalizarAtividade(account.atividade));
      if (ACCOUNT_CONTROLLED_FEATURES.includes(featureKey) && userModules.length > 0 && !userModules.includes(featureKey)) {
        res.status(403).json({ error: "Esta função não está ativa para este usuário." });
        return;
      }
      const config = carregarFeatureAccessConfig();
      if (!isFeatureEnabledForUser(config, featureKey, req.user.id)) {
        res.status(403).json({ error: "Esta função foi desativada para este usuário." });
        return;
      }
      next();
    } catch (error) {
      console.error(`[feature-gate:${featureKey}]`, error);
      res.status(503).json({ error: "Não foi possível validar o acesso à função." });
    }
  };
}

// Re-exporta utilitários para uso nas rotas
export { getPermissoes, temPermissao, podeGerenciar, cargosGerenciaveis };
