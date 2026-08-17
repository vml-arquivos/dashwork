// Dados institucionais públicos do Work Pro.
// A identidade e os dados específicos de cada empresa ficam na Central de Personalização da conta.
export const COMPANY = {
  nome: "Work Pro",
  nomeCompleto: "Work Pro — Aceleração e Performance Empresarial",
  instagram: "",
  instagramUrl: "#",
  linkedinUrl: "#",

  telefone: "Atendimento pelo administrador da conta",
  telefoneLink: "#",
  whatsapp: "Atendimento pelo administrador da conta",
  whatsappLink: "#",
  whatsappLinkMsg: (_msg: string) => "#",
  email: "contato@dashwork.destravacredito.com",
  emailLink: "mailto:contato@dashwork.destravacredito.com",

  sede: {
    label: "Operação digital",
    endereco: "Atendimento online",
    cidade: "Brasil",
    enderecoCompleto: "Atendimento online para empresas",
    mapUrl: "#",
  },
  filialGoiania: {
    label: "Atendimento remoto",
    endereco: "Ambiente digital Work Pro",
    cidade: "Brasil",
    enderecoCompleto: "Ambiente digital Work Pro",
    mapUrl: "#",
  },

  horario: {
    semana: "Atendimento conforme a disponibilidade da sua conta",
    sabado: "",
  },
} as const;
