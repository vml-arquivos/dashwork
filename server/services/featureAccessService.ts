import fs from "fs";
import path from "path";
import { getCurrentContaId, LEGACY_DEFAULT_CONTA_ID } from "../tenantContext";

export type FeatureValue = boolean;

export interface FeatureAccessConfig {
  version: 1;
  global: Record<string, FeatureValue>;
  userOverrides: Record<string, Record<string, FeatureValue>>;
  updatedAt?: string;
  updatedBy?: string | null;
}

const DEFAULT_CONFIG: FeatureAccessConfig = {
  version: 1,
  global: {},
  userOverrides: {},
  updatedAt: undefined,
  updatedBy: null,
};

function getConfigDir(): string {
  // Importante: precisa ficar dentro da MESMA árvore que o volume persistente real
  // do Coolify (destino configurado: /app/uploads) -- gravar em qualquer outro
  // caminho sob DATA_DIR (ex: '/app/configuracoes') não sobrevive a um redeploy,
  // porque só '/app/uploads' está coberto pelo volume dedicado.
  const base = process.env.DATA_DIR || path.join(process.cwd(), "data");
  return path.join(base, "uploads", "configuracoes");
}

function getConfigPath(): string {
  const contaId = getCurrentContaId() || process.env.DEFAULT_CONTA_ID || LEGACY_DEFAULT_CONTA_ID;
  return path.join(getConfigDir(), contaId, "funcoes-menu.json");
}
function getLegacyConfigPath(): string { return path.join(getConfigDir(), "funcoes-menu.json"); }

function asBooleanRecord(input: unknown): Record<string, FeatureValue> {
  if (!input || typeof input !== "object") return {};
  return Object.fromEntries(
    Object.entries(input as Record<string, unknown>)
      .filter(([key, value]) => key && typeof value === "boolean")
      .map(([key, value]) => [key, Boolean(value)])
  );
}

export function normalizarFeatureAccessConfig(input: unknown): FeatureAccessConfig {
  const raw = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const userOverridesRaw = raw.userOverrides && typeof raw.userOverrides === "object"
    ? raw.userOverrides as Record<string, unknown>
    : {};

  const userOverrides: Record<string, Record<string, FeatureValue>> = {};
  for (const [userId, values] of Object.entries(userOverridesRaw)) {
    if (!userId) continue;
    const normalized = asBooleanRecord(values);
    if (Object.keys(normalized).length > 0) userOverrides[userId] = normalized;
  }

  return {
    version: 1,
    global: asBooleanRecord(raw.global),
    userOverrides,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
    updatedBy: typeof raw.updatedBy === "string" ? raw.updatedBy : null,
  };
}

export function carregarFeatureAccessConfig(): FeatureAccessConfig {
  const file = getConfigPath();
  try {
    let selected = file;
    if (!fs.existsSync(selected)) {
      const contaId = getCurrentContaId() || process.env.DEFAULT_CONTA_ID || LEGACY_DEFAULT_CONTA_ID;
      const legacy = getLegacyConfigPath();
      if (contaId === LEGACY_DEFAULT_CONTA_ID && fs.existsSync(legacy)) selected = legacy;
      else return { ...DEFAULT_CONFIG };
    }
    const parsed = JSON.parse(fs.readFileSync(selected, "utf8"));
    return normalizarFeatureAccessConfig(parsed);
  } catch (err) {
    console.error("[featureAccess] Falha ao carregar configuração de menu/funções:", err);
    return { ...DEFAULT_CONFIG };
  }
}

export function salvarFeatureAccessConfig(input: unknown, updatedBy?: string | null): FeatureAccessConfig {
  const config = normalizarFeatureAccessConfig(input);
  config.updatedAt = new Date().toISOString();
  config.updatedBy = updatedBy || null;

  const dir = getConfigDir();
  fs.mkdirSync(dir, { recursive: true });
  const file = getConfigPath();
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(config, null, 2), "utf8");
  fs.renameSync(temp, file);
  return config;
}

export function isFeatureEnabledForUser(
  config: FeatureAccessConfig,
  featureKey: string,
  userId?: string | null,
): boolean {
  if (!featureKey) return true;
  const override = userId ? config.userOverrides?.[userId]?.[featureKey] : undefined;
  if (typeof override === "boolean") return override;
  const global = config.global?.[featureKey];
  if (typeof global === "boolean") return global;
  return true;
}

export function getUserFeatureOverrides(config: FeatureAccessConfig, userId?: string | null): Record<string, FeatureValue> {
  if (!userId) return {};
  return { ...(config.userOverrides?.[userId] || {}) };
}
