import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileSignature,
  FileText,
  Gauge,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const modules = [
  {
    icon: Users,
    title: "Clientes organizados",
    description: "Centralize empresas e pessoas, histórico de relacionamento, dados cadastrais e próximos passos em um único lugar.",
  },
  {
    icon: FileSignature,
    title: "Orçamentos e propostas",
    description: "Monte oportunidades comerciais com valores, itens, prazos e condições prontas para apresentar ao cliente.",
  },
  {
    icon: FileText,
    title: "Contratos com método",
    description: "Transforme propostas aprovadas em documentos comerciais e acompanhe o avanço de cada negociação.",
  },
  {
    icon: BarChart3,
    title: "Indicadores de performance",
    description: "Veja o que está parado, o que avança e onde sua equipe deve concentrar energia ao longo do dia.",
  },
];

const operatingSteps = [
  "Cadastre sua empresa e convide os usuários da equipe.",
  "Organize clientes, oportunidades e documentos comerciais.",
  "Acompanhe a execução com indicadores claros e próximos passos.",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SEO
        title="Work Pro — Aceleração e Performance Empresarial"
        description="Work Pro é a plataforma multiusuários para organizar clientes, orçamentos, propostas, contratos e a performance diária da sua empresa."
        keywords="gestão empresarial, performance comercial, clientes, orçamentos, propostas, contratos, plataforma multiusuários"
        image="https://dashwork.destravacredito.com/workpro-mark.svg"
      />
      <Header />

      <main>
        <section className="relative overflow-hidden bg-[#102a43] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(15,159,145,.34),transparent_34%),radial-gradient(circle_at_12%_88%,rgba(55,113,177,.28),transparent_32%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.08fr_.92fr] md:px-10 md:py-28">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-200">
                <Sparkles className="h-4 w-4" /> Operação em ritmo de crescimento
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight md:text-6xl">
                Mais velocidade para decidir. Mais clareza para executar.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
                O Work Pro reúne a rotina comercial da sua empresa em uma plataforma simples, colaborativa e orientada a performance.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-[#0f9f91] font-bold text-white shadow-lg shadow-teal-950/20 hover:bg-[#0b8176]">
                  <Link href="/colaborador/login">Acessar o Work Pro <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 font-semibold text-white hover:bg-white/10 hover:text-white">
                  <a href="#modulos">Conhecer a plataforma</a>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-300" /> Multiusuários por conta</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-300" /> Dados organizados por empresa</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-300" /> Permissões por função</span>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
              <div className="relative w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
                <div className="rounded-3xl bg-white p-5 text-slate-900 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Visão de performance</p>
                      <p className="mt-1 text-xl font-black text-[#102a43]">Sua operação hoje</p>
                    </div>
                    <div className="rounded-2xl bg-teal-50 p-3 text-[#0f9f91]"><Gauge className="h-6 w-6" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 py-5">
                    <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Clientes ativos</p><p className="mt-2 text-3xl font-black text-[#102a43]">—</p><p className="mt-1 text-xs text-slate-400">dados da sua conta</p></div>
                    <div className="rounded-2xl bg-teal-50 p-4"><p className="text-xs font-semibold text-teal-700">Propostas em avanço</p><p className="mt-2 text-3xl font-black text-[#0f9f91]">—</p><p className="mt-1 text-xs text-teal-700/70">acompanhe o ritmo</p></div>
                  </div>
                  <div className="rounded-2xl bg-[#102a43] p-4 text-white">
                    <div className="flex items-center gap-3"><Activity className="h-5 w-5 text-teal-300" /><p className="font-bold">Próximas ações</p></div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">A equipe visualiza pendências e oportunidades sem depender de planilhas espalhadas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="modulos" className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0f9f91]">Uma base para o dia a dia</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#102a43] md:text-5xl">Tudo que sua equipe precisa para sair do improviso.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">O Work Pro foi desenhado para dar visibilidade à operação sem adicionar complexidade desnecessária.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return <article key={module.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0f9f91]"><Icon className="h-6 w-6" /></div>
                <h3 className="mt-6 text-xl font-black text-[#102a43]">{module.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{module.description}</p>
              </article>;
            })}
          </div>
        </section>

        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-24">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0f9f91]">Como funciona</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#102a43] md:text-4xl">Uma rotina mais leve, um time mais alinhado.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Cada conta tem seu espaço de trabalho, seus usuários e suas permissões. A gestão acompanha a operação sem perder o contexto do negócio.</p>
              <Button asChild className="mt-8 bg-[#102a43] font-bold hover:bg-[#183f60]"><Link href="/colaborador/login">Entrar na área da empresa <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </div>
            <div className="space-y-4">
              {operatingSteps.map((step, index) => <div key={step} className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f9f91] text-sm font-black text-white">{index + 1}</div><p className="pt-1 font-semibold leading-6 text-slate-700">{step}</p></div>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <div className="rounded-[2rem] bg-[#0f9f91] px-7 py-12 text-center text-white md:px-16">
            <ShieldCheck className="mx-auto h-10 w-10 text-teal-100" />
            <h2 className="mt-5 text-3xl font-black md:text-4xl">Sua empresa no controle da próxima ação.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-teal-50">Acesse o ambiente da sua conta para cadastrar clientes, construir propostas, formalizar contratos e acompanhar a performance da equipe.</p>
            <Button asChild size="lg" className="mt-8 bg-white font-bold text-[#0f9f91] hover:bg-teal-50"><Link href="/colaborador/login">Acessar Work Pro <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
