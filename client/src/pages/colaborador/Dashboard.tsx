import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileSignature,
  FileText,
  LayoutDashboard,
  Loader2,
  Plus,
  RefreshCw,
  Target,
  Users,
  WalletCards,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import ColaboradorLayout from "./Layout";

type Row = Record<string, any>;

type WorkspaceData = {
  empresas: Row[];
  pessoas: Row[];
  orcamentos: Row[];
  contratos: Row[];
};

function collection(value: any, keys: string[] = []): Row[] {
  if (Array.isArray(value)) return value;
  for (const key of keys) {
    if (Array.isArray(value?.[key])) return value[key];
  }
  if (Array.isArray(value?.data)) return value.data;
  return [];
}

function dateValue(row: Row): number {
  const raw = row.atualizado_em || row.updated_at || row.criado_em || row.created_at || row.data_criacao;
  const value = raw ? new Date(raw).getTime() : 0;
  return Number.isFinite(value) ? value : 0;
}

function dateLabel(row: Row): string {
  const raw = row.atualizado_em || row.updated_at || row.criado_em || row.created_at || row.data_criacao;
  if (!raw) return "Sem data";
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? "Sem data" : date.toLocaleDateString("pt-BR");
}

function money(value: any): string {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function statusLabel(value: any): string {
  return String(value || "em andamento")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusTone(value: any): string {
  const status = String(value || "").toLowerCase();
  if (["finalizado", "aprovado", "assinado", "ativo", "concluido", "concluído"].some((item) => status.includes(item))) {
    return "bg-emerald-50 text-emerald-700";
  }
  if (["cancelado", "reprovado", "encerrado"].some((item) => status.includes(item))) {
    return "bg-rose-50 text-rose-700";
  }
  return "bg-amber-50 text-amber-700";
}

export default function Dashboard() {
  const { colaborador } = useAuth();
  const [data, setData] = useState<WorkspaceData>({ empresas: [], pessoas: [], orcamentos: [], contratos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    const [empresas, pessoas, orcamentos, contratos] = await Promise.all([
      apiFetch("/api/empresas?limit=500").catch(() => []),
      apiFetch("/api/clientes-pf").catch(() => []),
      apiFetch("/api/orcamentos?limit=100").catch(() => []),
      apiFetch("/api/contratos?limit=100").catch(() => []),
    ]);

    const normalized = {
      empresas: collection(empresas, ["empresas"]),
      pessoas: collection(pessoas, ["clientes", "clientes_pf", "pessoas"]),
      orcamentos: collection(orcamentos, ["orcamentos"]),
      contratos: collection(contratos, ["contratos"]),
    };

    if (!normalized.empresas.length && !normalized.pessoas.length && !normalized.orcamentos.length && !normalized.contratos.length) {
      setError("Ainda não há registros na conta. Use os atalhos abaixo para iniciar a operação.");
    }
    setData(normalized);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const nome = colaborador?.nome?.split(" ")[0] || "equipe";
  const clientes = data.empresas.length + data.pessoas.length;
  const propostasAtivas = data.orcamentos.filter((item) => !["cancelado", "finalizado"].includes(String(item.status || "").toLowerCase())).length;
  const valorPipeline = data.orcamentos.reduce((total, item) => total + Number(item.valor_total || item.valor || 0), 0);

  const recentes = useMemo(() => [
    ...data.orcamentos.map((item) => ({
      id: `orc-${item.id}`,
      title: item.titulo || item.numero || item.cliente_nome || "Orçamento comercial",
      subtitle: item.cliente_nome || item.cliente_documento || "Cliente sem identificação",
      type: "Orçamento",
      status: item.status,
      date: dateValue(item),
      label: dateLabel(item),
      href: "/colaborador/orcamentos",
    })),
    ...data.contratos.map((item) => ({
      id: `ctr-${item.id}`,
      title: item.titulo || item.numero || "Contrato comercial",
      subtitle: item.cliente_nome || item.empresa_nome || "Cliente sem identificação",
      type: "Contrato",
      status: item.status,
      date: dateValue(item),
      label: dateLabel(item),
      href: "/colaborador/contratos",
    })),
  ].sort((a, b) => b.date - a.date).slice(0, 6), [data]);

  const cards = [
    { label: "Clientes na carteira", value: clientes, hint: `${data.empresas.length} empresas · ${data.pessoas.length} pessoas`, icon: Users, tone: "text-violet-700 bg-violet-50" },
    { label: "Orçamentos e propostas", value: data.orcamentos.length, hint: `${propostasAtivas} em andamento`, icon: FileSignature, tone: "text-blue-700 bg-blue-50" },
    { label: "Contratos", value: data.contratos.length, hint: "Documentos comerciais da conta", icon: FileText, tone: "text-amber-700 bg-amber-50" },
    { label: "Valor em propostas", value: money(valorPipeline), hint: "Soma dos valores cadastrados", icon: WalletCards, tone: "text-emerald-700 bg-emerald-50", money: true },
  ];

  return (
    <ColaboradorLayout title="Visão de Performance">
      <div className="space-y-6 p-4 lg:p-6">
        <section className="relative overflow-hidden rounded-3xl bg-[#102a43] px-6 py-7 text-white shadow-xl shadow-slate-900/10 lg:px-8">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#0f9f91]/40 blur-3xl" />
          <div className="absolute bottom-[-5rem] right-1/4 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                <LayoutDashboard className="h-3.5 w-3.5" /> Work Pro · ambiente de performance
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Bom trabalho, {nome}.</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200">
                Organize a operação da sua empresa, acompanhe oportunidades e mantenha cada cliente avançando para o próximo passo.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/colaborador/empresas">
                <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#102a43] transition hover:bg-cyan-50">
                  <Plus className="h-4 w-4" /> Novo cliente
                </button>
              </Link>
              <Link href="/colaborador/orcamentos">
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20">
                  <FileSignature className="h-4 w-4" /> Nova proposta
                </button>
              </Link>
              <button onClick={loadData} className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-white/20" title="Atualizar dados">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
            <Target className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-[#0f9f91]" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                    <div className={`rounded-xl p-2.5 ${card.tone}`}><Icon className="h-5 w-5" /></div>
                  </div>
                  <p className={`mt-4 font-black tracking-tight text-slate-900 ${card.money ? "text-2xl" : "text-3xl"}`}>{card.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f9f91]">Fluxo de trabalho</p>
                <h2 className="mt-1 text-lg font-black text-[#102a43]">Próximos movimentos</h2>
              </div>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { title: "Cadastre sua carteira", text: "Mantenha empresas e pessoas organizadas para acelerar cada atendimento.", href: "/colaborador/empresas", icon: BriefcaseBusiness },
                { title: "Estruture uma proposta", text: "Monte um orçamento claro, com serviços, valores, validade e anexos.", href: "/colaborador/orcamentos", icon: FileSignature },
                { title: "Formalize o próximo passo", text: "Gere e acompanhe contratos comerciais a partir do cadastro do cliente.", href: "/colaborador/contratos", icon: CheckCircle2 },
                { title: "Acompanhe indicadores", text: "Use os módulos de indicadores para revisar a rotina e tomar decisões.", href: "/colaborador/previsao-faturamento", icon: Target },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} href={item.href}>
                    <div className="group flex h-full cursor-pointer gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-[#9ddbd4] hover:bg-[#f3fbfa]">
                      <div className="rounded-xl bg-white p-2.5 text-[#0f9f91] shadow-sm"><Icon className="h-5 w-5" /></div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[#102a43]">{item.title}</h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{item.text}</p>
                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#0f9f91]">Abrir módulo <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" /></span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f9f91]">Atividade recente</p>
                <h2 className="mt-1 text-lg font-black text-[#102a43]">Documentos comerciais</h2>
              </div>
              <Link href="/colaborador/orcamentos" className="text-xs font-bold text-[#0f9f91] hover:underline">Ver tudo</Link>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {recentes.length ? recentes.map((item) => (
                <Link key={item.id} href={item.href}>
                  <div className="flex cursor-pointer items-center gap-3 py-3 transition hover:bg-slate-50">
                    <div className="rounded-xl bg-slate-100 p-2 text-slate-500"><FileText className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="truncate text-xs text-slate-500">{item.type} · {item.subtitle}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${statusTone(item.status)}`}>{statusLabel(item.status)}</span>
                      <p className="mt-1 text-[10px] text-slate-400">{item.label}</p>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="py-10 text-center">
                  <FileText className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-3 text-sm font-semibold text-slate-600">Sua atividade aparecerá aqui</p>
                  <p className="mt-1 text-xs text-slate-400">Crie o primeiro orçamento ou contrato para começar.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </ColaboradorLayout>
  );
}
