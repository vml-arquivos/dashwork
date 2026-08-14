/**
 * Work Pro — aplica migrations numeradas essenciais que não fazem parte de db/migrate.sql.
 *
 * Uso em produção:
 *   node scripts/migrate-residual-schema.mjs
 *
 * O conjunto é aditivo e idempotente: as migrations possuem IF NOT EXISTS
 * e são executadas na ordem de dependência, preservando os dados existentes.
 */
import pkg from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { Pool } = pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, "..", "db", "migrations");
const migrationFiles = [
  "../schema_fase1_blindagem.sql",
  "013_colaboradores_perfil_operacional.sql",
  "014_chatwoot_base_agente.sql",
  "072_automation_engine.sql",
];

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false" } : false,
});

async function main() {
  console.log("\\n🗄️  WORK PRO — Aplicando migrations residuais do schema...");
  const client = await pool.connect();
  try {
    for (const file of migrationFiles) {
      const sql = readFileSync(join(migrationsDir, file), "utf8");
      console.log(`▶ ${file}`);
      await client.query(sql);
      console.log(`✅ ${file}`);
    }
    console.log("✅ Schema residual aplicado com sucesso.\\n");
  } catch (err) {
    console.error("❌ Falha na migration residual:", err.message);
    if (err.detail) console.error(err.detail);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
