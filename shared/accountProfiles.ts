export type AccountProfileKey =
  | "credito_contabil"
  | "contabil"
  | "assessoria_credito"
  | "servicos"
  | "obras_manutencao"
  | "tecnologia"
  | "consultoria";

export const ACCOUNT_PROFILE_LABELS: Record<AccountProfileKey, string> = {
  credito_contabil: "Crédito + Contábil (base Destrava)",
  contabil: "Contábil",
  assessoria_credito: "Assessoria de crédito",
  servicos: "Prestação de serviços",
  obras_manutencao: "Obras e manutenção",
  tecnologia: "Tecnologia e sistemas",
  consultoria: "Consultoria / assessoria",
};

const BASE_PRODUTIVIDADE = [
  "dashboard", "orcamentos", "clientes-pj", "clientes-pf", "contratos",
  "documento-action-enviar-email", "documento-action-enviar-whatsapp",
  "usuarios", "personalizacao", "configuracao-funcoes",
];

const CREDITOS = [
  "funil-vendas", "triagem-leads", "simulacoes", "calculadora", "relatorios-pj",
  "cadastros-incompletos", "assessoria-ia", "diagnostico-credito",
  "acompanhamento-bancario", "acompanhamento-financeiro", "faturamento",
  "contadores", "integracoes",
];

export const ACCOUNT_PROFILE_MODULES: Record<AccountProfileKey, string[]> = {
  credito_contabil: [...BASE_PRODUTIVIDADE, ...CREDITOS],
  contabil: [...BASE_PRODUTIVIDADE, "relatorios-pj", "faturamento", "contadores"],
  assessoria_credito: [...BASE_PRODUTIVIDADE, ...CREDITOS],
  servicos: [...BASE_PRODUTIVIDADE],
  obras_manutencao: [...BASE_PRODUTIVIDADE],
  tecnologia: [...BASE_PRODUTIVIDADE, "funil-vendas"],
  consultoria: [...BASE_PRODUTIVIDADE, "funil-vendas"],
};

export function modulesForAccountProfile(profile: string): string[] {
  const key = profile as AccountProfileKey;
  return [...(ACCOUNT_PROFILE_MODULES[key] || ACCOUNT_PROFILE_MODULES.servicos)];
}

export const ACCOUNT_CONTROLLED_FEATURES = Array.from(new Set([...BASE_PRODUTIVIDADE, ...CREDITOS]));
