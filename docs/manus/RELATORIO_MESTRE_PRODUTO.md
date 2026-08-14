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
