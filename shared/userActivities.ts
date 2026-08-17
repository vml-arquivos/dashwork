export type UserActivityKey =
  | "gestao"
  | "comercial"
  | "atendimento"
  | "operacoes"
  | "financeiro"
  | "administrativo";

export interface UserActivityDefinition {
  key: UserActivityKey;
  label: string;
  description: string;
  dashboardPath: string;
  modules: string[];
}

const COMMON_MODULES = ["dashboard", "clientes-pj", "clientes-pf"];

export const USER_ACTIVITY_DEFINITIONS: Record<UserActivityKey, UserActivityDefinition> = {
  gestao: {
    key: "gestao",
    label: "Gestão e performance",
    description: "Visão executiva da carteira, resultados e operação da empresa.",
    dashboardPath: "/colaborador/dashboard",
    modules: [...COMMON_MODULES, "orcamentos", "contratos", "relatorios-pj", "faturamento", "usuarios", "personalizacao"],
  },
  comercial: {
    key: "comercial",
    label: "Comercial e vendas",
    description: "Pipeline, oportunidades, clientes, orçamentos e contratos comerciais.",
    dashboardPath: "/colaborador/crm",
    modules: [...COMMON_MODULES, "funil-vendas", "orcamentos", "contratos"],
  },
  atendimento: {
    key: "atendimento",
    label: "Atendimento e relacionamento",
    description: "Carteira própria, follow-ups e relacionamento diário com clientes.",
    dashboardPath: "/colaborador/meu-crm",
    modules: [...COMMON_MODULES, "funil-vendas", "contratos"],
  },
  operacoes: {
    key: "operacoes",
    label: "Operações comerciais",
    description: "Execução de cadastros, orçamentos, propostas e contratos.",
    dashboardPath: "/colaborador/orcamentos",
    modules: [...COMMON_MODULES, "orcamentos", "contratos"],
  },
  financeiro: {
    key: "financeiro",
    label: "Financeiro e indicadores",
    description: "Acompanhamento financeiro, faturamento e indicadores da carteira.",
    dashboardPath: "/colaborador/acompanhamento-financeiro",
    modules: [...COMMON_MODULES, "relatorios-pj", "faturamento", "acompanhamento-financeiro"],
  },
  administrativo: {
    key: "administrativo",
    label: "Administrativo",
    description: "Rotinas internas, cadastros e acompanhamento geral da operação.",
    dashboardPath: "/colaborador/dashboard",
    modules: [...COMMON_MODULES, "orcamentos", "contratos", "usuarios"],
  },
};

export const USER_ACTIVITY_KEYS = Object.keys(USER_ACTIVITY_DEFINITIONS) as UserActivityKey[];

export function normalizarAtividade(value: unknown): UserActivityKey {
  const normalized = String(value || "").trim().toLowerCase() as UserActivityKey;
  return USER_ACTIVITY_DEFINITIONS[normalized] ? normalized : "administrativo";
}

export function getUserActivityDefinition(value: unknown): UserActivityDefinition {
  return USER_ACTIVITY_DEFINITIONS[normalizarAtividade(value)];
}

export function modulesForUserActivity(value: unknown): string[] {
  return [...getUserActivityDefinition(value).modules];
}

export function dashboardPathForUserActivity(value: unknown): string {
  return getUserActivityDefinition(value).dashboardPath;
}
