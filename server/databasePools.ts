import pkg from "pg";
import type { Pool as PgPool } from "pg";
import { getCurrentContaId, LEGACY_DEFAULT_CONTA_ID } from "./tenantContext";

const { Pool } = pkg;
const DEFAULT_CONTA_ID = process.env.DEFAULT_CONTA_ID || LEGACY_DEFAULT_CONTA_ID;

const baseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

function pgOptionsForTenant(contaId: string) {
  return `-c app.conta_id=${contaId}`;
}

const TENANT_DB_ROLE = String(process.env.TENANT_DB_ROLE || "ritmo_tenant_app").trim();
if (!/^[a-z_][a-z0-9_]*$/i.test(TENANT_DB_ROLE)) {
  throw new Error("TENANT_DB_ROLE inválida.");
}

function createPool(extra: Record<string, unknown> = {}, restrictToTenantRole = false): PgPool {
  const dbPool = new Pool({ ...baseConfig, ...extra } as any) as PgPool;
  dbPool.on("error", (err) => console.error("[DB] Erro inesperado no pool:", err.message));

  if (restrictToTenantRole) {
    const rawConnect = dbPool.connect.bind(dbPool);
    const initialized = new WeakSet<object>();
    const secureConnect = async () => {
      const client: any = await rawConnect();
      if (!initialized.has(client)) {
        try {
          // SET ROLE altera o current_user usado nas verificações de permissão/RLS.
          await client.query(`SET ROLE ${TENANT_DB_ROLE}`);
          initialized.add(client);
        } catch (err) {
          try { client.release(true); } catch {}
          throw new Error(`[DB] Não foi possível ativar a role multiempresa ${TENANT_DB_ROLE}: ${String((err as any)?.message || err)}`);
        }
      }
      return client;
    };

    (dbPool as any).connect = secureConnect;
    (dbPool as any).query = async (...args: any[]) => {
      const client: any = await secureConnect();
      try { return await client.query(...args); }
      finally { client.release(); }
    };
  }
  return dbPool;
}

// Pool global: startup/idempotências antigas, login, administração da plataforma,
// conteúdo público e rotinas de sistema. O conta_id legado garante que inserts
// públicos já existentes no Destrava continuem pertencendo à conta original.
export const systemPool = createPool({
  connectionString: process.env.SYSTEM_DATABASE_URL || process.env.DATABASE_URL,
  max: 5,
  options: `-c app.system_mode=1 -c app.conta_id=${DEFAULT_CONTA_ID}`,
}, false);

// Alias de compatibilidade. Não é usado para requisições autenticadas.
export const basePool = systemPool;

const tenantPools = new Map<string, PgPool>();
export function getTenantPool(contaId: string): PgPool {
  let dbPool = tenantPools.get(contaId);
  if (dbPool) return dbPool;
  dbPool = createPool({ options: pgOptionsForTenant(contaId), max: 6 }, true);
  tenantPools.set(contaId, dbPool);
  return dbPool;
}

function activePool(): PgPool {
  const contaId = getCurrentContaId();
  return contaId ? getTenantPool(contaId) : systemPool;
}

export const pool = new Proxy(systemPool as any, {
  get(_target, prop) {
    const selected = activePool() as any;
    const value = selected[prop as any];
    return typeof value === "function" ? value.bind(selected) : value;
  },
}) as PgPool;

export async function closeAllPools(): Promise<void> {
  const unique = new Set<PgPool>([systemPool, ...tenantPools.values()]);
  await Promise.allSettled(Array.from(unique).map((p) => p.end()));
}
