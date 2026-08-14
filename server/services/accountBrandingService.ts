import fs from "node:fs";
import { systemPool } from "../databasePools";
import { getCurrentContaId, LEGACY_DEFAULT_CONTA_ID } from "../tenantContext";

export type AccountBranding = {
  conta_id: string; nome_exibicao: string; razao_social: string | null; nome_fantasia: string | null;
  cnpj: string | null; telefone: string | null; whatsapp: string | null; email: string | null; site: string | null;
  endereco: string | null; cidade: string | null; uf: string | null; cep: string | null;
  logo_path: string | null; logo_mime: string | null; logo_data_uri: string | null;
  cor_primaria: string; cor_secundaria: string;
  rodape_linha_1: string | null; rodape_linha_2: string | null; rodape_linha_3: string | null;
  signatario_nome: string | null; signatario_cargo: string | null; signatario_cpf: string | null; signatario_email: string | null;
};
const cache = new Map<string,{expires:number,value:AccountBranding|null}>();
const TTL=30000;
function safeHex(v:unknown,f:string){const s=String(v||"").trim(); return /^#[0-9a-fA-F]{6}$/.test(s)?s.toUpperCase():f;}
function logoDataUri(p:unknown,m:unknown){const file=String(p||""); if(!file||!fs.existsSync(file)) return null; try{return `data:${String(m||"image/png")};base64,${fs.readFileSync(file).toString("base64")}`;}catch{return null;}}
export function invalidateAccountBranding(id?:string|null){if(id)cache.delete(id);else cache.clear();}
export function getCachedAccountBranding(id?: string | null): AccountBranding | null {
  const conta=id||getCurrentContaId()||process.env.DEFAULT_CONTA_ID||LEGACY_DEFAULT_CONTA_ID;
  const c=cache.get(conta);
  return c && c.expires > Date.now() ? c.value : null;
}
export async function getAccountBranding(id?:string|null):Promise<AccountBranding|null>{
  const conta=id||getCurrentContaId()||process.env.DEFAULT_CONTA_ID||LEGACY_DEFAULT_CONTA_ID;
  const c=cache.get(conta); if(c&&c.expires>Date.now()) return c.value;
  const {rows}=await systemPool.query(`SELECT cp.id AS conta_id, cp.nome AS conta_nome,p.* FROM contas_plataforma cp LEFT JOIN conta_personalizacao p ON p.conta_id=cp.id WHERE cp.id=$1 LIMIT 1`,[conta]);
  const r=rows[0]; if(!r){cache.set(conta,{expires:Date.now()+TTL,value:null});return null;}
  const value:AccountBranding={conta_id:r.conta_id,nome_exibicao:r.nome_exibicao||r.nome_fantasia||r.conta_nome||"Empresa",razao_social:r.razao_social||null,nome_fantasia:r.nome_fantasia||null,cnpj:r.cnpj||null,telefone:r.telefone||null,whatsapp:r.whatsapp||null,email:r.email||null,site:r.site||null,endereco:r.endereco||null,cidade:r.cidade||null,uf:r.uf||null,cep:r.cep||null,logo_path:r.logo_path||null,logo_mime:r.logo_mime||null,logo_data_uri:logoDataUri(r.logo_path,r.logo_mime),cor_primaria:safeHex(r.cor_primaria,"#1B3A8C"),cor_secundaria:safeHex(r.cor_secundaria,"#F0A500"),rodape_linha_1:r.rodape_linha_1||null,rodape_linha_2:r.rodape_linha_2||null,rodape_linha_3:r.rodape_linha_3||null,signatario_nome:r.signatario_nome||null,signatario_cargo:r.signatario_cargo||null,signatario_cpf:r.signatario_cpf||null,signatario_email:r.signatario_email||null};
  cache.set(conta,{expires:Date.now()+TTL,value}); return value;
}
