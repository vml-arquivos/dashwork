# PACOTE COMPLETO PARA EXECUÇÃO NO MANUS — WORK PRO (NOME PROVISÓRIO)

Este arquivo contém dois documentos em sequência:

1. Relatório Mestre do Produto e da Arquitetura
2. Prompt Mestre de Execução para o Manus

---

# RELATÓRIO MESTRE — WORK PRO (NOME PROVISÓRIO)
## Ferramenta leve de produtividade, documentos e atendimento rápido baseada no Destrava

**Data:** 14/08/2026  
**Base canônica:** sistema Destrava existente e funcional.  
**Nome de trabalho:** **Work Pro** — provisório e totalmente desacoplado do código.

---

## 1. Visão executiva

O produto não deve ser um ERP, um software pesado de gestão, um sistema de contas a receber ou uma plataforma que obrigue o profissional a passar mais tempo alimentando o sistema do que trabalhando.

A proposta é criar uma **ferramenta de produtividade operacional e documental**, extremamente rápida, simples e adaptável ao nicho do usuário, aproveitando a maturidade do Destrava como base técnica.

A ferramenta deve reduzir tarefas que hoje levam 20, 30 ou 60 minutos para poucos minutos ou segundos, diminuindo redigitação, erros manuais, documentos inconsistentes e demora no atendimento.

### Promessa central

> **Cadastrar uma vez. Reaproveitar os dados. Gerar rápido. Entregar com qualidade.**

### Fluxo universal

**Cliente → Orçamento/Proposta → Aprovação → Contrato → Documento final**

Nem todas as etapas são obrigatórias. O usuário deve poder entrar diretamente em qualquer fluxo permitido pelo seu perfil.

---

## 2. O que o produto NÃO deve virar

É proibido transformar o produto universal em:

- ERP completo;
- sistema contábil completo;
- contas a pagar/receber genérico;
- banco de dados burocrático;
- sistema com dezenas de telas obrigatórias;
- ferramenta que exija cadastro excessivo para executar uma tarefa simples;
- software que force todos os nichos a usar as mesmas funções;
- chatbot genérico sem função prática;
- nova aplicação reescrita do zero quando o Destrava já possui soluções maduras.

O princípio é **menos sistema e mais resultado**.

---

## 3. Base existente: Destrava

O Destrava continua sendo a base funcional e deve ser tratado como fonte de soluções maduras a reaproveitar.

### Funções especializadas que devem continuar nos perfis que precisam delas

- cadastro de empresas;
- clientes PF;
- consulta de CNPJ;
- QSA e sócios;
- faturamento bruto/histórico da empresa analisada;
- previsão de faturamento;
- documentação;
- análise de crédito;
- simulações;
- acompanhamento bancário;
- acompanhamento financeiro especializado;
- orçamentos;
- contratos;
- relatórios técnicos;
- propostas/documentos bancários;
- integrações existentes.

**Importante:** “faturamento” neste contexto é o faturamento bruto e a previsão de faturamento da empresa cliente analisada, como já ocorre no Destrava. Não significa receita do usuário da plataforma, cobrança SaaS, contas a receber ou módulo financeiro genérico.

---

## 4. Nova arquitetura de produto

### 4.1 Plataforma multiempresa

A mesma aplicação atenderá várias empresas contratantes.

Cada contratante terá:

- conta própria;
- usuários próprios;
- clientes próprios;
- documentos próprios;
- identidade visual própria;
- módulos próprios;
- contratos próprios;
- orçamentos próprios;
- dados especializados próprios, quando o perfil exigir.

Nenhuma conta pode visualizar ou alterar dados de outra conta.

A conta atual do Destrava deve ser preservada como conta legada, sem perda de dados nem alteração de comportamento.

### 4.2 Perfis de uso

Os perfis não devem gerar forks do sistema. São apenas presets de módulos.

Perfis iniciais:

1. Crédito + Contábil — base Destrava completa pertinente ao nicho;
2. Contábil;
3. Assessoria de Crédito;
4. Prestação de Serviços;
5. Obras e Manutenção;
6. Tecnologia e Sistemas;
7. Consultoria / Assessoria.

O administrador da plataforma poderá ativar/desativar funções adicionais por conta.

### 4.3 Central de Personalização

Cada empresa contratante configura uma única vez:

- logo;
- nome de exibição;
- razão social;
- nome fantasia;
- CNPJ;
- telefone;
- WhatsApp;
- e-mail;
- site;
- endereço;
- cidade/UF/CEP;
- cor principal;
- cor secundária;
- rodapé padrão;
- responsável/signatário;
- cargo do signatário;
- CPF do signatário;
- e-mail do signatário;
- assinatura, quando aplicável.

Essa central é a **fonte única de identidade documental**.

Todo PDF e documento gerado pela conta deve utilizar automaticamente essa identidade, salvo exceções legadas expressamente preservadas na conta original do Destrava.

---

## 5. Regra de ouro dos documentos

O usuário não deve redigitar informações que o sistema já conhece.

### Exemplos de dados automáticos

- razão social;
- nome fantasia;
- CNPJ;
- endereço;
- telefone;
- e-mail;
- dados da contratada;
- dados do contratante;
- itens de orçamento;
- valores;
- totais;
- datas já conhecidas;
- serviços selecionados;
- signatário;
- identidade visual.

### Contratos

Os modelos devem utilizar políticas de campo:

- **FIXO** — cláusula ou informação bloqueada;
- **AUTOMÁTICO** — vem do cliente, empresa, proposta ou configuração;
- **CALCULADO** — resultado determinístico do sistema;
- **EDITÁVEL** — único conteúdo que o operador pode alterar livremente antes da finalização/assinatura.

A proteção deve existir no backend, e não apenas na interface.

Um contrato gerado deve possuir snapshot do modelo e dos dados usados para evitar que uma alteração posterior no template modifique documentos antigos.

---

## 6. Cadastro rápido de clientes

### Pessoa Jurídica

Fluxo ideal:

1. informar CNPJ;
2. consultar fonte de CNPJ configurada;
3. preencher automaticamente os dados disponíveis;
4. carregar QSA/sócios quando o perfil necessitar;
5. usuário apenas revisa/complementa;
6. salvar.

Esses dados devem ser reutilizados em orçamento, proposta, contrato e documentos subsequentes.

### Pessoa Física

Cadastro manual, objetivo e curto.

Nunca criar promessa de consulta automática de CPF ou enriquecimento de pessoa física sem fonte legal, contratada e autorizada.

---

## 7. Fluxos rápidos por nicho

### 7.1 Obras e manutenção

**Cliente → Orçamento → Aprovação → Contrato**

Exemplo mobile:

- novo orçamento;
- cliente existente ou CNPJ;
- serviço;
- unidade (m², hora, diária, unidade etc.);
- quantidade;
- valor unitário;
- desconto opcional;
- prazo;
- validade;
- gerar PDF;
- compartilhar.

Ao aprovar, o botão **Gerar contrato** reutiliza tudo que já foi preenchido.

### 7.2 Serviços profissionais

**Cliente → Serviço → Orçamento/Proposta → Contrato**

A proposta pode ser opcional.

### 7.3 Tecnologia e sistemas

**Cliente → Serviço/Projeto → Proposta → Contrato**

Sem transformar a ferramenta em gestor de projetos completo.

### 7.4 Contábil

Mantém os dados empresariais, sócios, faturamento/previsão e documentos que sejam úteis ao contador, adicionando os fluxos rápidos de proposta/orçamento/contrato e identidade própria.

### 7.5 Assessoria de crédito

Preserva o máximo da base Destrava pertinente: empresa, QSA, sócios, documentos, faturamento bruto, previsão, análises, relatórios, proposta e contrato.

---

## 8. Experiência mobile-first

A ferramenta deve ser excelente no celular.

### Tela inicial recomendada

Priorizar ações, não gráficos:

- **+ Cliente**
- **+ Orçamento**
- **+ Proposta**
- **+ Contrato**
- Recentes
- Pendências realmente úteis, quando houver

Evitar dashboard carregado com KPIs que não ajudam a executar o trabalho.

### Progressive disclosure

Mostrar primeiro apenas o necessário. Campos avançados aparecem somente quando:

- o perfil exige;
- o modelo exige;
- o usuário pede opções avançadas.

---

## 9. Inovações que realmente agregam valor

A inovação não deve aumentar complexidade. Ela deve remover trabalho.

### 9.1 Orçamento por voz

O profissional dita:

> “Orçamento para XPTO, 250 metros de pintura a 28 reais, preparação a 8 reais, prazo de 15 dias.”

A IA transforma a fala em estrutura de orçamento, mas cálculos continuam determinísticos.

### 9.2 Importação inteligente de contrato

O cliente envia o contrato que já utiliza.

A IA identifica candidatos a:

- dados automáticos;
- valores calculados;
- campos editáveis;
- cláusulas fixas.

Nada é publicado sem revisão humana.

### 9.3 Assistente de preenchimento

A IA pode sugerir dados faltantes e detectar inconsistências, mas nunca inventar informação cadastral.

### 9.4 Validação antes de gerar

Antes do PDF final:

- cliente incompleto;
- valor inconsistente;
- data inválida;
- prazo ausente;
- campo obrigatório não preenchido;
- token sem valor;
- contrato sem signatário quando exigido.

A ferramenta deve impedir erro simples antes que ele chegue ao cliente.

### 9.5 RAG apenas onde fizer sentido

Para contabilidade, crédito e profissões com base técnica própria, pode existir RAG por conta para pesquisar:

- políticas internas;
- modelos;
- procedimentos;
- documentos técnicos;
- regras da empresa.

RAG não deve aparecer como obrigação para o prestador simples.

### 9.6 IA como copiloto, não como autoridade

IA pode interpretar, sugerir e acelerar.

IA não deve decidir:

- valores finais sem motor determinístico;
- permissões;
- isolamento de conta;
- bloqueio contratual;
- regras críticas de banco;
- identidade da empresa;
- estados de documentos.

---

## 10. Administração da plataforma

Inicialmente o cadastro de empresas contratantes será manual.

O administrador da plataforma deve conseguir:

- criar conta;
- escolher perfil;
- definir módulos ativos;
- criar usuário administrador inicial;
- ativar/suspender conta;
- editar preset de módulos.

A empresa contratante entra no próprio painel e configura sua identidade.

### Futuro, não agora

Posteriormente poderão ser adicionados:

- auto cadastro;
- planos;
- checkout;
- pagamento recorrente;
- provisionamento automático da conta.

Isso não deve bloquear a primeira versão.

---

## 11. Segurança e isolamento

Requisitos obrigatórios:

- `conta_id` em dados operacionais multiempresa;
- RLS no PostgreSQL nas tabelas multiempresa;
- role operacional sem `SUPERUSER` e sem `BYPASSRLS`;
- contexto da conta derivado do usuário autenticado, nunca de parâmetro livre do frontend;
- administração global separada do contexto tenant;
- cache de branding isolado por conta;
- arquivos físicos em diretórios separados por `conta_id`;
- nenhum documento de uma conta pode ser baixado por outra;
- logs sem vazamento de dados entre contas;
- tokens antigos sem `conta_id` devem ser invalidados após migração;
- migrations sempre com backup e rollback documentado.

---

## 12. Identidade e nome do produto

O nome definitivo ainda será escolhido.

**Nome provisório de desenvolvimento:** `Work Pro`.

A arquitetura deve usar configuração:

- `APP_NAME`;
- `VITE_APP_NAME`;
- identidade da conta em banco.

É proibido hardcode generalizado de `Work Pro`, `Ritmo` ou `Destrava` em áreas universais.

A marca Destrava pode continuar onde fizer parte de compatibilidade legada da conta original até a migração de marca ser deliberadamente aprovada.

---

## 13. Estado técnico já existente na base preparada

A base preparada a partir do Destrava já contém uma primeira fundação multiempresa/personalização com conceitos como:

- `contas_plataforma`;
- `conta_personalizacao`;
- `conta_id`;
- RLS;
- role `ritmo_tenant_app` como nome técnico atual a ser tornado configurável/renomeável apenas se seguro;
- `/colaborador/personalizacao`;
- `/colaborador/contas-plataforma`;
- branding server-side;
- perfis de conta;
- migration `081_multiempresa_personalizacao.sql`;
- script `npm run migrate:multiempresa`.

O Manus deve auditar o estado real do branch/repositório e não assumir que todo código experimental anterior foi aplicado.

### Inconsistência já detectada

A UI de personalização anuncia/aceita SVG no seletor de arquivo, porém o backend atual valida apenas PNG/JPG/WEBP. O comportamento deve ser unificado; por segurança e simplicidade, recomenda-se manter inicialmente somente PNG/JPG/WEBP também no frontend.

---

## 14. Estratégia de desenvolvimento

### Fase 1 — Baseline

- identificar branch e commit atuais;
- `git status`;
- inventariar migrations aplicadas;
- instalar dependências;
- rodar `npm run check`;
- rodar testes;
- rodar build;
- registrar falhas preexistentes antes de modificar.

### Fase 2 — Fundação multiempresa

- validar esquema atual;
- validar `conta_id` e RLS;
- completar tabelas esquecidas;
- garantir que toda conexão autenticada use contexto da conta;
- garantir pool de sistema separado;
- validar conta legada.

### Fase 3 — Central de Personalização

- consolidar identidade única;
- validar uploads;
- conectar todos os PDFs/previews;
- eliminar marcas fixas indevidas;
- preservar exceções legadas expressas.

### Fase 4 — Perfis e funções

- revisar presets;
- remover menus inúteis por perfil;
- permitir módulos customizados por conta;
- backend deve validar acesso, não apenas ocultar menu.

### Fase 5 — Fluxo universal rápido

- cliente PF/PJ;
- CNPJ automático;
- orçamento/proposta;
- gerar contrato reutilizando dados;
- reduzir campos e cliques;
- mobile-first.

### Fase 6 — Contratos e templates

- importar modelos existentes;
- mapear tokens;
- políticas FIXO/AUTOMÁTICO/CALCULADO/EDITÁVEL;
- geração e regeneração segura;
- snapshot e versionamento;
- bloquear edição conforme regra vigente.

### Fase 7 — Qualidade

- testes unitários;
- testes de integração;
- testes de isolamento entre duas contas;
- testes de regressão do Destrava;
- testes dos principais PDFs;
- testes mobile;
- build de produção.

### Fase 8 — Migração/deploy

- backup;
- migration;
- smoke tests;
- commit final;
- push;
- validar CI/deploy;
- rollback se gate falhar.

---

## 15. Métricas de sucesso do produto

O produto deve ser avaliado principalmente por redução de esforço:

- tempo para cadastrar PJ;
- tempo para gerar orçamento;
- tempo para transformar orçamento em contrato;
- número de campos redigitados;
- número de erros bloqueados antes do PDF;
- número de cliques por fluxo;
- uso pelo celular;
- percentual de documentos gerados sem edição manual posterior.

Objetivo conceitual: tarefas documentais comuns devem levar **minutos, não dezenas de minutos**.

---

## 16. Critérios de aceite da primeira versão

A primeira versão só pode ser considerada pronta quando:

1. Destrava legado continua funcionando sem regressão relevante;
2. duas contas diferentes não conseguem cruzar dados;
3. administração consegue criar nova conta manualmente;
4. nova conta consegue personalizar logo/dados/rodapé/signatário;
5. PDFs principais usam a identidade correta;
6. PJ pode ser cadastrada rapidamente por CNPJ;
7. PF pode ser cadastrada manualmente;
8. perfil Serviços/Obras consegue gerar orçamento simples rapidamente;
9. orçamento aprovado pode alimentar contrato sem redigitação desnecessária;
10. perfis Contábil/Crédito preservam faturamento/previsão e funções especializadas;
11. menus respeitam módulos ativos;
12. backend também respeita módulos/permissões;
13. `npm run check`, testes e `npm run build` passam;
14. migrations são executadas com backup e registro;
15. smoke test pós-deploy passa;
16. commit e push são realizados somente após os gates de qualidade.

---

## 17. Princípio final

Toda nova funcionalidade deve responder a uma pergunta:

> **Isso reduz tempo, erro ou esforço do profissional?**

Se não reduzir, não deve entrar no núcleo da ferramenta.

O produto deve ser lembrado não por possuir muitas telas, mas por **resolver rápido, gerar certo e entregar profissionalmente**.


---

# PARTE 2 — PROMPT DE EXECUÇÃO PARA O MANUS

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
