# Análise de Pontos de Função — callZUP

> **Documento acadêmico — estimativa preliminar**
>
> **Projeto:** callZUP — plataforma de comunicação corporativa  
> **Disciplina:** ______________________________  
> **Professor(a):** ___________________________  
> **Integrantes:** _____________________________  
> **Data:** ____/____/________

## 1. Objetivo

Este documento apresenta uma estimativa preliminar do tamanho funcional do sistema callZUP por meio da Análise de Pontos de Função (APF). O objetivo é identificar as funções de dados e transacionais previstas, classificá-las, registrar as premissas utilizadas e calcular uma estimativa inicial de tamanho e custo com base no valor de R$ 488,00 por ponto de função informado na atividade.

## 2. Escopo considerado

A análise considera as funcionalidades previstas para o callZUP, uma plataforma de comunicação corporativa que contempla:

- Cadastro e gerenciamento de usuários e empresas;
- Comunicação por mensagens individuais e em grupos;
- Histórico e pesquisa de mensagens;
- Compartilhamento de arquivos;
- Reuniões e participação em reuniões;
- Compartilhamento de tela;
- Gerenciamento de perfis, participantes e permissões.

A estimativa considera essas funcionalidades como requisitos planejados, não como confirmação de que todas já estão implementadas. Integrações externas não foram identificadas nesta análise.

## 3. Conceitos e legenda da APF

As funções foram classificadas conforme os cinco tipos de função utilizados na Análise de Pontos de Função:

| Sigla | Nome | Descrição resumida |
|---|---|---|
| ALI | Arquivo Lógico Interno | Grupo lógico de dados mantido pelo próprio sistema |
| AIE | Arquivo de Interface Externa | Grupo lógico de dados mantido por outro sistema e utilizado pelo sistema analisado |
| EE | Entrada Externa | Processo que recebe dados ou informações de controle e pode manter dados internos |
| CE | Consulta Externa | Processo que consulta ou apresenta dados sem atualizá-los |
| SE | Saída Externa | Processo que apresenta ou envia informações derivadas ou resultados para fora do sistema |

## 4. Identificação das funções de dados e transacionais

### 4.1 Funções de dados

| Função | Descrição | Tipo |
|---|---|---|
| Usuários | Dados de cadastro, nome, e-mail, senha e perfil | ALI |
| Empresas | Informações das empresas cadastradas | ALI |
| Conversas | Dados das conversas e participantes | ALI |
| Mensagens | Conteúdo das mensagens e histórico | ALI |
| Grupos | Dados dos grupos, membros e configurações | ALI |
| Reuniões | Informações das reuniões e participantes | ALI |
| Arquivos | Arquivos compartilhados nas conversas | ALI |
| Permissões | Papéis e níveis de acesso dos usuários | ALI |

### 4.2 Funções transacionais

| Função | Descrição |
|---|---|
| Cadastro de usuário | Criar uma conta no sistema |
| Login | Autenticar o usuário |
| Enviar mensagem | Enviar mensagens para outros usuários |
| Criar grupo | Criar grupos de conversação |
| Gerenciar participantes | Adicionar ou remover participantes |
| Pesquisar mensagens | Consultar mensagens e histórico |
| Compartilhar arquivos | Enviar documentos e arquivos |
| Criar reunião | Agendar ou iniciar uma reunião |
| Participar de reunião | Entrar em uma reunião |
| Compartilhar tela | Transmitir a tela para os participantes |
| Gerenciar perfil | Editar informações pessoais |
| Gerenciar empresa | Administrar configurações corporativas |

## 5. Classificação das funções segundo APF

| Função | Classificação | Justificativa |
|---|---|---|
| Usuários | ALI | Mantém os dados dos usuários |
| Empresas | ALI | Mantém os dados das organizações |
| Conversas | ALI | Armazena as conversas |
| Mensagens | ALI | Mantém o histórico de mensagens |
| Grupos | ALI | Armazena grupos e seus participantes |
| Reuniões | ALI | Mantém informações das reuniões |
| Arquivos | ALI | Controla arquivos armazenados e compartilhados |
| Permissões | ALI | Mantém regras de acesso |
| Cadastro de usuário | EE | Entrada de dados para criação de usuário |
| Login | EE | Entrada de dados para autenticação |
| Enviar mensagem | EE | Entrada de dados que atualiza o sistema |
| Criar grupo | EE | Entrada de dados para criação de grupo |
| Gerenciar participantes | EE | Entrada que altera membros do grupo |
| Pesquisar mensagens | CE | Consulta dados sem alterar informações |
| Compartilhar arquivos | EE | Entrada de dados e arquivo para armazenamento |
| Criar reunião | EE | Entrada de informações para criação de reunião |
| Participar de reunião | CE | Considerada consulta/acesso à reunião, sem atualização de dados funcionais nesta estimativa |
| Compartilhar tela | EE | Ação que inicia ou controla a transmissão |
| Gerenciar perfil | EE | Entrada que altera dados do usuário |
| Gerenciar empresa | EE | Entrada que altera dados corporativos |
| Notificações | SE | Saída de informações e alertas ao usuário |

> **Nota de classificação:** Algumas funções podem mudar de classificação após o detalhamento dos requisitos. Por exemplo, participar de uma reunião pode ser uma EE se registrar ou atualizar dados funcionais de participação, ou CE se apenas consultar/acessar a reunião. O compartilhamento de tela também precisa ser detalhado para confirmar se constitui uma transação funcional independente.

## 6. Premissas adotadas

- O callZUP será uma plataforma de comunicação corporativa.
- Cada empresa poderá possuir vários usuários.
- Os usuários poderão trocar mensagens individuais e em grupos.
- O sistema terá histórico de mensagens.
- Será possível compartilhar arquivos.
- Haverá funcionalidades de reuniões e compartilhamento de tela.
- Os dados serão armazenados pelo próprio sistema.
- As permissões serão controladas por perfis de usuário.
- Não foram identificadas integrações externas na descrição considerada; por isso, AIE foi estimado como zero.
- A análise considera funcionalidades previstas, não necessariamente já implementadas.
- Para esta estimativa preliminar, as funções foram consideradas de complexidade média e receberam os pesos adotados na tabela de cálculo abaixo.

## 7. Informações que ainda precisam ser esclarecidas

Antes de realizar uma contagem definitiva, seria necessário esclarecer:

- Quantos tipos de usuários e perfis existirão?
- Haverá integração com sistemas externos?
- As reuniões terão gravação?
- O compartilhamento de arquivos terá limite de tamanho?
- Haverá notificações por e-mail, push ou apenas dentro do sistema?
- Existirá painel administrativo e relatórios?
- As mensagens poderão ser editadas ou excluídas?
- Haverá recursos de segurança adicionais, como autenticação em dois fatores?
- O sistema registrará presença, duração ou outros dados das reuniões?
- O compartilhamento de tela terá controles ou registros próprios?

## 8. Metodologia e proposta preliminar de estimativa

Para a atividade, foi realizada uma identificação preliminar das funções de dados e transacionais, seguida de classificação por tipo de função. Como os requisitos ainda não estão detalhados o suficiente para determinar a complexidade de cada função com precisão, foi adotada uma estimativa simplificada considerando complexidade média e os pesos utilizados abaixo.

| Tipo | Quantidade estimada | Peso adotado | Total |
|---|---:|---:|---:|
| ALI | 8 | 10 | 80 PF |
| AIE | 0 | 7 | 0 PF |
| EE | 10 | 4 | 40 PF |
| CE | 2 | 4 | 8 PF |
| SE | 1 | 5 | 5 PF |
| **Total estimado** | **21 funções** | | **133 PF** |

### 8.1 Estimativa financeira

Considerando o valor de R$ 488,00 por ponto de função indicado na atividade:

**133 PF × R$ 488,00 = R$ 64.904,00**

**Valor preliminar estimado: R$ 64.904,00.**

## 9. Limitações da estimativa

Esta estimativa é preliminar e didática. Não substitui uma contagem formal de Pontos de Função. Para uma avaliação mais precisa, seria necessário detalhar os requisitos, identificar os arquivos lógicos, os tipos de dados, os campos, os relacionamentos, as regras de processamento, as fronteiras do sistema e a complexidade de cada função. A classificação de algumas funcionalidades transacionais também poderá ser revisada conforme as decisões de projeto e os requisitos confirmados.

## 10. Conclusão

A Análise de Pontos de Função permitiu organizar e identificar as principais funcionalidades previstas para o callZUP, separando funções de dados e funções transacionais. Com as premissas adotadas nesta atividade, chegou-se a uma estimativa inicial de **133 Pontos de Função**, equivalente a **R$ 64.904,00** considerando o valor unitário informado de R$ 488,00. O resultado serve como referência inicial para discutir o tamanho funcional e o custo do projeto, devendo ser refinado à medida que os requisitos forem esclarecidos e detalhados.
