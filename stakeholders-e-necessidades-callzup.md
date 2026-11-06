# CallZUP --- Stakeholders, Perfis de Usuário e Necessidades

## 1. Objetivo do documento

Registrar os stakeholders identificados na entrevista com o cliente, os
dois perfis de usuário do CallZUP, suas permissões, necessidades e
responsabilidades. Este documento serve como referência para as decisões
de produto e para o desenvolvimento das funcionalidades validadas.

As informações abaixo foram organizadas a partir da entrevista realizada
com o cliente. Funcionalidades que não foram validadas pelo cliente não
fazem parte do escopo definido e não devem ser implementadas.

## 2. Stakeholders identificados

  -----------------------------------------------------------------------
  Stakeholder             Participação no projeto Responsabilidades /
                                                  interesses
  ----------------------- ----------------------- -----------------------
  Cliente (professor)     Representante do        Define e valida as
                          negócio e responsável   regras de negócio e as
                          por apresentar as       funcionalidades
                          necessidades do produto esperadas para o
                                                  CallZUP.

  Equipe de TI            Administradora do       Gerencia os usuários,
                          sistema                 as permissões
                                                  administrativas, os
                                                  grupos e as senhas. É a
                                                  única equipe com acesso
                                                  administrativo.

  Usuário comum           Usuário final da        Utiliza as
                          plataforma              funcionalidades de
                                                  comunicação
                                                  disponibilizadas pelo
                                                  sistema, respeitando as
                                                  regras e limitações
                                                  definidas pelo cliente.

  Equipe de               Responsável pela        Implementa as
  desenvolvimento         construção do CallZUP   funcionalidades e
                                                  regras validadas pelo
                                                  cliente e documentadas
                                                  para o projeto.
  -----------------------------------------------------------------------

## 3. Perfis de usuário

O CallZUP terá dois perfis de usuário:

### 3.1. Equipe de TI

A equipe de TI é o único perfil com acesso administrativo ao sistema.

**Permissões e responsabilidades:** - Criar usuários e disponibilizar os
dados de acesso por e-mail. - Gerenciar os usuários cadastrados. -
Desativar contas de usuários. As contas não devem ser excluídas
permanentemente. - Gerenciar e redefinir senhas dos usuários. - Criar
grupos, inclusive grupos destinados a determinados níveis hierárquicos,
como diretores. - Administrar o sistema e suas configurações
autorizadas.

### 3.2. Usuário comum

O usuário comum utiliza o CallZUP para a comunicação interna da empresa,
sem permissões administrativas.

**Permissões e limitações:** - Utilizar as funcionalidades de
comunicação disponibilizadas no aplicativo. - Enviar mensagens de
texto. - Compartilhar arquivos PDF e JPEG. - Visualizar o status de
entrega e leitura das mensagens. - Não possui acesso administrativo. -
Não pode criar grupos. - Não pode criar ou gerenciar contas de
usuários. - Não pode alterar a própria senha pelo aplicativo; deve
solicitar a alteração à equipe de TI.

## 4. Necessidades e regras levantadas

### 4.1. Necessidades da empresa e do sistema

-   Garantir que a comunicação aconteça somente dentro do ambiente da
    própria empresa.
-   Manter os dados e as conversas de cada empresa isolados: usuários de
    uma empresa não podem acessar informações de outra.
-   Centralizar a administração do sistema na equipe de TI.
-   Controlar a criação, a administração e a desativação de usuários.
-   Permitir a criação de grupos pela equipe de TI, inclusive grupos
    destinados a níveis hierárquicos específicos.
-   Restringir o uso do aplicativo ao horário definido pelo cliente: das
    8h às 18h.

### 4.2. Necessidades do usuário comum

-   Comunicar-se com outros usuários da própria empresa.
-   Enviar mensagens de texto.
-   Compartilhar documentos e imagens nos formatos permitidos (PDF e
    JPEG).
-   Saber se uma mensagem foi entregue e visualizada.

### 4.3. Regras de negócio e restrições confirmadas

1.  Cada empresa cadastrada é responsável pelo seu próprio ambiente de
    utilização.
2.  Não pode haver acesso ou comunicação entre empresas diferentes.
3.  Somente a equipe de TI possui acesso administrativo.
4.  Somente a equipe de TI pode criar grupos e gerenciar usuários.
5.  Usuários devem ser desativados, e não excluídos permanentemente.
6.  A equipe de TI cria as contas e envia os dados de acesso por e-mail.
7.  A alteração ou redefinição de senha é feita pela equipe de TI.
8.  O acesso ao aplicativo é permitido somente das 8h às 18h.
9.  O compartilhamento de arquivos é limitado aos formatos PDF e JPEG.
10. Arquivos Word e Excel não são permitidos.
11. O aplicativo não terá mensagens de áudio, chamadas de áudio ou
    chamadas de vídeo.
12. O status de entrega e leitura das mensagens deve ser exibido e não
    pode ser desativado.
13. Os usuários comuns não podem criar grupos.
14. A equipe de TI pode criar grupos destinados a níveis hierárquicos
    específicos, como diretores.

## 5. Validação e tomada de decisão

  -----------------------------------------------------------------------
  Tipo de decisão                     Responsável identificado
  ----------------------------------- -----------------------------------
  Regras de negócio e funcionalidades Cliente (professor)
  esperadas                           

  Administração do sistema            Equipe de TI

  Criação, gerenciamento e            Equipe de TI
  desativação de usuários             

  Criação e gerenciamento de grupos   Equipe de TI

  Alteração e redefinição de senhas   Equipe de TI

  Implementação das funcionalidades   Equipe de desenvolvimento
  aprovadas                           
  -----------------------------------------------------------------------

As funcionalidades devem seguir as regras e decisões validadas pelo
cliente. A equipe de desenvolvimento não deve incluir funcionalidades
que não tenham sido aprovadas.

## 6. Funcionalidades fora do escopo definido

Com base nas restrições informadas pelo cliente, não devem ser
implementadas:

-   Envio de mensagens de áudio.
-   Chamadas de áudio.
-   Chamadas de vídeo.
-   Compartilhamento de arquivos Word.
-   Compartilhamento de arquivos Excel.
-   Criação de grupos por usuários comuns ou diretores.
-   Exclusão permanente de contas de usuários.
-   Alteração de senha pelo próprio usuário no aplicativo.
-   Desativação do indicador de entrega ou leitura das mensagens.
-   Comunicação entre usuários de empresas diferentes.

## 7. Pontos de atenção para implementação

Os itens abaixo são regras levantadas na entrevista, mas precisam ser
traduzidos em comportamento técnico claro durante a especificação das
funcionalidades:

-   **Horário de funcionamento:** o sistema deve respeitar a janela de
    acesso das 8h às 18h. A implementação deve definir como o bloqueio
    se comporta para sessões já iniciadas.
-   **Grupos por nível hierárquico:** a equipe de TI é responsável pela
    criação. A composição e as regras de acesso de cada grupo devem
    respeitar as definições do cliente.
-   **Isolamento entre empresas:** a separação dos dados deve ser
    garantida em todas as operações, não apenas na interface.

Esses pontos não autorizam a criação de novas funcionalidades; servem
para orientar a implementação correta das regras já estabelecidas.

## 8. Resultado do levantamento

A entrevista com o cliente permitiu identificar dois perfis de usuário
--- Equipe de TI e Usuário Comum ---, suas permissões e
responsabilidades, as necessidades de comunicação e as principais regras
de negócio do CallZUP.

Este documento registra o levantamento realizado para a Issue #46 e deve
ser utilizado como referência pelo Product Owner e pela equipe de
desenvolvimento. Qualquer alteração posterior nas regras ou no escopo
deverá ser validada pelo cliente e atualizada na documentação.
