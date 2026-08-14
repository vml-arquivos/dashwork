# Work Pro — Runbook de validação e implantação em VPS

Este documento descreve o caminho seguro para executar a base **Destrava Crédito / Work Pro** em uma VPS limpa. O repositório foi preparado e validado localmente, mas este pacote **não declara que um deploy em VPS já foi executado**: ainda são necessários o host, o PostgreSQL e as credenciais de produção.

## 1. Pré-requisitos

A VPS deve possuir Docker Engine com Compose v2, DNS apontando para o endereço público, acesso administrativo ao PostgreSQL e um volume persistente para os dados de clientes. O volume persistente precisa ser montado em `/var/data/destrava`; essa árvore contém logos, documentos, configurações por conta e artefatos que não podem ser perdidos em um novo container.

O banco precisa ser PostgreSQL compatível com a aplicação. Antes do primeiro login, configure uma conexão administrativa em `SYSTEM_DATABASE_URL` ou use `DATABASE_URL` para todas as operações. Em ambientes com TLS, defina `DB_SSL=true` e mantenha `DB_SSL_REJECT_UNAUTHORIZED=true` quando a cadeia de certificados estiver instalada na imagem/host.

## 2. Configuração de segredos

Na VPS, crie o arquivo `.env` a partir de `.env.example`, mas nunca o versione:

```bash
cp .env.example .env
chmod 600 .env
$EDITOR .env
```

Os valores mínimos para o primeiro boot são `DATABASE_URL`, `JWT_SECRET`, `PLATFORM_ADMIN_EMAILS`, `FRONTEND_URL`, `APP_NAME=Work Pro`, `VITE_APP_NAME=Work Pro`, `DATA_DIR=/var/data/destrava`, `REQUIRE_PERSISTENT_STORAGE=true` e `PERSISTENT_STORAGE_CONFIGURED=true`. A variável `JWT_SECRET` deve ser longa, aleatória e exclusiva deste ambiente. Não reutilize a senha do PostgreSQL como segredo de sessão.

Os serviços opcionais — e-mail, WhatsApp, OCR externo, CNPJ, Nexus, n8n e previsão de faturamento — devem permanecer vazios ou desativados até que as credenciais reais estejam disponíveis. A aplicação possui caminhos locais para OCR/PDF e não deve ser configurada para fingir que uma integração externa está ativa.

## 3. Validação antes do container

Execute os gates abaixo no clone do mesmo commit que será publicado. O lockfile deve ser respeitado sem atualização implícita de dependências:

```bash
pnpm install --frozen-lockfile
pnpm run check
pnpm test
pnpm run build
```

O build gera o frontend estático, os arquivos SEO/prerender e o bundle do servidor em `dist/`. Qualquer erro nesses comandos bloqueia o deploy. Não ignore falhas de typecheck, testes, migrations ou orçamento de bundle.

## 4. Migração inicial do banco

Com o `.env` carregado e antes de abrir o serviço ao público, execute as migrations em ordem:

```bash
pnpm run migrate
pnpm run migrate:multiempresa
pnpm run migrate:nexus-catalog
```

O segundo comando aplica a fundação multiempresa e a personalização da conta. A role indicada em `TENANT_DB_ROLE` deve existir no PostgreSQL e não pode possuir `BYPASSRLS`. As políticas RLS e a função `app.current_conta_id()` precisam ser verificadas no banco antes de criar usuários reais.

## 5. Execução com Docker Compose

O arquivo `docker-compose.vps.yml` é uma opção de referência para uma VPS que mantém o PostgreSQL no mesmo Compose. Se o PostgreSQL for gerenciado externamente, utilize somente o serviço da aplicação e ajuste `DATABASE_URL`/`SYSTEM_DATABASE_URL` no `.env`.

```bash
docker compose -f docker-compose.vps.yml build --pull
docker compose -f docker-compose.vps.yml up -d db
docker compose -f docker-compose.vps.yml run --rm app node scripts/migrate-db.mjs
docker compose -f docker-compose.vps.yml run --rm app node scripts/migrate-multiempresa.mjs
docker compose -f docker-compose.vps.yml run --rm app node scripts/migrate-nexus-catalog.mjs
docker compose -f docker-compose.vps.yml up -d app
docker compose -f docker-compose.vps.yml ps
docker compose -f docker-compose.vps.yml logs --tail=200 app
```

A aplicação expõe a porta interna `4000`. Um proxy reverso deve terminar TLS e encaminhar `X-Forwarded-Proto`, `X-Forwarded-For` e `Host`. Configure `TRUST_PROXY_HOPS` de acordo com a quantidade real de proxies; não defina um valor maior do que a topologia existente.

## 6. Smoke test pós-subida

Valide a saúde básica sem enviar credenciais para logs:

```bash
curl --fail --silent --show-error https://SEU_DOMINIO/api/health
curl --fail --silent --show-error https://SEU_DOMINIO/api/health/storage
```

Em seguida, teste manualmente o login de um administrador da conta, o carregamento do dashboard, a criação de um cliente de teste, a geração de um orçamento, a geração de um contrato, a personalização da logo e o download autenticado de um documento. Crie duas contas de teste e confirme que cada uma só enxerga seus próprios dados. Remova os dados de teste após o aceite.

O smoke test deve confirmar também que uma conta sem o módulo `orcamentos` recebe `403` ao chamar diretamente a API de orçamentos e que uma conta sem o módulo `contratos` recebe `403` na API de contratos. Ocultar o item no menu não é considerado controle suficiente.

## 7. Persistência, backup e rollback

Faça backup do PostgreSQL e de `/var/data/destrava` antes de cada migration. O rollback de aplicação deve trocar a imagem pelo commit anterior; não faça downgrade automático do banco sem um script de reversão revisado. Preserve pelo menos uma cópia do `.env` em um cofre de segredos, nunca no Git.

Para inspeção operacional:

```bash
docker compose -f docker-compose.vps.yml ps
docker compose -f docker-compose.vps.yml logs --since=15m app
docker compose -f docker-compose.vps.yml exec app sh -lc 'du -sh /var/data/destrava'
```

## 8. Critérios de aceite

O deploy só deve ser considerado aceito quando o commit publicado estiver identificado, `pnpm run check`, `pnpm test` e `pnpm run build` estiverem verdes, as migrations concluírem sem erro, `/api/health` e `/api/health/storage` responderem com sucesso, o login funcionar com `JWT_SECRET` real, os uploads persistirem após recriação do container e o isolamento entre duas contas tiver sido demonstrado.

Até que esses critérios sejam comprovados na VPS, o estado correto da entrega é **pronto para implantação**, e não **implantado em produção**.

## 9. Segurança operacional

Não coloque tokens de e-mail, WhatsApp, CNPJ, Nexus, n8n, Google, Gemini ou chaves de IA em commits, issues ou logs. Não exponha o PostgreSQL diretamente à Internet quando o aplicativo e o banco estiverem na mesma rede privada. Restrinja a porta pública ao proxy reverso e mantenha apenas o volume de dados necessário para persistência.

> O repositório preserva a marca e os fluxos legados da Destrava Crédito; `Work Pro` é a identidade configurável da plataforma. Não substitua textos institucionais legados sem revisão de negócio.

## Referência rápida

| Item | Valor recomendado |
|---|---|
| Porta interna | `4000` |
| Dados persistentes | `/var/data/destrava` |
| Healthcheck | `/api/health` |
| Storage healthcheck | `/api/health/storage` |
| Instalação | `pnpm install --frozen-lockfile` |
| Typecheck | `pnpm run check` |
| Testes | `pnpm test` |
| Build | `pnpm run build` |
| Migration base | `pnpm run migrate` |
| Migration multiempresa | `pnpm run migrate:multiempresa` |
| Catálogo Nexus | `pnpm run migrate:nexus-catalog` |
| Nome padrão da plataforma | `Work Pro` |

**Status deste runbook:** preparado para execução em VPS; o acesso à VPS e as variáveis reais ainda precisam ser fornecidos pelo operador responsável pelo ambiente.
