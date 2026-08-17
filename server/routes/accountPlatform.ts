import { Router, type Request, type Response } from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { auth } from "../middleware/auth";
import { pool, systemPool } from "../databasePools";
import { getDataDir } from "../services/documentStorage";
import { invalidateAccountBranding } from "../services/accountBrandingService";
import {
  ACCOUNT_CONTROLLED_FEATURES,
  ACCOUNT_PROFILE_LABELS,
  modulesForAccountProfile,
  type AccountProfileKey,
} from "../../shared/accountProfiles";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("Logo deve ser PNG, JPG ou WEBP."));
  },
});

type AccountBody = Record<string, unknown>;

function validLogoBytes(buffer: Buffer, mime: string) {
  if (mime === "image/png") return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mime === "image/jpeg") return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mime === "image/webp") return buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

function adminEmails() {
  return new Set(String(process.env.PLATFORM_ADMIN_EMAILS || "").split(",").map((v) => v.trim().toLowerCase()).filter(Boolean));
}

function isPlatformAdmin(req: Request) {
  const email = String(req.user?.email || "").toLowerCase();
  const configured = adminEmails();
  if (configured.has(email)) return true;
  const defaultAccountId = process.env.DEFAULT_CONTA_ID || "00000000-0000-4000-8000-000000000001";
  return String(req.user?.conta_id || "") === defaultAccountId && ["administrador", "admin"].includes(String(req.user?.role || "").toLowerCase());
}

function requirePlatformAdmin(req: Request, res: Response, next: () => void) {
  if (!isPlatformAdmin(req)) {
    res.status(403).json({ error: "Acesso restrito à Central de Empresas e Acessos." });
    return;
  }
  next();
}

function validProfile(value: unknown): AccountProfileKey {
  const profile = String(value || "").trim() as AccountProfileKey;
  return Object.prototype.hasOwnProperty.call(ACCOUNT_PROFILE_LABELS, profile) ? profile : "financeiro";
}

function slug(value: unknown) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function digits(value: unknown) {
  const normalized = String(value || "").replace(/\D/g, "");
  return normalized || null;
}

function text(value: unknown) {
  const normalized = String(value ?? "").trim();
  return normalized || null;
}

function safeModules(value: unknown, profile: AccountProfileKey) {
  const requested = Array.isArray(value) ? value.map(String) : [];
  const allowed = new Set(ACCOUNT_CONTROLLED_FEATURES);
  const selected = requested.filter((module) => allowed.has(module));
  return selected.length > 0 ? Array.from(new Set(selected)) : modulesForAccountProfile(profile);
}

function panelFor(profile: AccountProfileKey, requested: unknown) {
  if (profile === "financeiro" || profile === "credito_contabil") return "financeiro_atual";
  const panel = String(requested || "pacote_modular").trim();
  return panel || "pacote_modular";
}

function brandingDir(id: string) {
  return path.join(getDataDir(), "uploads", "branding", id);
}

function imageExtension(mime: string) {
  return mime === "image/jpeg" ? ".jpg" : mime === "image/webp" ? ".webp" : ".png";
}

export default function createAccountPlatformRouter() {
  const router = Router();

  router.get("/minha-conta", auth, async (req, res) => {
    try {
      const { rows } = await systemPool.query(
        `SELECT id,nome,slug,perfil_base,ramo_atuacao,painel_base,administrador_nome,administrador_email,status,modulos_ativos,criado_em,atualizado_em
           FROM contas_plataforma WHERE id=$1`,
        [req.user!.conta_id],
      );
      if (!rows[0]) return res.status(404).json({ error: "Conta não encontrada." });
      res.json(rows[0]);
    } catch (error) {
      console.error("[GET /api/minha-conta]", error);
      res.status(500).json({ error: "Erro ao carregar conta." });
    }
  });

  router.get("/minha-conta/personalizacao", auth, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT conta_id,nome_exibicao,razao_social,nome_fantasia,cnpj,telefone,whatsapp,email,site,endereco,cidade,uf,cep,logo_path,logo_mime,cor_primaria,cor_secundaria,rodape_linha_1,rodape_linha_2,rodape_linha_3,signatario_nome,signatario_cargo,signatario_cpf,signatario_email,assinatura_path,configuracoes,atualizado_em
           FROM conta_personalizacao WHERE conta_id=$1 LIMIT 1`,
        [req.user!.conta_id],
      );
      const data = rows[0] || {};
      res.json({ ...data, logo_url: data.logo_path ? "/api/minha-conta/logo" : null });
    } catch (error) {
      console.error("[GET /api/minha-conta/personalizacao]", error);
      res.status(500).json({ error: "Erro ao carregar personalização." });
    }
  });

  router.put("/minha-conta/personalizacao", auth, async (req, res) => {
    try {
      if (!["administrador", "diretor", "gerente comercial"].includes(String(req.user?.role || ""))) {
        return res.status(403).json({ error: "Sem permissão para alterar a identidade da conta." });
      }
      const body = (req.body || {}) as AccountBody;
      const id = req.user!.conta_id;
      const values = [
        id,
        text(body.nome_exibicao), text(body.razao_social), text(body.nome_fantasia), digits(body.cnpj),
        text(body.telefone), text(body.whatsapp), text(body.email), text(body.site), text(body.endereco),
        text(body.cidade), String(body.uf || "").toUpperCase().slice(0, 2) || null, digits(body.cep),
        /^#[0-9a-fA-F]{6}$/.test(String(body.cor_primaria || "")) ? String(body.cor_primaria).toUpperCase() : "#1B3A8C",
        /^#[0-9a-fA-F]{6}$/.test(String(body.cor_secundaria || "")) ? String(body.cor_secundaria).toUpperCase() : "#00A6A6",
        text(body.rodape_linha_1), text(body.rodape_linha_2), text(body.rodape_linha_3), text(body.signatario_nome),
        text(body.signatario_cargo), digits(body.signatario_cpf), text(body.signatario_email),
        JSON.stringify(body.configuracoes && typeof body.configuracoes === "object" ? body.configuracoes : {}),
      ];
      const { rows } = await pool.query(
        `INSERT INTO conta_personalizacao(conta_id,nome_exibicao,razao_social,nome_fantasia,cnpj,telefone,whatsapp,email,site,endereco,cidade,uf,cep,cor_primaria,cor_secundaria,rodape_linha_1,rodape_linha_2,rodape_linha_3,signatario_nome,signatario_cargo,signatario_cpf,signatario_email,configuracoes,atualizado_em)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23::jsonb,NOW())
         ON CONFLICT(conta_id) DO UPDATE SET nome_exibicao=EXCLUDED.nome_exibicao,razao_social=EXCLUDED.razao_social,nome_fantasia=EXCLUDED.nome_fantasia,cnpj=EXCLUDED.cnpj,telefone=EXCLUDED.telefone,whatsapp=EXCLUDED.whatsapp,email=EXCLUDED.email,site=EXCLUDED.site,endereco=EXCLUDED.endereco,cidade=EXCLUDED.cidade,uf=EXCLUDED.uf,cep=EXCLUDED.cep,cor_primaria=EXCLUDED.cor_primaria,cor_secundaria=EXCLUDED.cor_secundaria,rodape_linha_1=EXCLUDED.rodape_linha_1,rodape_linha_2=EXCLUDED.rodape_linha_2,rodape_linha_3=EXCLUDED.rodape_linha_3,signatario_nome=EXCLUDED.signatario_nome,signatario_cargo=EXCLUDED.signatario_cargo,signatario_cpf=EXCLUDED.signatario_cpf,signatario_email=EXCLUDED.signatario_email,configuracoes=EXCLUDED.configuracoes,atualizado_em=NOW()
         RETURNING *`,
        values,
      );
      invalidateAccountBranding(id);
      res.json({ success: true, personalizacao: rows[0] });
    } catch (error) {
      console.error("[PUT /api/minha-conta/personalizacao]", error);
      res.status(500).json({ error: "Erro ao salvar personalização." });
    }
  });

  router.post("/minha-conta/logo", auth, upload.single("logo"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "Envie o arquivo da logo." });
      if (!validLogoBytes(req.file.buffer, req.file.mimetype)) return res.status(400).json({ error: "O arquivo enviado não corresponde a uma imagem válida." });
      if (!["administrador", "diretor", "gerente comercial"].includes(String(req.user?.role || ""))) return res.status(403).json({ error: "Sem permissão para alterar a logo." });
      const id = req.user!.conta_id;
      const directory = brandingDir(id);
      fs.mkdirSync(directory, { recursive: true });
      for (const name of ["logo.png", "logo.jpg", "logo.webp"]) {
        const oldPath = path.join(directory, name);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      const filePath = path.join(directory, `logo${imageExtension(req.file.mimetype)}`);
      fs.writeFileSync(filePath, req.file.buffer);
      await pool.query(
        `INSERT INTO conta_personalizacao(conta_id,logo_path,logo_mime,atualizado_em) VALUES($1,$2,$3,NOW()) ON CONFLICT(conta_id) DO UPDATE SET logo_path=EXCLUDED.logo_path,logo_mime=EXCLUDED.logo_mime,atualizado_em=NOW()`,
        [id, filePath, req.file.mimetype],
      );
      invalidateAccountBranding(id);
      res.json({ success: true, logo_url: "/api/minha-conta/logo" });
    } catch (error) {
      console.error("[POST /api/minha-conta/logo]", error);
      res.status(500).json({ error: "Erro ao salvar logo." });
    }
  });

  router.get("/minha-conta/logo", auth, async (req, res) => {
    try {
      const { rows } = await pool.query(`SELECT logo_path,logo_mime FROM conta_personalizacao WHERE conta_id=$1 LIMIT 1`, [req.user!.conta_id]);
      const record = rows[0];
      if (!record?.logo_path || !fs.existsSync(record.logo_path)) return res.status(404).end();
      res.setHeader("Content-Type", record.logo_mime || "image/png");
      res.setHeader("Cache-Control", "private, max-age=300");
      fs.createReadStream(record.logo_path).pipe(res);
    } catch {
      res.status(500).end();
    }
  });

  router.get("/plataforma/contas", auth, requirePlatformAdmin, async (_req, res) => {
    try {
      const { rows } = await systemPool.query(
        `SELECT cp.id,cp.nome,cp.slug,cp.perfil_base,cp.ramo_atuacao,cp.painel_base,cp.administrador_nome,cp.administrador_email,cp.status,cp.modulos_ativos,cp.criado_em,cp.atualizado_em,COUNT(c.id)::int AS usuarios
           FROM contas_plataforma cp
           LEFT JOIN colaboradores c ON c.conta_id=cp.id
          GROUP BY cp.id
          ORDER BY cp.criado_em DESC`,
      );
      res.json(rows);
    } catch (error) {
      console.error("[GET /api/plataforma/contas]", error);
      res.status(500).json({ error: "Erro ao listar empresas da plataforma." });
    }
  });

  router.post("/plataforma/contas", auth, requirePlatformAdmin, async (req, res) => {
    const client = await systemPool.connect();
    try {
      const body = (req.body || {}) as AccountBody;
      const nome = String(body.nome || "").trim();
      const generatedSlug = slug(body.slug || nome);
      const ramo = validProfile(body.ramo_atuacao || body.perfil_base || "financeiro");
      const painel = panelFor(ramo, body.painel_base);
      const adminNome = String(body.admin_nome || "").trim();
      const adminEmail = String(body.admin_email || "").trim().toLowerCase();
      const adminSenha = String(body.admin_senha || "");
      const modules = safeModules(body.modulos_ativos, ramo);
      const adminActivity = ramo === "financeiro" || ramo === "credito_contabil" ? "financeiro" : "administrativo";
      if (!nome || !generatedSlug || !adminNome || !adminEmail || adminSenha.length < 8) {
        return res.status(400).json({ error: "Informe os dados da empresa, administrador, e-mail e uma senha com pelo menos 8 caracteres." });
      }
      await client.query("BEGIN");
      const accountResult = await client.query(
        `INSERT INTO contas_plataforma(nome,slug,perfil_base,ramo_atuacao,painel_base,administrador_nome,administrador_email,status,modulos_ativos,observacoes)
         VALUES($1,$2,$3,$4,$5,$6,$7,'ativo',$8::jsonb,$9)
         RETURNING id,nome,slug,perfil_base,ramo_atuacao,painel_base,administrador_nome,administrador_email,status,modulos_ativos,criado_em`,
        [nome, generatedSlug, ramo, ramo, painel, adminNome, adminEmail, JSON.stringify(modules), text(body.observacoes)],
      );
      const account = accountResult.rows[0];
      const id = account.id;
      await client.query(
        `INSERT INTO conta_personalizacao(conta_id,nome_exibicao,razao_social,nome_fantasia,cnpj,telefone,whatsapp,email,site,endereco,cidade,uf,cep,configuracoes)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb)`,
        [
          id, text(body.nome_exibicao) || nome, text(body.razao_social) || nome, text(body.nome_fantasia) || nome,
          digits(body.cnpj), text(body.telefone), text(body.whatsapp), text(body.email_empresa), text(body.site),
          text(body.endereco), text(body.cidade), String(body.uf || "").toUpperCase().slice(0, 2) || null, digits(body.cep),
          JSON.stringify({ ramo_atuacao: ramo, painel_base: painel }),
        ],
      );
      const passwordHash = await bcrypt.hash(adminSenha, 12);
      const userResult = await client.query(
        `INSERT INTO colaboradores(nome,email,cargo,senha_hash,ativo,perfil,atividade,modulos_ativos,pode_atender_leads,pode_ver_todos_leads,conta_id)
         VALUES($1,$2,'Administrador da empresa',$3,true,'admin',$4,$5::jsonb,true,true,$6)
         RETURNING id,nome,email,cargo,conta_id`,
        [adminNome, adminEmail, passwordHash, adminActivity, JSON.stringify(modules), id],
      );
      await client.query("COMMIT");
      res.status(201).json({ success: true, conta: account, administrador: userResult.rows[0] });
    } catch (error: any) {
      await client.query("ROLLBACK").catch(() => undefined);
      console.error("[POST /api/plataforma/contas]", error);
      if (String(error?.message || "").toLowerCase().includes("unique")) return res.status(409).json({ error: "Slug ou e-mail já cadastrado." });
      res.status(500).json({ error: "Erro ao criar empresa e administrador." });
    } finally {
      client.release();
    }
  });

  router.patch("/plataforma/contas/:id", auth, requirePlatformAdmin, async (req, res) => {
    try {
      const body = (req.body || {}) as AccountBody;
      const currentResult = await systemPool.query(`SELECT * FROM contas_plataforma WHERE id=$1`, [req.params.id]);
      if (!currentResult.rows[0]) return res.status(404).json({ error: "Empresa não encontrada." });
      const current = currentResult.rows[0];
      const ramo = validProfile(body.ramo_atuacao || body.perfil_base || current.ramo_atuacao || current.perfil_base);
      const modules = safeModules(body.modulos_ativos ?? current.modulos_ativos, ramo);
      const status = ["ativo", "suspenso", "cancelado"].includes(String(body.status)) ? String(body.status) : current.status;
      const { rows } = await systemPool.query(
        `UPDATE contas_plataforma
            SET nome=$2,perfil_base=$3,ramo_atuacao=$4,painel_base=$5,modulos_ativos=$6::jsonb,status=$7,atualizado_em=NOW()
          WHERE id=$1
          RETURNING *`,
        [req.params.id, text(body.nome) || current.nome, ramo, ramo, panelFor(ramo, body.painel_base || current.painel_base), JSON.stringify(modules), status],
      );
      res.json({ success: true, conta: rows[0] });
    } catch (error) {
      console.error("[PATCH /api/plataforma/contas/:id]", error);
      res.status(500).json({ error: "Erro ao atualizar empresa." });
    }
  });

  return router;
}
