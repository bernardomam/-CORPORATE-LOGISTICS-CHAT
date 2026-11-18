# Análise de Pontos de Função — callZUP

## 1. Identificação das funções de dados e transacionais

### Funções de dados

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

### Funções transacionais

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

## 2. Classificação das funções segundo APF

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
| Participar de reunião | CE | Consulta/entrada em uma reunião existente, considerando que não altera dados relevantes além da sessão |
| Compartilhar tela | EE | Ação que inicia ou controla a transmissão |
| Gerenciar perfil | EE | Entrada que altera dados do usuário |
| Gerenciar empresa | EE | Entrada que altera dados corporativos |
| Notificações | SE | Saída de informações e alertas ao usuário |

> **Observação:** Algumas funções podem mudar de classificação dependendo de como forem implementadas. Por exemplo, participar de reunião pode ser EE se registrar a participação, ou CE se apenas consultar/acessar.

## 3. Premissas adotadas

- O callZUP será uma plataforma de comunicação corporativa.
- Cada empresa poderá possuir vários usuários.
- Os usuários poderão trocar mensagens individuais e em grupos.
- O sistema terá histórico de mensagens.
- Será possível compartilhar arquivos.
- Haverá funcionalidades de reuniões e compartilhamento de tela.
- Os dados serão armazenados pelo próprio sistema.
- As permissões serão controladas por perfis de usuário.
- A análise considera funcionalidades previstas, não necessariamente já implementadas.

## 4. Informações que ainda precisam ser esclarecidas

Antes de realizar uma contagem definitiva, seria necessário esclarecer:

- Quantos tipos de usuários e perfis existirão?
- Haverá integração com sistemas externos?
- As reuniões terão gravação?
- O compartilhamento de arquivos terá limite de tamanho?
- Haverá notificações por e-mail, push ou apenas dentro do sistema?
- Existirá painel administrativo e relatórios?
- As mensagens poderão ser editadas ou excluídas?
- Haverá recursos de segurança adicionais, como autenticação em dois fatores?

## 5. Proposta preliminar de estimativa

Considerando uma estimativa inicial de complexidade média:

| Tipo | Quantidade estimada | Peso médio | Total |
|---|---:|---:|---:|
| ALI | 8 | 10 | 80 PF |
| AIE | 0 | 7 | 0 PF |
| EE | 10 | 4 | 40 PF |
| CE | 2 | 4 | 8 PF |
| SE | 1 | 5 | 5 PF |
| **Total estimado** | **21 funções** | | **133 PF** |

### Estimativa financeira

Considerando o valor de R$ 488,00 por ponto de função indicado na atividade:

**133 × R$ 488,00 = R$ 64.904,00**

**Estimativa preliminar: R$ 64.904,00.**

Esse valor é apenas uma estimativa inicial para fins acadêmicos. Uma contagem oficial exigiria detalhar os requisitos, arquivos lógicos, campos, relacionamentos e regras de processamento.
