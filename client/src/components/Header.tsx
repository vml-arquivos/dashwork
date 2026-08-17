import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowRight, Lock, Gauge, Users, FileSignature, FileText } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  ctaLabel?: string;
  ctaHref?: string;
}

const navItems = [
  { label: "Início", href: "/" },
  { label: "Como funciona", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

const resourceItems = [
  { label: "Clientes", desc: "Carteira organizada em um só lugar", icon: Users },
  { label: "Orçamentos e propostas", desc: "Mais clareza para vender e avançar", icon: FileSignature },
  { label: "Contratos", desc: "Formalização simples e rastreável", icon: FileText },
];

export default function Header({ ctaLabel = "Acessar Work Pro", ctaHref = "/colaborador/login" }: HeaderProps = {}) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="flex flex-shrink-0 items-center gap-3" aria-label="Work Pro — página inicial">
            <img src="/workpro-mark.svg" alt="Work Pro" className="h-10 w-10 rounded-xl object-contain" />
            <span className="hidden text-lg font-black tracking-tight text-[#102a43] sm:inline">Work <span className="text-[#0f9f91]">Pro</span></span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={location === item.href ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#f0faf8] hover:text-[#0f8177] ${location === item.href ? "text-[#0f8177]" : "text-slate-600"}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="group relative">
              <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-[#f0faf8] hover:text-[#0f8177]">
                <Gauge className="h-4 w-4" /> Recursos
              </button>
              <div className="pointer-events-none absolute left-0 top-full mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:pointer-events-auto group-hover:opacity-100">
                {resourceItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex gap-3 rounded-xl p-3">
                      <div className="rounded-lg bg-[#eefaf8] p-2 text-[#0f9f91]"><Icon className="h-4 w-4" /></div>
                      <div><p className="text-sm font-bold text-[#102a43]">{item.label}</p><p className="mt-0.5 text-xs text-slate-500">{item.desc}</p></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="hidden flex-shrink-0 items-center gap-2 lg:flex">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-slate-500 hover:text-[#102a43]">
              <Link href="/colaborador/login"><Lock className="h-3.5 w-3.5" /> Entrar</Link>
            </Button>
            <Button asChild size="lg" className="gap-2 bg-[#0f9f91] font-bold text-white hover:bg-[#0b8176]">
              <Link href={ctaHref} data-cta-position="header-desktop">{ctaLabel} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <button className="rounded-lg p-2 text-[#102a43] lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t border-slate-100 py-4 lg:hidden" aria-label="Navegação móvel">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-base font-semibold text-slate-700 hover:bg-[#f0faf8]">{item.label}</Link>
              ))}
              <div className="mt-3 space-y-2 border-t border-slate-100 px-2 pt-4">
                <Button asChild className="w-full bg-[#0f9f91] font-bold hover:bg-[#0b8176]"><Link href={ctaHref} onClick={() => setMobileMenuOpen(false)}>{ctaLabel}</Link></Button>
                <Button asChild variant="outline" className="w-full gap-1.5"><Link href="/colaborador/login" onClick={() => setMobileMenuOpen(false)}><Lock className="h-3.5 w-3.5" /> Entrar na plataforma</Link></Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
