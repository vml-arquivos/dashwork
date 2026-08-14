-- 023_permissao_gestor_credito_acompanhamento.sql
-- Permissão de acesso ao módulo Acompanhamento Bancário para Gestor de Crédito ou superior.
-- Compatível com o schema legado: a aplicação usa cargo/perfil, não role.

ALTER TABLE public.colaboradores
ADD COLUMN IF NOT EXISTS acesso_acompanhamento_bancario BOOLEAN NOT NULL DEFAULT false;

UPDATE public.colaboradores
SET acesso_acompanhamento_bancario = CASE
  WHEN LOWER(COALESCE(perfil, '')) IN ('admin', 'super_admin', 'superadmin', 'gestor_credito', 'gestor')
    OR LOWER(COALESCE(cargo, '')) IN (
      'administrador', 'admin', 'super_admin', 'superadmin', 'diretor',
      'gerente', 'gerente comercial', 'gerente_credito', 'gestor de credito',
      'gestor de crédito', 'gestor_credito'
    )
  THEN true
  ELSE false
END;

CREATE INDEX IF NOT EXISTS idx_colaboradores_acesso_acompanhamento_bancario
ON public.colaboradores (acesso_acompanhamento_bancario);
