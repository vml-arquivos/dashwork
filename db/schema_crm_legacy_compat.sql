-- Work Pro — compatibilidade aditiva para o CRM legado.
-- Converte crm_eventos_webhook criado pelo schema inicial para o contrato
-- canônico usado pelo webhook Chatwoot, preservando todas as linhas existentes.
-- Seguro para reexecução.

-- Dependência histórica das migrations CRM 005/007. Algumas instalações
-- legadas nunca receberam schema_integracoes.sql; criar a estrutura completa
-- de forma aditiva permite preservar o banco e manter as FKs canônicas.
CREATE TABLE IF NOT EXISTS public.ia_agentes (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome                   TEXT NOT NULL,
  descricao              TEXT,
  modelo                 TEXT NOT NULL DEFAULT 'gpt-4.1-mini',
  system_prompt          TEXT NOT NULL DEFAULT '',
  temperatura            NUMERIC(3,2) NOT NULL DEFAULT 0.7,
  max_tokens             INTEGER NOT NULL DEFAULT 1024,
  canal                  TEXT NOT NULL DEFAULT 'whatsapp'
                           CHECK (canal IN ('whatsapp','web','email','todos')),
  ativo                  BOOLEAN NOT NULL DEFAULT TRUE,
  responder_fora_horario BOOLEAN NOT NULL DEFAULT FALSE,
  horario_inicio         TIME DEFAULT '08:00',
  horario_fim            TIME DEFAULT '18:00',
  dias_semana            INTEGER[] DEFAULT '{1,2,3,4,5}',
  escalar_apos_msgs      INTEGER DEFAULT 5,
  escalar_palavras       TEXT[] DEFAULT '{}',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF to_regclass('public.crm_eventos_webhook') IS NOT NULL THEN
    ALTER TABLE public.crm_eventos_webhook
      ADD COLUMN IF NOT EXISTS event_id TEXT,
      ADD COLUMN IF NOT EXISTS origem TEXT,
      ADD COLUMN IF NOT EXISTS tipo_evento TEXT,
      ADD COLUMN IF NOT EXISTS status_processamento TEXT,
      ADD COLUMN IF NOT EXISTS erro_detalhe TEXT,
      ADD COLUMN IF NOT EXISTS processado_em TIMESTAMPTZ;

    UPDATE public.crm_eventos_webhook
       SET event_id = COALESCE(NULLIF(event_id, ''), 'legacy-' || id::text),
           origem = COALESCE(NULLIF(origem, ''), 'legacy'),
           tipo_evento = COALESCE(NULLIF(tipo_evento, ''), NULLIF(evento, ''), 'legacy'),
           status_processamento = CASE
             WHEN status_processamento IN ('pendente', 'processado', 'erro', 'ignorado') THEN status_processamento
             WHEN lower(COALESCE(status, '')) IN ('processado', 'processed', 'concluido', 'concluído') THEN 'processado'
             WHEN lower(COALESCE(status, '')) IN ('erro', 'error', 'falha', 'failed') THEN 'erro'
             WHEN lower(COALESCE(status, '')) IN ('ignorado', 'ignored') THEN 'ignorado'
             ELSE 'pendente'
           END,
           payload = COALESCE(payload, '{}'::jsonb)
     WHERE event_id IS NULL
        OR event_id = ''
        OR origem IS NULL
        OR origem = ''
        OR tipo_evento IS NULL
        OR tipo_evento = ''
        OR status_processamento IS NULL
        OR status_processamento NOT IN ('pendente', 'processado', 'erro', 'ignorado')
        OR payload IS NULL;

    ALTER TABLE public.crm_eventos_webhook
      ALTER COLUMN event_id SET NOT NULL,
      ALTER COLUMN origem SET DEFAULT 'legacy',
      ALTER COLUMN origem SET NOT NULL,
      ALTER COLUMN tipo_evento SET DEFAULT 'legacy',
      ALTER COLUMN tipo_evento SET NOT NULL,
      ALTER COLUMN payload SET DEFAULT '{}'::jsonb,
      ALTER COLUMN payload SET NOT NULL,
      ALTER COLUMN status_processamento SET DEFAULT 'pendente',
      ALTER COLUMN status_processamento SET NOT NULL;

    CREATE UNIQUE INDEX IF NOT EXISTS crm_eventos_webhook_event_id_key
      ON public.crm_eventos_webhook(event_id);
  END IF;
END $$;

-- Colunas adicionais usadas pelo schema canônico quando as tabelas já existiam
-- em uma instalação anterior. Cada alteração é aditiva e nullable/defaulted.
DO $$
BEGIN
  IF to_regclass('public.crm_conversas') IS NOT NULL THEN
    ALTER TABLE public.crm_conversas
      ADD COLUMN IF NOT EXISTS resumo_contexto TEXT,
      ADD COLUMN IF NOT EXISTS iniciada_em TIMESTAMPTZ DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS ultima_interacao_em TIMESTAMPTZ DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS fechada_em TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF to_regclass('public.crm_mensagens') IS NOT NULL THEN
    ALTER TABLE public.crm_mensagens
      ADD COLUMN IF NOT EXISTS message_id_externo TEXT,
      ADD COLUMN IF NOT EXISTS direcao TEXT,
      ADD COLUMN IF NOT EXISTS remetente_tipo TEXT,
      ADD COLUMN IF NOT EXISTS remetente_id TEXT,
      ADD COLUMN IF NOT EXISTS tipo_conteudo TEXT DEFAULT 'texto',
      ADD COLUMN IF NOT EXISTS conteudo TEXT,
      ADD COLUMN IF NOT EXISTS metadados JSONB,
      ADD COLUMN IF NOT EXISTS status_envio TEXT,
      ADD COLUMN IF NOT EXISTS evento_id UUID;
  END IF;
END $$;

-- Normaliza defaults de tabelas legadas sem impor NOT NULL em dados históricos
-- cuja origem não pode ser inferida com segurança.
ALTER TABLE IF EXISTS public.crm_conversas
  ALTER COLUMN iniciada_em SET DEFAULT NOW(),
  ALTER COLUMN ultima_interacao_em SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER TABLE IF EXISTS public.crm_mensagens
  ALTER COLUMN tipo_conteudo SET DEFAULT 'texto';

CREATE INDEX IF NOT EXISTS idx_crm_eventos_status_legacy_compat
  ON public.crm_eventos_webhook(status_processamento);
CREATE INDEX IF NOT EXISTS idx_crm_eventos_created_legacy_compat
  ON public.crm_eventos_webhook(created_at DESC);

DO $$
BEGIN
  RAISE NOTICE 'Compatibilidade CRM legado aplicada com segurança';
END $$;
