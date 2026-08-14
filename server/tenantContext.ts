import { AsyncLocalStorage } from "node:async_hooks";

export const LEGACY_DEFAULT_CONTA_ID = "00000000-0000-4000-8000-000000000001";

type TenantStore = { contaId: string };
const storage = new AsyncLocalStorage<TenantStore>();

export function runWithTenant<T>(contaId: string, callback: () => T): T {
  return storage.run({ contaId }, callback);
}

export function getCurrentContaId(): string | null {
  return storage.getStore()?.contaId || null;
}

export function requireCurrentContaId(): string {
  const id = getCurrentContaId();
  if (!id) throw new Error("Conta não disponível no contexto atual.");
  return id;
}
