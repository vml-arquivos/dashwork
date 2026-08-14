-- 081_multiempresa_personalizacao.sql
-- Fundação multiempresa + Central de Personalização, mantendo o Destrava como conta legada.
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Role operacional sem SUPERUSER/BYPASSRLS. As conexões normais da aplicação
-- executam SET ROLE para esta role; o pool de sistema continua usando a role
-- autenticada do DATABASE_URL apenas para login/administração da plataforma.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ritmo_tenant_app') THEN
    CREATE ROLE ritmo_tenant_app NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
  END IF;
END $$;
DO $$ BEGIN
  EXECUTE format('GRANT ritmo_tenant_app TO %I', current_user);
END $$;
GRANT USAGE ON SCHEMA public TO ritmo_tenant_app;

CREATE TABLE IF NOT EXISTS public.contas_plataforma (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  perfil_base TEXT NOT NULL DEFAULT 'credito_contabil',
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo','suspenso','cancelado')),
  modulos_ativos JSONB NOT NULL DEFAULT '[]'::jsonb,
  observacoes TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.contas_plataforma (id, nome, slug, perfil_base, status, modulos_ativos)
VALUES (
  '00000000-0000-4000-8000-000000000001', 'Destrava Crédito', 'destrava',
  'credito_contabil', 'ativo',
  '["dashboard","funil-vendas","triagem-leads","simulacoes","calculadora","orcamentos","clientes-pj","clientes-pf","relatorios-pj","cadastros-incompletos","assessoria-ia","diagnostico-credito","acompanhamento-bancario","acompanhamento-financeiro","faturamento","contratos","documento-action-enviar-email","documento-action-enviar-whatsapp","contadores","integracoes","usuarios","personalizacao","configuracao-funcoes"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET atualizado_em = NOW();

CREATE TABLE IF NOT EXISTS public.conta_personalizacao (
  conta_id UUID PRIMARY KEY REFERENCES public.contas_plataforma(id) ON DELETE CASCADE,
  nome_exibicao TEXT,
  razao_social TEXT,
  nome_fantasia TEXT,
  cnpj TEXT,
  telefone TEXT,
  whatsapp TEXT,
  email TEXT,
  site TEXT,
  endereco TEXT,
  cidade TEXT,
  uf TEXT,
  cep TEXT,
  logo_path TEXT,
  logo_mime TEXT,
  cor_primaria TEXT NOT NULL DEFAULT '#1B3A8C',
  cor_secundaria TEXT NOT NULL DEFAULT '#F0A500',
  rodape_linha_1 TEXT,
  rodape_linha_2 TEXT,
  rodape_linha_3 TEXT,
  signatario_nome TEXT,
  signatario_cargo TEXT,
  signatario_cpf TEXT,
  signatario_email TEXT,
  assinatura_path TEXT,
  configuracoes JSONB NOT NULL DEFAULT '{}'::jsonb,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.conta_personalizacao (
  conta_id, nome_exibicao, razao_social, nome_fantasia, cnpj,
  telefone, whatsapp, email, endereco, cidade, uf, cep,
  rodape_linha_1, rodape_linha_2, signatario_nome, signatario_cargo, signatario_cpf
)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'Destrava Crédito', 'DESTRAVA CREDITO LTDA', 'Destrava Crédito', '35.427.182/0001-66',
  '(61) 3526-8355', '(61) 3526-8355', 'destravacreditooficial@gmail.com',
  'QND 25 Lote 40 - Taguatinga Norte', 'Brasília', 'DF', '72120-250',
  'BRASÍLIA - SEDE | QND 25 Lote 40 - Taguatinga Norte, Brasília - DF, 72120-250',
  'GOIÂNIA - FILIAL | Avenida Afonso Pena, qd-25 Alt. 05, S/N sala-02 setor Goiânia 2, Goiânia-GO',
  'FERNANDO ELI OLIVEIRA MARQUES', 'sócio administrador', '718.517.041-91'
)
ON CONFLICT (conta_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.app_current_conta_id()
RETURNS UUID LANGUAGE SQL STABLE AS $$
  SELECT NULLIF(current_setting('app.conta_id', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION public.app_system_mode()
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT COALESCE(NULLIF(current_setting('app.system_mode', true), ''), '0') = '1'
$$;

ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS conta_id UUID;
UPDATE public.colaboradores SET conta_id = '00000000-0000-4000-8000-000000000001' WHERE conta_id IS NULL;
ALTER TABLE public.colaboradores ALTER COLUMN conta_id SET DEFAULT public.app_current_conta_id();
ALTER TABLE public.colaboradores ALTER COLUMN conta_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_colaboradores_conta_id ON public.colaboradores(conta_id);
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='colaboradores_conta_id_fkey') THEN
    ALTER TABLE public.colaboradores ADD CONSTRAINT colaboradores_conta_id_fkey
      FOREIGN KEY (conta_id) REFERENCES public.contas_plataforma(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- Dados operacionais. Catálogos/regras globais (ex.: documentacao_blocos) não entram aqui.
DO $$
DECLARE
  t TEXT;
  scoped_tables TEXT[] := ARRAY[
    'colaboradores',
    'empresas','clientes_pf','clientes','leads','triagem_leads',
    'socios_empresa','socios_conjuge','pessoa_juridica_responsaveis',
    'empresa_documentos','empresa_checklist_documentos','empresa_followups','empresa_historico',
    'empresas_contratos_sociais','credenciais_sensiveis_empresa',
    'orcamentos_timbrados','orcamentos_timbrados_anexos','orcamentos','contratos_gerados','simulacoes_colaborador','simulacoes','simulacao_pdfs',
    'faturamento_historico','previsao_faturamento',
    'acompanhamento_financeiro_config','acompanhamento_financeiro_movimentacoes',
    'acompanhamento_financeiro_saldos_diarios','acompanhamento_financeiro_semanal',
    'acompanhamento_compensacoes_historico','acompanhamentos_bancarios',
    'acompanhamento_bancario_alertas','acompanhamento_bancario_atualizacoes','acompanhamento_bancario_relatorios',
    'analises_cnpj_empresa',
    'documentos_arquivos','documentos_empresa','documentos_enviados','documentos_extracoes_ia',
    'documentos_textos_extraidos','documentos_campos_extraidos','documentos_rag_chunks','documentos_alertas_ia',
    'documentacao_bloco_arquivos','documentacao_entidade_blocos','documentacao_analises_ia',
    'auditoria_documentacao','auditoria_documentos','audit_logs','auditoria_permissoes',
    'crm_atividades','atividades_crm','crm_caixas','crm_conversas','crm_delegacoes','crm_documentos','crm_eventos_webhook','crm_followups','crm_historico_funil','crm_logs','crm_mensagens','crm_metas','crm_notas_internas','crm_qualificacoes_ia','crm_recomendacoes_ia','crm_score_historico',
    'automation_alerts_cache','automation_audit_log','automation_events','nexus_task_links','nexus_tarefas_enviadas',
    'parceiros_comerciais','prestadores_servico','contadores','bancos_parceiros','gerentes_bancarios',
    'followup_empresa','interacoes','documentos_leads'
  ];
BEGIN
  FOREACH t IN ARRAY scoped_tables LOOP
    IF to_regclass(format('public.%I', t)) IS NULL THEN CONTINUE; END IF;
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS conta_id UUID', t);
    EXECUTE format('UPDATE public.%I SET conta_id=%L::uuid WHERE conta_id IS NULL', t, '00000000-0000-4000-8000-000000000001');
    EXECUTE format('ALTER TABLE public.%I ALTER COLUMN conta_id SET DEFAULT public.app_current_conta_id()', t);
    EXECUTE format('ALTER TABLE public.%I ALTER COLUMN conta_id SET NOT NULL', t);
    EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON public.%I(conta_id)', 'idx_'||t||'_conta_id', t);
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint c JOIN pg_class r ON r.oid=c.conrelid JOIN pg_namespace n ON n.oid=r.relnamespace
      WHERE n.nspname='public' AND r.relname=t AND c.conname=t||'_conta_id_fkey'
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (conta_id) REFERENCES public.contas_plataforma(id) ON DELETE RESTRICT', t, t||'_conta_id_fkey');
    END IF;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation ON public.%I', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON public.%I USING (public.app_system_mode() OR conta_id=public.app_current_conta_id()) WITH CHECK (public.app_system_mode() OR conta_id=public.app_current_conta_id())', t);
  END LOOP;
END $$;

ALTER TABLE public.conta_personalizacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conta_personalizacao FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON public.conta_personalizacao;
CREATE POLICY tenant_isolation ON public.conta_personalizacao
USING (public.app_system_mode() OR conta_id=public.app_current_conta_id())
WITH CHECK (public.app_system_mode() OR conta_id=public.app_current_conta_id());

-- Unicidade de cadastro passa a ser por conta: o mesmo cliente pode ser atendido por empresas diferentes da plataforma.
DO $$ BEGIN
  IF to_regclass('public.empresas') IS NOT NULL THEN
    DROP INDEX IF EXISTS public.ux_empresas_cnpj_unico_ativo;
    CREATE UNIQUE INDEX ux_empresas_cnpj_unico_ativo ON public.empresas
      (conta_id, (regexp_replace(COALESCE(cnpj,''), '\D', '', 'g')))
      WHERE length(regexp_replace(COALESCE(cnpj,''), '\D', '', 'g'))=14 AND COALESCE(arquivado_por_duplicidade,false)=false;
  END IF;
  IF to_regclass('public.clientes_pf') IS NOT NULL THEN
    DROP INDEX IF EXISTS public.ux_clientes_pf_cpf_unico_ativo;
    CREATE UNIQUE INDEX ux_clientes_pf_cpf_unico_ativo ON public.clientes_pf
      (conta_id, (regexp_replace(COALESCE(cpf,''), '\D', '', 'g')))
      WHERE length(regexp_replace(COALESCE(cpf,''), '\D', '', 'g'))=11 AND COALESCE(arquivado_por_duplicidade,false)=false;
  END IF;
  IF to_regclass('public.leads') IS NOT NULL THEN
    DROP INDEX IF EXISTS public.ux_leads_documento_unico_ativo;
    CREATE UNIQUE INDEX ux_leads_documento_unico_ativo ON public.leads
      (conta_id, (regexp_replace(COALESCE(cpf_cnpj,''), '\D', '', 'g')))
      WHERE length(regexp_replace(COALESCE(cpf_cnpj,''), '\D', '', 'g')) IN (11,14)
        AND COALESCE(arquivado_por_duplicidade,false)=false;
  END IF;
END $$;

-- CPF/CNPJ de clientes e profissionais é único DENTRO da conta, não na plataforma inteira.
-- Remove apenas constraints UNIQUE de uma única coluna nos campos conhecidos, preservando
-- PKs e demais regras do Destrava.
DO $$
DECLARE r RECORD;
BEGIN
  IF to_regclass('public.clientes_pf') IS NOT NULL THEN
    FOR r IN
      SELECT c.conname FROM pg_constraint c
      JOIN pg_class t ON t.oid=c.conrelid
      WHERE t.oid='public.clientes_pf'::regclass AND c.contype='u'
        AND (SELECT array_agg(a.attname::text ORDER BY x.ord) FROM unnest(c.conkey) WITH ORDINALITY AS x(attnum,ord) JOIN pg_attribute a ON a.attrelid=t.oid AND a.attnum=x.attnum) = ARRAY['cpf']::text[]
    LOOP EXECUTE format('ALTER TABLE public.clientes_pf DROP CONSTRAINT %I', r.conname); END LOOP;
    DROP INDEX IF EXISTS public.ux_clientes_pf_cpf_unico_ativo;
    CREATE UNIQUE INDEX ux_clientes_pf_cpf_unico_ativo ON public.clientes_pf
      (conta_id, (regexp_replace(COALESCE(cpf,''), '\D', '', 'g')))
      WHERE length(regexp_replace(COALESCE(cpf,''), '\D', '', 'g'))=11 AND COALESCE(arquivado_por_duplicidade,false)=false;
  END IF;

  IF to_regclass('public.contadores') IS NOT NULL THEN
    FOR r IN
      SELECT c.conname FROM pg_constraint c
      JOIN pg_class t ON t.oid=c.conrelid
      WHERE t.oid='public.contadores'::regclass AND c.contype='u'
        AND (SELECT array_agg(a.attname::text ORDER BY x.ord) FROM unnest(c.conkey) WITH ORDINALITY AS x(attnum,ord) JOIN pg_attribute a ON a.attrelid=t.oid AND a.attnum=x.attnum) = ARRAY['cpf']::text[]
    LOOP EXECUTE format('ALTER TABLE public.contadores DROP CONSTRAINT %I', r.conname); END LOOP;
    DROP INDEX IF EXISTS public.ux_contadores_cpf_por_conta;
    CREATE UNIQUE INDEX ux_contadores_cpf_por_conta ON public.contadores
      (conta_id, (regexp_replace(COALESCE(cpf,''), '\D', '', 'g')))
      WHERE length(regexp_replace(COALESCE(cpf,''), '\D', '', 'g'))=11;
  END IF;

  IF to_regclass('public.parceiros_comerciais') IS NOT NULL THEN
    FOR r IN
      SELECT c.conname FROM pg_constraint c
      JOIN pg_class t ON t.oid=c.conrelid
      WHERE t.oid='public.parceiros_comerciais'::regclass AND c.contype='u'
        AND (SELECT array_agg(a.attname::text ORDER BY x.ord) FROM unnest(c.conkey) WITH ORDINALITY AS x(attnum,ord) JOIN pg_attribute a ON a.attrelid=t.oid AND a.attnum=x.attnum) = ARRAY['cpf']::text[]
    LOOP EXECUTE format('ALTER TABLE public.parceiros_comerciais DROP CONSTRAINT %I', r.conname); END LOOP;
    DROP INDEX IF EXISTS public.ux_parceiros_cpf_por_conta;
    CREATE UNIQUE INDEX ux_parceiros_cpf_por_conta ON public.parceiros_comerciais
      (conta_id, (regexp_replace(COALESCE(cpf,''), '\D', '', 'g')))
      WHERE length(regexp_replace(COALESCE(cpf,''), '\D', '', 'g'))=11;
  END IF;

  IF to_regclass('public.contratos_gerados') IS NOT NULL THEN
    FOR r IN
      SELECT c.conname FROM pg_constraint c
      JOIN pg_class t ON t.oid=c.conrelid
      WHERE t.oid='public.contratos_gerados'::regclass AND c.contype='u'
        AND (SELECT array_agg(a.attname::text ORDER BY x.ord) FROM unnest(c.conkey) WITH ORDINALITY AS x(attnum,ord) JOIN pg_attribute a ON a.attrelid=t.oid AND a.attnum=x.attnum) = ARRAY['hash_documento']::text[]
    LOOP EXECUTE format('ALTER TABLE public.contratos_gerados DROP CONSTRAINT %I', r.conname); END LOOP;
    DROP INDEX IF EXISTS public.ux_contratos_hash_por_conta;
    CREATE UNIQUE INDEX ux_contratos_hash_por_conta ON public.contratos_gerados(conta_id, hash_documento) WHERE hash_documento IS NOT NULL;
  END IF;
END $$;

-- Numeração/protocolo de contratos também é independente por conta.
DO $$ BEGIN
  IF to_regclass('public.contratos_gerados') IS NOT NULL THEN
    DROP INDEX IF EXISTS public.idx_contratos_numero_contrato_unique;
    DROP INDEX IF EXISTS public.idx_contratos_protocolo_contrato_unique;
    CREATE UNIQUE INDEX idx_contratos_numero_contrato_unique ON public.contratos_gerados(conta_id, numero_contrato) WHERE numero_contrato IS NOT NULL;
    CREATE UNIQUE INDEX idx_contratos_protocolo_contrato_unique ON public.contratos_gerados(conta_id, protocolo_contrato) WHERE protocolo_contrato IS NOT NULL;
  END IF;
END $$;


-- Permissões da role operacional. O startup e rotinas globais usam o pool de
-- sistema; a role de tenant NÃO precisa ser proprietária das tabelas. Isso
-- mantém catálogos/conteúdo global somente leitura para contas comuns.
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ritmo_tenant_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ritmo_tenant_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO ritmo_tenant_app;

DO $$
DECLARE
  t TEXT;
  scoped_tables TEXT[] := ARRAY[
    'colaboradores',
    'empresas','clientes_pf','clientes','leads','triagem_leads',
    'socios_empresa','socios_conjuge','pessoa_juridica_responsaveis',
    'empresa_documentos','empresa_checklist_documentos','empresa_followups','empresa_historico',
    'empresas_contratos_sociais','credenciais_sensiveis_empresa',
    'orcamentos_timbrados','orcamentos_timbrados_anexos','orcamentos','contratos_gerados','simulacoes_colaborador','simulacoes','simulacao_pdfs',
    'faturamento_historico','previsao_faturamento',
    'acompanhamento_financeiro_config','acompanhamento_financeiro_movimentacoes',
    'acompanhamento_financeiro_saldos_diarios','acompanhamento_financeiro_semanal',
    'acompanhamento_compensacoes_historico','acompanhamentos_bancarios',
    'acompanhamento_bancario_alertas','acompanhamento_bancario_atualizacoes','acompanhamento_bancario_relatorios',
    'analises_cnpj_empresa',
    'documentos_arquivos','documentos_empresa','documentos_enviados','documentos_extracoes_ia',
    'documentos_textos_extraidos','documentos_campos_extraidos','documentos_rag_chunks','documentos_alertas_ia',
    'documentacao_bloco_arquivos','documentacao_entidade_blocos','documentacao_analises_ia',
    'auditoria_documentacao','auditoria_documentos','audit_logs','auditoria_permissoes',
    'crm_atividades','atividades_crm','crm_caixas','crm_conversas','crm_delegacoes','crm_documentos','crm_eventos_webhook','crm_followups','crm_historico_funil','crm_logs','crm_mensagens','crm_metas','crm_notas_internas','crm_qualificacoes_ia','crm_recomendacoes_ia','crm_score_historico',
    'automation_alerts_cache','automation_audit_log','automation_events','nexus_task_links','nexus_tarefas_enviadas',
    'parceiros_comerciais','prestadores_servico','contadores','bancos_parceiros','gerentes_bancarios',
    'followup_empresa','interacoes','documentos_leads',
    'conta_personalizacao'
  ];
BEGIN
  FOREACH t IN ARRAY scoped_tables LOOP
    IF to_regclass(format('public.%I', t)) IS NOT NULL THEN
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO ritmo_tenant_app', t);
    END IF;
  END LOOP;
END $$;

-- A tabela global de contas nunca é gravável pela role operacional.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER ON public.contas_plataforma FROM ritmo_tenant_app;

-- Novos objetos globais criados pelo usuário da migration começam somente com leitura.
-- Tabelas multiempresa futuras devem ser adicionadas por migration explícita com RLS.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ritmo_tenant_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ritmo_tenant_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO ritmo_tenant_app;

COMMIT;
