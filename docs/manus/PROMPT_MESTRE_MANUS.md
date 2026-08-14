# PROMPT MESTRE PARA O MANUS — EXECUÇÃO COMPLETA NO REPOSITÓRIO

## PAPEL

Assuma simultaneamente o papel de:

- arquiteto de software sênior;
- engenheiro de software full-stack sênior;
- especialista PostgreSQL e segurança multi-tenant;
- especialista em UX mobile-first;
- engenheiro de IA/RAG e automações;
- especialista em geração de PDFs/documentos;
- engenheiro de testes, CI/CD e deploy;
- mantenedor principal do sistema Destrava e da nova plataforma universal baseada nele.

Você possui acesso ao repositório e deve trabalhar diretamente nele.

## MISSÃO

Transformar a base existente do **Destrava** em uma plataforma leve e multiempresa, provisoriamente chamada **Work Pro**, mantendo integralmente as funções maduras do Destrava para os nichos Contábil/Crédito e criando uma experiência ultrarrápida para Serviços, Obras, Tecnologia, Consultoria e outros prestadores.

O objetivo NÃO é criar um ERP. O objetivo é **reduzir trabalho e tempo operacional**.

A experiência desejada é:

> Cliente → Orçamento/Proposta → Aprovação → Contrato → documento entregue.

Com o mínimo possível de digitação, cliques e retrabalho.

---

# 1. REGRAS ABSOLUTAS

1. **ZERO REGRESSÃO:** não remover, quebrar ou alterar silenciosamente funcionalidades existentes do Destrava.
2. **ZERO QUEBRA:** qualquer mudança deve preservar rotas, dados e comportamento legado, salvo mudança explicitamente exigida neste prompt.
3. Não reescrever o sistema do zero.
4. Não criar outro sistema paralelo se uma função madura já existe no Destrava.
5. Não transformar a ferramenta em ERP, contas a receber, emissão fiscal, caixa ou financeiro genérico.
6. No Destrava, `faturamento` significa **faturamento bruto/histórico e previsão de faturamento da empresa analisada**. Manter esse conceito.
7. Não espalhar o nome provisório pelo código. Usar configuração (`APP_NAME`, `VITE_APP_NAME` e identidade por conta).
8. Não confiar apenas no frontend para permissões, tenant ou trava contratual.
9. Não executar migration destrutiva sem backup verificável e plano de rollback.
10. Não fazer push de código que não passou nos gates definidos abaixo.
11. Não criar commit parcial. O primeiro commit desta evolução só deve ocorrer quando a fundação estiver completa, validada e testada.
12. Não inventar dados nem alterar regras jurídicas/financeiras usando IA.
13. Se encontrar divergência entre este prompt e o código real, preserve o comportamento de produção e implemente a solução mais compatível com esta missão, documentando a decisão.

---

# 2. NOME E BRANDING DA PLATAFORMA

Use **Work Pro** apenas como nome provisório visual para desenvolvimento.

A marca definitiva será escolhida depois.

Obrigatório:

```env
APP_NAME=Work Pro
VITE_APP_NAME=Work Pro
```

A aplicação universal deve consumir essas configurações.

A identidade de cada cliente/empresa vem da Central de Personalização em banco.

Não fazer busca/substituição cega de “Destrava”. Existem partes legadas/especializadas em que a marca ou regra pode precisar continuar temporariamente para compatibilidade.

---

# 3. ANTES DE ALTERAR QUALQUER ARQUIVO

Execute e registre:

```bash
git status
git branch --show-current
git log -1 --oneline
node -v
npm -v
```

Identifique:

- estado atual do branch;
- alterações locais já existentes;
- migrations existentes e aplicadas;
- estrutura de banco;
- mecanismo atual de autenticação;
- todos os pools/conexões PostgreSQL;
- geradores de PDF/documentos;
- rotas de CNPJ/QSA;
- módulos de faturamento/previsão;
- orçamento/proposta;
- contratos;
- perfis/permissões;
- armazenamento de arquivos.

Não sobrescreva alterações humanas não relacionadas.

Instale as dependências conforme lockfile:

```bash
npm ci
```

Rode baseline antes das mudanças:

```bash
npm run check
npm test
npm run build
```

Se algum comando já falhar no baseline, registre exatamente a falha e diferencie **erro preexistente** de regressão causada pela implementação.

---

# 4. BASE FUNCIONAL QUE DEVE SER PRESERVADA

Nos perfis Contábil/Crédito, preservar e reutilizar o que já existe no Destrava:

- empresas;
- clientes PF;
- consulta CNPJ;
- QSA;
- sócios;
- faturamento bruto/histórico;
- previsão de faturamento;
- documentos;
- análises;
- simulações;
- acompanhamento bancário;
- acompanhamento financeiro especializado;
- relatórios;
- propostas bancárias;
- orçamentos;
- contratos;
- integrações existentes.

Não adicionar módulo genérico de contas a receber.
Não adicionar caixa.
Não adicionar emissão fiscal.
Não adicionar cobrança SaaS nesta etapa.

---

# 5. ARQUITETURA MULTIEMPRESA OBRIGATÓRIA

A plataforma atenderá múltiplos clientes contratantes.

Cada cliente deve possuir uma conta própria e isolamento real.

## 5.1 Conta

Validar ou implementar tabela equivalente a `contas_plataforma` com, no mínimo:

- `id UUID`;
- nome;
- slug;
- perfil_base;
- status;
- módulos/funções ativos;
- timestamps;
- configurações extensíveis.

A conta atual do Destrava deve ser preservada como conta legada e receber todos os registros já existentes no momento da migration.

## 5.2 Isolamento

Toda tabela operacional multiempresa relevante deve possuir `conta_id`.

Implementar/validar:

- índices;
- foreign keys;
- RLS;
- políticas `USING` e `WITH CHECK`;
- role operacional SEM `SUPERUSER` e SEM `BYPASSRLS`;
- pool global/sistema separado de pool tenant;
- contexto tenant derivado do usuário autenticado;
- arquivos separados por `conta_id`;
- downloads protegidos por tenant;
- cache de branding isolado.

Audite TODAS as conexões do projeto. Não pode existir `new Pool()` ou conexão lateral em módulo autenticado que contorne o contexto multiempresa.

Conteúdo verdadeiramente global/público pode usar o pool de sistema, mas deve ser explicitamente identificado.

## 5.3 Teste de isolamento obrigatório

Criar Conta A e Conta B.

Testar pelo menos:

- empresas;
- clientes PF;
- sócios;
- documentos;
- orçamento;
- contratos;
- faturamento/previsão;
- relatórios;
- arquivos gerados.

Conta A não pode listar, buscar por ID, alterar, excluir ou baixar conteúdo da Conta B.

Tentar ataques simples alterando IDs manualmente nas requisições.

---

# 6. CENTRAL DE PERSONALIZAÇÃO — FONTE ÚNICA DE IDENTIDADE

Criar/aperfeiçoar a área:

`/colaborador/personalizacao`

Campos:

- nome exibido;
- razão social;
- nome fantasia;
- CNPJ;
- telefone;
- WhatsApp;
- e-mail;
- site;
- endereço;
- cidade;
- UF;
- CEP;
- logo;
- cor primária;
- cor secundária;
- rodapé linha 1;
- rodapé linha 2;
- rodapé linha 3;
- signatário nome;
- cargo;
- CPF;
- e-mail;
- assinatura quando aplicável.

## 6.1 Upload

Padronizar frontend e backend.

Foi detectada inconsistência atual: o frontend aceita `image/svg+xml`, enquanto o backend valida apenas PNG/JPG/WEBP.

Nesta versão, usar somente:

- PNG;
- JPG/JPEG;
- WEBP.

Máximo 5 MB.
Validar MIME + assinatura real do arquivo.
Não confiar apenas na extensão.

## 6.2 Todos os PDFs e previews

Faça uma auditoria completa no repositório procurando:

- `PDFDocument`;
- `puppeteer`;
- `pdf-lib`;
- HTML convertido em PDF;
- funções `generate*Pdf`;
- logos fixas;
- “Destrava” hardcoded;
- “PermuPay”/outras marcas fixas;
- rodapés hardcoded;
- dados fixos de contratada;
- previews HTML/React de documentos.

Todo gerador pertencente à conta deve obter a identidade pelo serviço central de branding.

Cobertura mínima:

- orçamento;
- faturamento bruto;
- previsão/declarações;
- simulação;
- proposta;
- relatório técnico;
- acompanhamento bancário;
- relatórios especializados;
- contrato;
- previews correspondentes.

Preservar exceções legadas explícitas da conta Destrava quando já existirem opções de prestadora/marca selecionadas conscientemente pelo usuário.

Para contas novas, a Central de Personalização deve ser soberana.

---

# 7. CRIAÇÃO MANUAL DAS CONTAS DA PLATAFORMA

Criar/validar página administrativa semelhante a:

`/colaborador/contas-plataforma`

Apenas administrador global autorizado pode acessar.

Não confiar apenas no cargo do frontend.

Usar allowlist configurável, por exemplo:

```env
PLATFORM_ADMIN_EMAILS=...
```

Na criação da conta solicitar:

- nome da conta;
- slug;
- perfil;
- módulos opcionais;
- nome do administrador inicial;
- e-mail;
- senha inicial.

Criar em transação:

1. conta;
2. registro inicial de personalização;
3. usuário administrador vinculado à conta.

Adicionar capacidade de:

- ativar;
- suspender;
- alterar perfil;
- ativar/desativar módulos.

Auto cadastro e checkout NÃO fazem parte desta fase.

---

# 8. PERFIS E MÓDULOS

Manter um único código-base.

Perfis iniciais:

- Crédito + Contábil;
- Contábil;
- Assessoria de Crédito;
- Prestação de Serviços;
- Obras e Manutenção;
- Tecnologia e Sistemas;
- Consultoria / Assessoria.

Cada perfil apenas define módulos default.

O administrador pode customizar funções por conta.

## Regra

Ocultar menu não basta.

Toda rota/API de módulo controlado deve validar se a conta possui permissão para aquela função, além das permissões do usuário.

---

# 9. NÚCLEO UNIVERSAL DE PRODUTIVIDADE

Para perfis simples, priorizar apenas:

- Clientes;
- Empresas/CNPJ;
- Produtos/Serviços;
- Orçamentos;
- Propostas quando habilitadas;
- Contratos;
- Central de Personalização.

Não exibir módulos especializados de crédito sem necessidade.

## 9.1 Clientes PJ

Fluxo:

1. digitar CNPJ;
2. consultar integração existente;
3. preencher automaticamente dados empresariais disponíveis;
4. permitir revisão/complemento;
5. salvar;
6. reaproveitar em orçamento/proposta/contrato.

QSA/sócios devem ser persistidos/mostrados quando o perfil necessitar, sem transformar isso em etapa obrigatória para um prestador simples.

## 9.2 Clientes PF

Cadastro manual e curto.

Não implementar consulta automática de CPF sem uma fonte legal e contratada explicitamente.

---

# 10. ORÇAMENTO E PROPOSTA ULTRARRÁPIDOS

A experiência deve ser mobile-first.

Fluxo alvo:

`+ Novo orçamento → cliente → itens → prazo → gerar → compartilhar`

Itens devem suportar:

- serviço/produto;
- unidade;
- quantidade;
- valor unitário;
- desconto opcional;
- subtotal;
- total calculado server-side;
- observação;
- prazo;
- validade.

Unidades úteis:

- unidade;
- hora;
- diária;
- m²;
- metro;
- km;
- projeto;
- mensalidade;
- serviço;
- personalizado.

O orçamento deve usar a identidade da conta automaticamente.

A proposta pode ser opcional e usar o mesmo núcleo de itens/cálculos, evitando código duplicado.

---

# 11. CONVERSÃO ORÇAMENTO → CONTRATO

Esta é uma das funções centrais do produto.

Após aprovação do orçamento/proposta, disponibilizar:

**Gerar contrato**

Reutilizar automaticamente:

- cliente;
- CNPJ/CPF;
- endereço;
- itens;
- descrição dos serviços;
- valores;
- total;
- prazo;
- condições já conhecidas.

Não pedir novamente o que já existe.

A tela de geração deve mostrar apenas variáveis necessárias, por exemplo:

- data de início;
- vigência;
- prazo de execução;
- forma de pagamento;
- garantia;
- observações permitidas.

---

# 12. MOTOR DE CONTRATOS

Reaproveitar o que já existe no Destrava e evoluir de forma compatível.

Modelos devem possuir tokens e política:

- `fixo`;
- `automatico`;
- `calculado`;
- `editavel`.

Regras obrigatórias:

1. backend rejeita alteração de campo protegido;
2. cálculo nunca depende de LLM;
3. modelo publicado é versionado;
4. contrato gerado salva snapshot do template/políticas/dados;
5. alteração futura do template não muda contrato antigo;
6. documentos finalizados/assinados respeitam trava vigente do Destrava;
7. manter hash/auditoria quando já existente.

## Importação de modelo

Permitir utilizar contratos já usados pela empresa.

Suportar, conforme infraestrutura existente:

- DOCX;
- PDF;
- TXT;
- HTML.

IA pode sugerir os campos variáveis, mas não pode reescrever cláusulas nem publicar automaticamente.

---

# 13. IA — SOMENTE PARA ECONOMIZAR TEMPO

Não criar chatbot como peça central.

Implementar a IA de modo opcional e progressivo.

Prioridades:

## 13.1 Voz → orçamento

Preparar arquitetura para receber texto transcrito e estruturar itens.

A IA produz sugestão estruturada.
O motor determinístico calcula valores.
O usuário confirma antes de gerar.

## 13.2 Contrato → template

IA identifica candidatos a campos variáveis e tokens.
Preservar texto jurídico integral.
Exigir revisão.

## 13.3 Verificação inteligente

Antes de gerar documento, detectar:

- campos faltantes;
- datas incoerentes;
- valores divergentes;
- tokens não resolvidos;
- dados cadastrais ausentes;
- possíveis duplicações.

## 13.4 RAG vertical

Somente para perfis em que gere valor (crédito, contábil, consultoria técnica).

Se implementar fundação RAG:

- isolamento por conta;
- fontes versionadas;
- ACL;
- citações;
- nenhuma resposta sem fonte quando a tarefa exigir grounding;
- nenhuma decisão crítica determinada exclusivamente pelo LLM.

Não deixe o RAG atrasar a entrega do fluxo rápido principal.

---

# 14. UX/UI — PRINCÍPIOS OBRIGATÓRIOS

1. Mobile-first.
2. Interface limpa.
3. Tipografia legível.
4. Botões de ação claros.
5. Progressive disclosure.
6. Não exigir treinamento técnico.
7. Não exibir terminologia como tenant, RLS, RAG, feature flag para usuário comum.
8. Não criar dashboard cheio de gráficos inúteis.
9. Home deve priorizar ações rápidas.

Sugestão de home para perfis simples:

- `+ Cliente`
- `+ Orçamento`
- `+ Proposta`
- `+ Contrato`
- recentes

Para perfis especializados, manter os atalhos necessários do Destrava sem poluir o fluxo simples.

---

# 15. BANCO E MIGRATIONS

Audite o estado real antes de criar nova migration.

Não reutilize um número de migration já aplicado no ambiente.

Se a base atual já contém `081_multiempresa_personalizacao.sql`, validar e evoluir a partir dela com nova migration incremental, em vez de editar silenciosamente uma migration já aplicada em produção.

Se 081 ainda NÃO foi aplicada e o repositório é exatamente a base preparada para primeiro commit, você pode corrigir a própria 081 antes da primeira execução, desde que isso seja comprovado pelo histórico/ambiente.

Obrigatório:

- migration idempotente quando razoável;
- transação;
- backup antes;
- rollback documentado;
- índices;
- FKs;
- RLS;
- constraints por conta;
- não apagar dados existentes.

Variáveis esperadas ou equivalentes:

```env
DATABASE_URL=...
SYSTEM_DATABASE_URL=...
JWT_SECRET=...
DEFAULT_CONTA_ID=00000000-0000-4000-8000-000000000001
TENANT_DB_ROLE=...
PLATFORM_ADMIN_EMAILS=...
APP_NAME=Work Pro
VITE_APP_NAME=Work Pro
DATA_DIR=<MANTER CAMINHO PERSISTENTE ATUAL>
```

Preserve todas as variáveis existentes do Destrava para CNPJ, IA, Nexus e demais integrações.

Não alterar `DATA_DIR` no primeiro redeploy.
Não trocar cookie/sessão sem necessidade.

---

# 16. TESTES OBRIGATÓRIOS

## 16.1 Build e tipos

```bash
npm run check
npm test
npm run build
```

Todos devem passar, exceto falhas baseline comprovadamente preexistentes e não relacionadas; se houver alguma, corrigir quando seguro ou documentar com evidência.

## 16.2 Regressão do Destrava

Testar:

- login;
- empresas;
- CNPJ;
- QSA;
- sócios;
- cliente PF;
- faturamento bruto;
- previsão;
- orçamento;
- contrato;
- relatórios principais;
- simulação/proposta utilizada no nicho;
- documentos;
- permissões.

## 16.3 Multiempresa

Criar duas contas de teste e comprovar isolamento.

## 16.4 Branding

Para duas contas com logos/cores/dados diferentes, gerar os mesmos tipos de PDF e comprovar que cada um usa apenas a sua identidade.

## 16.5 Fluxo rápido

Cronometrar manualmente o fluxo em mobile/responsive:

- cadastrar PJ por CNPJ;
- gerar orçamento;
- converter em contrato.

Reduzir cliques/campos desnecessários encontrados durante o teste.

## 16.6 Contratos

Testar tentativa de alterar campo protegido diretamente pela API.
Deve falhar.

Testar snapshot/versionamento.

## 16.7 Upload

Testar PNG/JPG/WEBP válidos, arquivo inválido com extensão falsa e arquivo > 5 MB.

---

# 17. AUDITORIA ESPECIAL DE REGRESSÃO

Antes do commit final, compare o branch modificado contra o commit inicial e classifique cada arquivo alterado:

- necessário para multiempresa;
- necessário para branding;
- necessário para perfil/módulo;
- necessário para fluxo rápido;
- necessário para teste/correção.

Se um arquivo não estiver claramente justificado, revise a alteração.

Não remover arquivos do Destrava sem justificativa objetiva.

Procure regressões de:

- rotas;
- migrations;
- constraints;
- imports;
- env vars;
- build Vite;
- build server;
- PDFs;
- autenticação;
- permissões;
- PWA/desktop;
- armazenamento persistente.

---

# 18. MIGRAÇÃO E DEPLOY

Somente depois dos testes locais:

1. identificar ambiente de banco autorizado;
2. criar backup completo do PostgreSQL;
3. verificar que o backup existe e tem tamanho/conteúdo plausível;
4. confirmar `DATA_DIR` persistente;
5. executar migration apropriada;
6. executar smoke queries de esquema;
7. rodar aplicação/build;
8. realizar smoke tests;
9. somente então concluir commit/push/deploy.

Se tiver acesso ao ambiente de produção autorizado, execute a migration e valide.

Se não tiver acesso real ao banco/deploy, não invente sucesso: deixe o comando exato e informe objetivamente o bloqueio.

---

# 19. GIT — PRIMEIRO COMMIT

Não faça commits intermediários desta fundação.

Depois de TODOS os gates passarem:

```bash
git status
git diff --check
```

Revisar o diff completo.

Criar commit único com mensagem semelhante a:

```text
feat: add multi-tenant foundation, account branding and fast service workflows
```

ou em português:

```text
feat: cria fundação multiempresa, personalização e fluxos rápidos
```

Depois:

```bash
git push
```

Use a branch/remoto corretos já configurados no repositório.
Não faça force-push.
Não reescreva histórico.

Se houver pipeline CI/CD, aguarde/consulte o resultado e corrija falhas causadas pelo commit antes de considerar a missão concluída.

---

# 20. CRITÉRIOS DE ACEITE FINAIS

A missão só termina quando houver evidência de que:

- [ ] baseline foi registrado;
- [ ] Destrava legado continua íntegro;
- [ ] conta legada foi preservada;
- [ ] novas contas podem ser criadas manualmente;
- [ ] isolamento entre contas foi testado;
- [ ] Central de Personalização funciona;
- [ ] branding chegou aos PDFs e previews principais;
- [ ] upload de logo está consistente frontend/backend;
- [ ] perfis e módulos funcionam no frontend e backend;
- [ ] PJ por CNPJ reaproveita dados;
- [ ] PF manual funciona;
- [ ] orçamento rápido funciona em mobile;
- [ ] orçamento/proposta pode alimentar contrato;
- [ ] contrato não pede redigitação desnecessária;
- [ ] campos protegidos são protegidos também na API;
- [ ] faturamento bruto/previsão do Destrava permanece para perfis pertinentes;
- [ ] nenhum módulo genérico de ERP/contas a receber foi introduzido;
- [ ] `npm run check` passou;
- [ ] testes passaram;
- [ ] `npm run build` passou;
- [ ] migration foi validada e, quando houver acesso autorizado, executada com backup;
- [ ] smoke test pós-migration passou;
- [ ] `git diff --check` passou;
- [ ] commit final foi criado;
- [ ] push foi realizado;
- [ ] CI/deploy foi validado quando disponível.

---

# 21. RELATÓRIO FINAL OBRIGATÓRIO DO MANUS

Ao concluir, responda com um relatório objetivo contendo:

1. branch e commit final;
2. link/remote do push, quando disponível;
3. arquivos alterados;
4. migrations criadas/alteradas;
5. migration executada e resultado;
6. tabelas/colunas/policies criadas;
7. variáveis novas;
8. funcionalidades implementadas;
9. PDFs auditados;
10. testes executados e resultados;
11. evidências de isolamento A/B;
12. evidências de regressão do Destrava;
13. build final;
14. status do CI/deploy;
15. qualquer limitação real encontrada;
16. instruções de rollback.

Não escrever “está tudo certo” sem evidência concreta.

---

# 22. PRINCÍPIO DE DECISÃO

Para qualquer nova ideia encontrada durante o desenvolvimento, pergunte:

> **Isso faz o profissional executar o trabalho mais rápido, com menos erro e melhor apresentação ao cliente?**

Se SIM e não aumenta complexidade desnecessária, pode ser incorporada de forma modular.

Se NÃO, não coloque no núcleo.

A plataforma deve ser percebida como **uma ferramenta que resolve**, não como mais um sistema para alimentar.
