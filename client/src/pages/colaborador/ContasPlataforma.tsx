import { useEffect, useMemo, useState } from "react";
import Layout from "./Layout";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, CheckCircle2, LockKeyhole, RefreshCw, ShieldCheck, Users2 } from "lucide-react";
import {
  ACCOUNT_CONTROLLED_FEATURES,
  ACCOUNT_PROFILE_LABELS,
  ACCOUNT_PROFILE_MODULES,
  ACCOUNT_BRANCH_OPTIONS,
  type AccountProfileKey,
} from "@shared/accountProfiles";

const MODULE_LABELS: Record<string, string> = {
  dashboard: "Dashboard principal",
  orcamentos: "Orçamentos",
  "clientes-pj": "Clientes empresariais",
  "clientes-pf": "Clientes pessoa física",
  contratos: "Contratos",
  "funil-vendas": "Funil comercial",
  "triagem-leads": "Triagem e leads",
  simulacoes: "Simulações",
  calculadora: "Calculadoras",
  "relatorios-pj": "Relatórios empresariais",
  "cadastros-incompletos": "Cadastros incompletos",
  "assessoria-ia": "Assistência inteligente",
  "diagnostico-credito": "Diagnóstico de crédito",
  "acompanhamento-bancario": "Acompanhamento bancário",
  "acompanhamento-financeiro": "Acompanhamento financeiro",
  faturamento: "Faturamento",
  contadores: "Contadores e parceiros",
  integracoes: "Integrações",
  usuarios: "Usuários da empresa",
  personalizacao: "Personalização da empresa",
  "configuracao-funcoes": "Configuração de funções",
  "documento-action-enviar-email": "Envio por e-mail",
  "documento-action-enviar-whatsapp": "Envio por WhatsApp",
};

type Conta = {
  id: string;
  nome: string;
  slug: string;
  perfil_base: AccountProfileKey;
  ramo_atuacao?: AccountProfileKey;
  painel_base?: string;
  administrador_nome?: string;
  administrador_email?: string;
  status: string;
  modulos_ativos: string[];
  usuarios: number;
  criado_em?: string;
};

type CompanyForm = {
  nome: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  email_empresa: string;
  telefone: string;
  whatsapp: string;
  site: string;
  endereco: string;
  cidade: string;
  uf: string;
  cep: string;
  slug: string;
  ramo_atuacao: AccountProfileKey;
  admin_nome: string;
  admin_email: string;
  admin_senha: string;
  observacoes: string;
};

const EMPTY_FORM: CompanyForm = {
  nome: "",
  nome_fantasia: "",
  razao_social: "",
  cnpj: "",
  email_empresa: "",
  telefone: "",
  whatsapp: "",
  site: "",
  endereco: "",
  cidade: "",
  uf: "",
  cep: "",
  slug: "",
  ramo_atuacao: "financeiro",
  admin_nome: "",
  admin_email: "",
  admin_senha: "",
  observacoes: "",
};

function moduleLabel(module: string) {
  return MODULE_LABELS[module] || module.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function ContasPlataforma() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CompanyForm>(EMPTY_FORM);
  const [customModules, setCustomModules] = useState(false);
  const [modules, setModules] = useState<string[]>(ACCOUNT_PROFILE_MODULES.financeiro);

  const branchOptions = useMemo(() => ACCOUNT_BRANCH_OPTIONS, []);
  const defaultModules = useMemo(() => ACCOUNT_PROFILE_MODULES[form.ramo_atuacao], [form.ramo_atuacao]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/plataforma/contas");
      setContas(Array.isArray(data) ? data : []);
    } catch (requestError: any) {
      setError(requestError.message || "Não foi possível carregar as empresas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function changeField<K extends keyof CompanyForm>(field: K, value: CompanyForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function changeBranch(value: AccountProfileKey) {
    setForm((current) => ({ ...current, ramo_atuacao: value }));
    if (!customModules) setModules(ACCOUNT_PROFILE_MODULES[value]);
  }

  function toggleModule(module: string, checked: boolean) {
    setCustomModules(true);
    setModules((current) => checked ? Array.from(new Set([...current, module])) : current.filter((item) => item !== module));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setCustomModules(false);
    setModules(ACCOUNT_PROFILE_MODULES.financeiro);
  }

  async function createCompany() {
    setSaving(true);
    setError(null);
    try {
      await apiFetch("/api/plataforma/contas", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          modulos_ativos: customModules ? modules : defaultModules,
          painel_base: form.ramo_atuacao === "financeiro" ? "financeiro_atual" : "pacote_modular",
        }),
      });
      resetForm();
      await load();
    } catch (requestError: any) {
      setError(requestError.message || "Não foi possível criar a empresa.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout title="Central de Empresas">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
        <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-100">
                <ShieldCheck className="h-4 w-4" /> Administração da plataforma
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Central de Empresas e Acessos</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
                Cadastre cada empresa cliente, escolha o ramo de atuação, defina o pacote de módulos e entregue um ambiente próprio com login e senha exclusivos.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm lg:min-w-[260px]">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4"><div className="text-2xl font-bold">{contas.length}</div><div className="text-slate-300">empresas</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4"><div className="text-2xl font-bold">{contas.reduce((sum, account) => sum + (account.usuarios || 0), 0)}</div><div className="text-slate-300">acessos</div></div>
            </div>
          </div>
        </section>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-teal-700" />Cadastrar nova empresa</CardTitle>
            <CardDescription>O primeiro administrador será criado dentro da conta da empresa e não terá acesso a esta Central.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-7">
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Dados da empresa</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-2"><Label>Nome de exibição *</Label><Input value={form.nome} onChange={(event) => changeField("nome", event.target.value)} placeholder="Ex.: Empresa Horizonte" /></div>
                <div><Label>Slug de acesso</Label><Input value={form.slug} onChange={(event) => changeField("slug", event.target.value)} placeholder="gerado automaticamente" /></div>
                <div><Label>Razão social</Label><Input value={form.razao_social} onChange={(event) => changeField("razao_social", event.target.value)} /></div>
                <div><Label>Nome fantasia</Label><Input value={form.nome_fantasia} onChange={(event) => changeField("nome_fantasia", event.target.value)} /></div>
                <div><Label>CNPJ</Label><Input value={form.cnpj} onChange={(event) => changeField("cnpj", event.target.value)} placeholder="00.000.000/0000-00" /></div>
                <div><Label>E-mail institucional</Label><Input type="email" value={form.email_empresa} onChange={(event) => changeField("email_empresa", event.target.value)} /></div>
                <div><Label>Telefone</Label><Input value={form.telefone} onChange={(event) => changeField("telefone", event.target.value)} /></div>
                <div><Label>WhatsApp</Label><Input value={form.whatsapp} onChange={(event) => changeField("whatsapp", event.target.value)} /></div>
                <div><Label>Site</Label><Input value={form.site} onChange={(event) => changeField("site", event.target.value)} placeholder="https://" /></div>
                <div className="lg:col-span-2"><Label>Endereço</Label><Input value={form.endereco} onChange={(event) => changeField("endereco", event.target.value)} /></div>
                <div><Label>Cidade</Label><Input value={form.cidade} onChange={(event) => changeField("cidade", event.target.value)} /></div>
                <div><Label>UF</Label><Input maxLength={2} value={form.uf} onChange={(event) => changeField("uf", event.target.value.toUpperCase())} /></div>
                <div><Label>CEP</Label><Input value={form.cep} onChange={(event) => changeField("cep", event.target.value)} /></div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_1.25fr]">
              <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
                <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-teal-900">Ramo e painel</h2>
                <p className="mb-4 text-sm leading-5 text-slate-600">Empresas financeiras usam o painel atual. Nos demais ramos, a Central aplica o pacote modular escolhido.</p>
                <Label>Ramo de atuação *</Label>
                <Select value={form.ramo_atuacao} onValueChange={(value) => changeBranch(value as AccountProfileKey)}>
                  <SelectTrigger className="mt-2 bg-white"><SelectValue placeholder="Selecione o ramo" /></SelectTrigger>
                  <SelectContent>{branchOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                </Select>
                <div className="mt-4 rounded-xl border border-teal-200 bg-white p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-slate-900"><CheckCircle2 className="h-4 w-4 text-teal-600" />{form.ramo_atuacao === "financeiro" ? "Painel financeiro atual" : "Painel modular do ramo"}</div>
                  <p className="mt-1 text-slate-500">{customModules ? `${modules.length} módulos selecionados manualmente.` : `${defaultModules.length} módulos padrão do pacote ${ACCOUNT_PROFILE_LABELS[form.ramo_atuacao]}.`}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Módulos do ambiente</h2><p className="mt-1 text-sm text-slate-500">Deixe o pacote padrão ou personalize o acesso desta empresa.</p></div>
                  <label className="flex items-center gap-2 text-sm font-medium"><Checkbox checked={customModules} onCheckedChange={(checked) => { const enabled = checked === true; setCustomModules(enabled); if (!enabled) setModules(defaultModules); }} />Personalizar módulos</label>
                </div>
                <div className="mt-4 grid max-h-64 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {ACCOUNT_CONTROLLED_FEATURES.map((module) => <label key={module} className={`flex items-center gap-2 rounded-lg border p-2 text-sm ${customModules ? "bg-white" : "bg-slate-50 text-slate-500"}`}><Checkbox disabled={!customModules} checked={modules.includes(module)} onCheckedChange={(checked) => toggleModule(module, checked === true)} /><span>{moduleLabel(module)}</span></label>)}
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Administrador e acesso</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div><Label>Nome do administrador *</Label><Input value={form.admin_nome} onChange={(event) => changeField("admin_nome", event.target.value)} placeholder="Responsável pela empresa" /></div>
                <div><Label>Login / e-mail *</Label><Input type="email" value={form.admin_email} onChange={(event) => changeField("admin_email", event.target.value)} placeholder="admin@empresa.com.br" /></div>
                <div><Label>Senha inicial *</Label><Input type="password" value={form.admin_senha} onChange={(event) => changeField("admin_senha", event.target.value)} placeholder="mínimo de 8 caracteres" /></div>
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /><span>Esse login pertence à empresa cliente. Ele não poderá acessar a Central da plataforma nem visualizar dados de outras empresas.</span></div>
            </div>

            <div className="flex flex-col justify-between gap-3 border-t pt-5 sm:flex-row sm:items-center"><p className="text-xs text-slate-500">A senha é armazenada somente como hash seguro; ela não é exibida após o cadastro.</p><Button onClick={createCompany} disabled={saving} className="bg-slate-950 hover:bg-slate-800">{saving ? "Criando ambiente..." : "Criar empresa e acesso"}</Button></div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex-row items-center justify-between"><div><CardTitle className="flex items-center gap-2"><Users2 className="h-5 w-5 text-teal-700" />Empresas cadastradas</CardTitle><CardDescription>Ambientes e acessos gerenciados pela plataforma.</CardDescription></div><Button variant="outline" onClick={() => void load()}><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button></CardHeader>
          <CardContent>{loading ? <div className="py-8 text-center text-sm text-slate-500">Carregando empresas...</div> : contas.length === 0 ? <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500">Nenhuma empresa cadastrada ainda.</div> : <div className="grid gap-3 lg:grid-cols-2">{contas.map((account) => { const branch = account.ramo_atuacao || account.perfil_base; return <div key={account.id} className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><h3 className="font-semibold text-slate-900">{account.nome}</h3><Badge variant={account.status === "ativo" ? "default" : "outline"}>{account.status}</Badge></div><p className="mt-1 text-xs text-slate-500">{account.slug} · {ACCOUNT_PROFILE_LABELS[branch] || branch}</p></div><Badge variant="outline">{account.painel_base === "financeiro_atual" ? "Painel financeiro" : "Painel modular"}</Badge></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Administrador</div><div className="mt-1 truncate font-medium">{account.administrador_nome || "Não informado"}</div><div className="truncate text-xs text-slate-500">{account.administrador_email || "—"}</div></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Ambiente</div><div className="mt-1 font-medium">{account.usuarios || 0} acesso(s)</div><div className="text-xs text-slate-500">{account.modulos_ativos?.length || 0} módulos ativos</div></div></div></div>; })}</div>}</CardContent>
        </Card>
      </div>
    </Layout>
  );
}
