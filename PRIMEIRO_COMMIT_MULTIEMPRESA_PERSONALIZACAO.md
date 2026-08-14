# PRIMEIRO COMMIT — Fundação Multiempresa + Central de Personalização

Data: 2026-08-13
Base canônica: repositório original Destrava enviado pelo usuário (`destrava-main (69).zip`).

## Objetivo deste primeiro commit

Este commit NÃO transforma o Destrava em ERP e NÃO remove módulos especializados existentes.
Ele cria a fundação para disponibilizar a mesma base a várias empresas/clientes com isolamento de dados e identidade própria.

### Mantido como no Destrava

- faturamento bruto/histórico da empresa analisada;
- previsão de faturamento;
- análise/assessoria de crédito;
- acompanhamento bancário e financeiro especializado;
- consulta de CNPJ/QSA;
- cadastro de empresas, PF, sócios, documentos;
- orçamentos;
- contratos;
- relatórios e documentos técnicos;
- integrações já existentes.

`faturamento` continua significando o módulo de faturamento bruto/previsão usado na análise empresarial. Não foi criado módulo de contas a receber, cobrança, caixa ou ERP.

## Nova fundação

### 1. Conta por cliente

Nova tabela `contas_plataforma`.

Cada empresa que contratar a ferramenta recebe:

- UUID próprio;
- nome e slug;
- perfil-base;
- status;
- conjunto de funções/módulos ativos;
- usuários vinculados por `conta_id`.

A conta original do Destrava recebe o UUID fixo:

`00000000-0000-4000-8000-000000000001`

Todos os dados existentes são associados a essa conta durante a migration.

### 2. Isolamento multiempresa

As tabelas operacionais recebem `conta_id`, índice, chave estrangeira e Row Level Security (RLS).

A aplicação possui dois contextos de banco:

- **systemPool**: startup, login, administração da plataforma, conteúdo público e rotinas globais;
- **tenantPool**: toda requisição autenticada, com `app.conta_id` e `SET ROLE ritmo_tenant_app`.

A role `ritmo_tenant_app` é criada sem SUPERUSER e sem BYPASSRLS. Ela recebe escrita apenas nas tabelas multiempresa previstas e somente leitura nos objetos globais.

### 3. Central de Personalização

Rota do painel:

`/colaborador/personalizacao`

A empresa configura uma única vez:

- nome de exibição;
- razão social;
- nome fantasia;
- CNPJ;
- telefone/WhatsApp/e-mail/site;
- endereço/cidade/UF/CEP;
- logo PNG/JPG/WEBP (máximo 5 MB, com validação de assinatura do arquivo);
- cor primária;
- cor secundária;
- até três linhas de rodapé;
- nome/cargo/CPF/e-mail do signatário.

A identidade passa a alimentar os principais documentos gerados e previews operacionais:

- orçamento;
- faturamento bruto;
- previsão/declarações relacionadas;
- simulação;
- proposta bancária;
- relatório técnico;
- acompanhamento bancário/relatórios;
- contratos.

Na conta legada do Destrava, escolhas explícitas antigas de prestadora (ex.: PermuPay/Aragão onde já existiam) são preservadas para compatibilidade. Nas novas contas, a identidade da Central de Personalização é soberana.

### 4. Painel personalizado

Após login, o menu lateral e cabeçalhos usam o nome/logo da conta. O login global usa `VITE_APP_NAME`/Ritmo e não expõe a marca de outro cliente.

O cache de branding é apagado no login/logout para impedir que uma conta reutilize visualmente a identidade da conta anterior no mesmo navegador.

### 5. Perfis iniciais

- Crédito + Contábil (base Destrava)
- Contábil
- Assessoria de crédito
- Prestação de serviços
- Obras e manutenção
- Tecnologia e sistemas
- Consultoria / assessoria

Os perfis apenas definem o conjunto inicial de funções. A base de código continua única.

Contábil/crédito mantém faturamento/previsão e módulos especializados. Prestação de serviços, obras e tecnologia recebem o núcleo de produtividade sem telas financeiras especializadas desnecessárias.

### 6. Criação manual de novas contas

Página administrativa:

`/colaborador/contas-plataforma`

O acesso real é validado no backend por `PLATFORM_ADMIN_EMAILS`.

A criação manual recebe:

- nome da nova conta;
- slug;
- perfil;
- nome do administrador;
- e-mail do administrador;
- senha inicial.

Em uma transação são criados a conta, a personalização inicial e o administrador vinculado.

Auto cadastro, checkout e pagamento recorrente NÃO fazem parte deste primeiro commit.

## Variáveis do primeiro deploy

```env
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/BANCO

# Recomendado. Deve ser uma conexão com privilégios administrativos para migration,
# login global e administração da plataforma. No primeiro deploy pode apontar para
# a mesma URL administrativa usada em DATABASE_URL.
SYSTEM_DATABASE_URL=postgresql://USUARIO_ADMIN:SENHA@HOST:5432/BANCO

JWT_SECRET=UMA_CHAVE_LONGA_E_ALEATORIA

DEFAULT_CONTA_ID=00000000-0000-4000-8000-000000000001
TENANT_DB_ROLE=ritmo_tenant_app
PLATFORM_ADMIN_EMAILS=seu-email-administrador@dominio.com.br

APP_NAME=Ritmo
VITE_APP_NAME=Ritmo

# NÃO altere o DATA_DIR no primeiro redeploy se a produção atual já possui
# volume persistente. Mantenha exatamente o caminho atualmente utilizado.
DATA_DIR=/CAMINHO/PERSISTENTE/ATUAL
```

As variáveis de CNPJ, Gemini, Nexus e demais integrações existentes continuam exatamente as mesmas do ambiente Destrava atual.

Não alterar `SESSION_COOKIE_NAME` no primeiro deploy. Isso reduz mudança simultânea no mecanismo de login. Tokens JWT antigos não contêm `conta_id`, portanto usuários deverão entrar novamente após a implantação.

## Ordem de implantação recomendada

### Antes

1. Fazer backup completo do PostgreSQL.
2. Fazer backup/confirmar persistência do volume de `DATA_DIR`.
3. Registrar a imagem/commit atualmente em produção para rollback.
4. Configurar as variáveis novas no Coolify.

### Banco

Com as tabelas atuais do Destrava já existentes, executar:

```bash
npm run migrate:multiempresa
```

O runner usa `SYSTEM_DATABASE_URL` quando configurada; caso contrário usa `DATABASE_URL`.

A migration `081_multiempresa_personalizacao.sql` roda dentro de uma transação.

Ela exige que o usuário de migration possa criar a role `ritmo_tenant_app` e alterar as tabelas atuais.

### Aplicação

Depois da migration:

```bash
npm run check
npm run build
```

Somente com os dois comandos aprovados fazer o redeploy da imagem.

### Após o redeploy

1. Fazer novo login no Destrava legado.
2. Validar cadastro/consulta CNPJ e QSA.
3. Validar faturamento histórico e previsão.
4. Gerar um orçamento legado.
5. Gerar um contrato legado.
6. Gerar relatório/simulação/proposta bancária usada no ambiente atual.
7. Abrir `/colaborador/personalizacao` e confirmar os dados legados.
8. Abrir `/colaborador/contas-plataforma` com o e-mail listado em `PLATFORM_ADMIN_EMAILS`.
9. Criar uma conta TESTE com perfil `Prestação de serviços`.
10. Entrar com o novo administrador e configurar logo/rodapé/signatário.
11. Cadastrar um cliente PJ por CNPJ e um PF manual.
12. Gerar orçamento/contrato de teste e conferir identidade visual.
13. Em dois navegadores/sessões, confirmar que conta A não lista dados da conta B.

## Rollback

Se a migration falhar antes do `COMMIT`, o PostgreSQL reverte a transação.

Depois de uma migration concluída e uso em produção, rollback seguro significa:

- restaurar o backup do banco anterior; e
- redeployar a imagem/commit anterior.

Não fazer rollback parcial removendo apenas colunas `conta_id` em produção.

## O que NÃO foi feito propositalmente

- ERP;
- contas a receber;
- cobrança;
- emissão fiscal;
- checkout/assinatura SaaS;
- pagamento automático da assinatura da plataforma;
- rebranding do site público Destrava;
- remoção das funções de faturamento/previsão do Destrava.

Esses pontos não pertencem ao objetivo deste primeiro commit.

## Gate de qualidade desta entrega

Foi executada auditoria estática/sintática dos arquivos TypeScript/TSX e `node --check` no runner de migration. O repositório entregue não contém `node_modules`.

O build integral deve obrigatoriamente ser executado no CI/Coolify com as dependências instaladas antes da promoção para produção:

```bash
npm ci
npm run check
npm run build
```
