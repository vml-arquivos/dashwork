import { Link } from "wouter";
import { ArrowRight, CheckCircle2, FileSignature, FileText, Gauge, Users } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const links = [
    { label: "Clientes", href: "/colaborador/empresas", icon: Users },
    { label: "Orçamentos e propostas", href: "/colaborador/orcamentos", icon: FileSignature },
    { label: "Contratos", href: "/colaborador/contratos", icon: FileText },
  ];

  return (
    <footer className="bg-[#102a43] text-white">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/workpro-mark.svg" alt="Work Pro" className="h-10 w-10 rounded-xl" />
              <span className="text-xl font-black tracking-tight">Work <span className="text-[#78d9ce]">Pro</span></span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              A plataforma para acelerar a rotina empresarial, conectar times e transformar cada oportunidade em próximo passo.
            </p>
            <Link href="/colaborador/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0f9f91] px-4 py-2.5 text-sm font-bold transition hover:bg-[#0b8176]">
              Entrar na plataforma <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[#78d9ce]">Na operação</h3>
            <ul className="mt-4 space-y-3">
              {links.map((link) => {
                const Icon = link.icon;
                return <li key={link.label}><Link href={link.href} className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"><Icon className="h-4 w-4 text-[#78d9ce]" /> {link.label}</Link></li>;
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[#78d9ce]">Work Pro</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li><Link href="/sobre" className="transition hover:text-white">Como funciona</Link></li>
              <li><Link href="/contato" className="transition hover:text-white">Fale com a equipe</Link></li>
              <li><Link href="/politica-privacidade" className="transition hover:text-white">Política de Privacidade</Link></li>
              <li><Link href="/termos-uso" className="transition hover:text-white">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Work Pro. Todos os direitos reservados.</p>
          <p className="inline-flex items-center gap-2"><Gauge className="h-3.5 w-3.5 text-[#78d9ce]" /> Aceleração e performance para empresas.</p>
        </div>
      </div>
    </footer>
  );
}
