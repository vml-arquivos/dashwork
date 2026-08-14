import pkg from "pg";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const { Pool } = pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const databaseUrl = process.env.SYSTEM_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("SYSTEM_DATABASE_URL/DATABASE_URL não configurada");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl, ssl: false, max: 1 });
try {
  const sql = readFileSync(join(__dirname, "..", "db", "migrations", "081_multiempresa_personalizacao.sql"), "utf8");
  await pool.query(sql);
  console.log("✅ Migration 081 aplicada: multiempresa + personalização.");
} catch (e) {
  console.error("❌ Migration 081 falhou:", e?.message || e);
  process.exitCode = 1;
} finally {
  await pool.end();
}
