# Variáveis — primeiro deploy multiempresa

Copie apenas as variáveis novas/necessárias e preserve todas as variáveis já existentes no Destrava.

```env
# Banco operacional existente
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/BANCO

# Conexão administrativa. Recomendada para separar explicitamente operações globais.
# No primeiro deploy pode ser a mesma URL administrativa acima.
SYSTEM_DATABASE_URL=postgresql://USUARIO_ADMIN:SENHA@HOST:5432/BANCO

# Já deve existir; não troque sem planejar invalidação de sessões.
JWT_SECRET=SUA_CHAVE_ATUAL_FORTE

# Conta legada fixa do Destrava
DEFAULT_CONTA_ID=00000000-0000-4000-8000-000000000001

# Role criada pela migration 081
TENANT_DB_ROLE=ritmo_tenant_app

# Quem poderá criar/suspender contas da plataforma manualmente
PLATFORM_ADMIN_EMAILS=admin@seudominio.com.br

# Marca da plataforma no login global. A marca de cada cliente vem da Central de Personalização.
APP_NAME=Ritmo
VITE_APP_NAME=Ritmo

# MANTER o valor real já usado no Coolify. Exemplo ilustrativo somente.
DATA_DIR=/var/data/destrava

# Primeiro redeploy: deixar sem alteração para preservar o cookie atual.
# SESSION_COOKIE_NAME=ritmo_session
```

## Comando de banco

```bash
npm run migrate:multiempresa
```

A conexão usada pelo runner é, nesta ordem:

1. `SYSTEM_DATABASE_URL`;
2. `DATABASE_URL`.

## Requisitos do usuário PostgreSQL da migration

Ele precisa conseguir:

- `CREATE ROLE` (para `ritmo_tenant_app`);
- `ALTER TABLE` nas tabelas atuais;
- criar policies RLS, índices e chaves estrangeiras;
- conceder privilégios à role operacional.

Não use uma role PostgreSQL com `BYPASSRLS` como role operacional da aplicação. A aplicação faz `SET ROLE ritmo_tenant_app` nas conexões autenticadas.
