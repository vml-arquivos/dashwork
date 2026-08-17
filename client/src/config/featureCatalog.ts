export type FeatureGroup = "visao" | "comercial" | "clientes" | "assessoria" | "financeiro" | "documentos" | "gestao";

export interface FeatureCatalogItem {
  key: string;
  group: FeatureGroup;
  label: string;
  href: string;
  description: string;
  adminOnly?: boolean;
}

export const FEATURE_GROUP_LABELS: Record<FeatureGroup, string> = {
  visao: "Visão de Performance",
  comercial: "Operação Comercial",
  clientes: "Clientes",
  assessoria: "Inteligência e Melhoria",
  financeiro: "Indicadores",
  documentos: "Documentos Comerciais",
  gestao: "Administração",
};

export const FEATURE_CATALOG: FeatureCatalogItem[] = [
  { key: "dashboard", group: "visao", label: "Dashboard", href: "/colaborador/dashboard", description: "Painel inicial com indicadores, atalhos e visão geral." },
  { key: "funil-vendas", group: "comercial", label: "Pipeline de Oportunidades", href: "/colaborador/crm", description: "CRM comercial, contatos e oportunidades da conta." },
  { key: "triagem-leads", group: "comercial", label: "Qualificação", href: "/colaborador/triagem", description: "Qualificação e análise inicial de oportunidades." },
  { key: "simulacoes", group: "comercial", label: "Planejamentos", href: "/colaborador/simulacoes", description: "Histórico e gestão de planejamentos comerciais." },
  { key: "calculadora", group: "comercial", label: "Precificação", href: "/colaborador/calculadora", description: "Calculadora interna para estruturar valores e condições." },
  { key: "orcamentos", group: "comercial", label: "Orçamentos e Propostas", href: "/colaborador/orcamentos", description: "Criação, PDF, envio e acompanhamento de propostas comerciais." },
  { key: "clientes-pj", group: "clientes", label: "Empresas", href: "/colaborador/empresas", description: "Carteira de empresas, dados, documentos e histórico da conta." },
  { key: "empresa-tab-dados", group: "clientes", label: "Aba Dados da Empresa", href: "/colaborador/empresas?aba=visao_geral", description: "Exibe a aba Dados da Empresa dentro de Clientes PJ." },
  { key: "empresa-tab-dossie", group: "clientes", label: "Aba Dossiê / Laudo IA", href: "/colaborador/empresas?aba=dossie_credito", description: "Exibe a aba de dossiê e laudo de crédito dentro da empresa." },
  { key: "empresa-tab-inteligencia-360", group: "clientes", label: "Aba Inteligência 360", href: "/colaborador/empresas?aba=inteligencia_360", description: "Exibe a Central de Inteligência — Cliente 360 dentro da empresa." },
  { key: "empresa-tab-esteira-credito", group: "clientes", label: "Aba Esteira de Crédito", href: "/colaborador/empresas?aba=esteira_credito", description: "Exibe a esteira de crédito e assessoria da empresa." },
  { key: "empresa-tab-acervo-documental", group: "clientes", label: "Aba Acervo Documental", href: "/colaborador/empresas?aba=documentos", description: "Exibe o acervo documental dentro da empresa." },
  { key: "empresa-tab-conversas", group: "clientes", label: "Aba Conversas", href: "/colaborador/empresas?aba=followup", description: "Exibe conversas e follow-ups dentro da empresa." },
  { key: "empresa-tab-simulacoes", group: "clientes", label: "Aba Simulações", href: "/colaborador/empresas?aba=simulacoes", description: "Exibe simulações vinculadas à empresa." },
  { key: "empresa-tab-contratos", group: "clientes", label: "Aba Contratos Firmados", href: "/colaborador/empresas?aba=contratos", description: "Exibe contratos firmados vinculados à empresa." },
  { key: "empresa-tab-historico", group: "clientes", label: "Aba Histórico", href: "/colaborador/empresas?aba=historico", description: "Exibe histórico e Histórico 360 da empresa." },
  { key: "empresa-action-atualizar-cadastro", group: "clientes", label: "Ação Atualizar Cadastro", href: "/colaborador/empresas#atualizar-cadastro", description: "Permite atualizar dados cadastrais pela Receita Federal dentro da empresa." },
  { key: "empresa-action-editar", group: "clientes", label: "Ação Editar Empresa", href: "/colaborador/empresas#editar", description: "Permite abrir edição cadastral da empresa." },
  { key: "empresa-action-arquivar", group: "clientes", label: "Ação Arquivar Empresa", href: "/colaborador/empresas#arquivar", description: "Permite arquivar empresa preservando documentos." },
  { key: "empresa-action-nova-simulacao", group: "clientes", label: "Ação Nova Simulação", href: "/colaborador/empresas#nova-simulacao", description: "Permite iniciar nova simulação a partir da empresa." },
  { key: "empresa-action-novo-contrato", group: "clientes", label: "Ação Novo Contrato", href: "/colaborador/empresas#novo-contrato", description: "Permite iniciar novo contrato a partir da empresa." },
  { key: "empresa-action-iniciar-conversa", group: "clientes", label: "Ação Iniciar Conversa", href: "/colaborador/empresas#iniciar-conversa", description: "Permite iniciar conversa/follow-up dentro da empresa." },
  { key: "clientes-pf", group: "clientes", label: "Pessoas", href: "/colaborador/clientes", description: "Carteira de pessoas e contatos relacionados à operação." },
  { key: "relatorios-pj", group: "clientes", label: "Relatórios de Clientes", href: "/colaborador/relatorio-empresas", description: "Relatórios e exportações da carteira de clientes." },
  { key: "cadastros-incompletos", group: "clientes", label: "Cadastros Incompletos", href: "/colaborador/cadastros-incompletos", description: "Fila de cadastros com pendências ou incompletos." },
  { key: "assessoria-ia", group: "assessoria", label: "Central de Insights", href: "/colaborador/assessoria", description: "Central de análise e recomendações para acelerar a operação." },
  { key: "diagnostico-credito", group: "assessoria", label: "Diagnóstico de Performance", href: "/colaborador/diagnostico-credito", description: "Diagnóstico consolidado da operação e dos próximos passos." },
  { key: "acompanhamento-bancario", group: "financeiro", label: "Acompanhamento Financeiro", href: "/colaborador/acompanhamento-bancario", description: "Acompanhamento financeiro periódico e relatórios inteligentes." },
  { key: "acompanhamento-financeiro", group: "financeiro", label: "Acompanhamento Financeiro", href: "/colaborador/acompanhamento-financeiro", description: "Acompanhamento financeiro semanal." },
  { key: "faturamento", group: "financeiro", label: "Faturamento e Previsão", href: "/colaborador/previsao-faturamento", description: "Visão de faturamento bruto, previsão e relatórios gerenciais." },
  { key: "contratos", group: "documentos", label: "Contratos", href: "/colaborador/contratos", description: "Geração, gestão e acompanhamento de contratos comerciais." },
  { key: "documento-action-enviar-email", group: "documentos", label: "Ação Enviar Documento por E-mail", href: "/colaborador/orcamentos#enviar-email", description: "Permite enviar orçamento, contrato, simulação e demais documentos direto por e-mail, usando o cadastro do cliente." },
  { key: "documento-action-enviar-whatsapp", group: "documentos", label: "Ação Compartilhar Documento por WhatsApp", href: "/colaborador/orcamentos#enviar-whatsapp", description: "Permite gerar link de WhatsApp pré-preenchido para enviar orçamento, contrato, simulação e demais documentos." },
  { key: "contadores", group: "gestao", label: "Parceiros", href: "/colaborador/contadores", description: "Cadastro e gestão de parceiros da conta.", adminOnly: true },
  { key: "integracoes", group: "gestao", label: "Integrações", href: "/colaborador/integracoes", description: "Configuração e acompanhamento de integrações.", adminOnly: true },
  { key: "usuarios", group: "gestao", label: "Usuários", href: "/colaborador/usuarios", description: "Cadastro e gestão de colaboradores.", adminOnly: true },
  { key: "personalizacao", group: "gestao", label: "Personalização da Conta", href: "/colaborador/personalizacao", description: "Logo, identidade documental, dados institucionais e signatários da conta.", adminOnly: true },
  { key: "configuracao-funcoes", group: "gestao", label: "Menu e Funções", href: "/colaborador/configuracao-funcoes", description: "Configuração premium de visibilidade do menu e das funções.", adminOnly: true },
];

export const FEATURE_BY_HREF = FEATURE_CATALOG.reduce<Record<string, FeatureCatalogItem>>((acc, item) => {
  acc[item.href] = item;
  return acc;
}, {});

export function getFeatureByHref(href?: string | null): FeatureCatalogItem | undefined {
  if (!href) return undefined;
  const exact = FEATURE_BY_HREF[href];
  if (exact) return exact;
  return FEATURE_CATALOG
    .filter(item => href === item.href || href.startsWith(item.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0];
}
