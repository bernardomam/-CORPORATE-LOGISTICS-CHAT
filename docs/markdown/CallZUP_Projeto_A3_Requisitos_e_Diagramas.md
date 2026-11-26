# CallZUP Projeto A3 Requisitos e Diagramas

## 1. Tabela de Objetivo Geral

| ID | Objetivo geral |
| --- | --- |
| OG01 | Desenvolver o CallZUP, um aplicativo de comunicação corporativa para uso interno em cada empresa, permitindo a troca de mensagens de texto e o compartilhamento de arquivos PDF e imagens JPEG entre funcionários da mesma empresa, com gerenciamento centralizado pela equipe de TI, controle de acesso, indicadores obrigatórios de entrega e leitura e isolamento dos dados entre empresas. O acesso será permitido das 8h às 18h, com bloqueio de novos logins fora desse período e encerramento automático da sessão às 18h. |

## 2. Tabela de Objetivos Específicos

| ID | Objetivo específico |
| --- | --- |
| OE01 | Permitir comunicação por mensagens de texto entre usuários da mesma empresa. |
| OE02 | Permitir o compartilhamento de documentos PDF e imagens JPEG, recusando formatos não permitidos, incluindo Word e Excel. |
| OE03 | Exibir obrigatoriamente os estados de entrega e leitura das mensagens, sem opção para o usuário desativá-los. |
| OE04 | Permitir que a equipe de TI cadastre, consulte, gerencie e desative contas de usuários. |
| OE05 | Permitir que somente a equipe de TI crie e gerencie grupos, inclusive grupos destinados a níveis hierárquicos específicos. |
| OE06 | Permitir que somente a equipe de TI altere ou redefina senhas e envie os dados de acesso por e-mail. |
| OE07 | Disponibilizar inicialmente o sistema aos usuários do nível operacional, mantendo apenas os perfis funcionais Equipe de TI e Usuário Comum. |
| OE08 | Impedir o acesso e a troca de informações entre empresas diferentes, mantendo ambientes e dados isolados. |
| OE09 | Restringir a autenticação ao período entre 8h e 18h e encerrar automaticamente a sessão às 18h. |
| OE10 | Oferecer uma interface adequada à comunicação corporativa, com identidade visual e design system definidos pela equipe. |
| OE11 | Hospedar a aplicação na plataforma Vercel. |

## 3. Tabela de Requisitos Funcionais (RF)

| ID | Requisito funcional |
| --- | --- |
| RF01 | O sistema deverá permitir que a equipe de TI cadastre novos usuários vinculados à empresa correspondente. |
| RF02 | O sistema deverá permitir que a equipe de TI consulte e gerencie os usuários cadastrados. |
| RF03 | O sistema deverá permitir que somente a equipe de TI desative contas de usuários, sem exclusão definitiva. |
| RF04 | O sistema deverá permitir que somente a equipe de TI crie, edite e gerencie grupos. |
| RF05 | O sistema deverá permitir que a equipe de TI associe usuários a grupos, inclusive grupos destinados a níveis hierárquicos específicos. |
| RF06 | O sistema deverá permitir que usuários comuns enviem e recebam mensagens de texto dentro do ambiente da própria empresa. |
| RF07 | O sistema deverá permitir o envio e recebimento de arquivos PDF. |
| RF08 | O sistema deverá permitir o envio e recebimento de imagens no formato JPEG. |
| RF09 | O sistema deverá validar o tipo de arquivo e impedir o compartilhamento de formatos não permitidos, incluindo Word e Excel. |
| RF10 | O sistema deverá exibir o status de entrega das mensagens. |
| RF11 | O sistema deverá exibir o status de leitura/visualização das mensagens. |
| RF12 | O sistema deverá manter os indicadores de entrega e leitura ativos, sem permitir sua desativação pelo usuário. |
| RF13 | O sistema deverá permitir que somente a equipe de TI altere ou redefina a senha de um usuário. |
| RF14 | O sistema deverá permitir que a equipe de TI envie os dados de acesso ao usuário por e-mail. |
| RF15 | O sistema deverá impedir a autenticação antes das 8h e após as 18h, conforme o horário configurado. |
| RF16 | O sistema deverá encerrar automaticamente as sessões autenticadas ao atingir as 18h. |
| RF17 | O sistema deverá autenticar e autorizar usuários considerando a empresa à qual pertencem, impedindo acesso a dados e conversas de outras empresas. |

## 4. Tabela de Requisitos Não Funcionais (RNF)

| ID | Requisito não funcional |
| --- | --- |
| RNF01 | Isolamento entre empresas: dados, usuários, grupos, mensagens e arquivos de uma empresa não poderão ser acessados por usuários de outra empresa. |
| RNF02 | Controle de privilégios: funções administrativas de cadastro e gerenciamento de usuários e grupos serão exclusivas da Equipe de TI. |
| RNF03 | Janela de utilização: a autenticação deverá respeitar o horário permitido, das 8h às 18h, conforme configuração do sistema. |
| RNF04 | Encerramento de sessão: sessões autenticadas deverão ser encerradas automaticamente às 18h. |
| RNF05 | Formatos de arquivo: o compartilhamento deverá aceitar somente PDF e JPEG, bloqueando formatos não autorizados. |
| RNF06 | Indicadores de mensagem: os status de entrega e leitura deverão permanecer ativos e não poderão ser desabilitados pelos usuários. |
| RNF07 | Escopo funcional: o sistema não deverá oferecer mensagens de áudio, chamadas de áudio ou chamadas de vídeo. |
| RNF08 | Ciclo de vida de contas: contas de usuários deverão ser desativadas, sem exclusão definitiva. |
| RNF09 | Hospedagem: a aplicação deverá ser hospedada na plataforma Vercel. |
| RNF10 | Usabilidade: a interface deverá facilitar a comunicação corporativa; a escolha do design system, identidade visual, cores e componentes ficará a cargo da equipe. |

## 5. Diagrama de Casos de Uso

O diagrama apresenta os dois perfis funcionais do sistema. A Equipe de TI realiza as operações administrativas; o Usuário Comum utiliza os recursos de comunicação. As regras de isolamento por empresa e de horário aplicam-se transversalmente.

## 6. Diagrama de Atividades

O fluxo representa a tentativa de autenticação, a verificação do horário permitido e a validação das credenciais e do vínculo com a empresa. O sistema nega o login fora do horário e não permite acesso com credenciais inválidas.

## 7. Diagrama de Sequência

O diagrama demonstra a interação entre o usuário, a interface, o serviço de autenticação e a base de dados durante o login. A checagem de horário ocorre antes da conclusão da autenticação.

## 8. Diagrama de Máquina de Estados

O modelo representa os estados principais da sessão: desconectado, aguardando credenciais, acesso negado, autenticado e sessão encerrada automaticamente às 18h.

---

> **Nota de conversão:** este arquivo Markdown preserva o conteúdo textual e as tabelas do documento Word. Elementos gráficos incorporados (diagramas/imagens) podem não ser reproduzidos integralmente nesta conversão; consulte o DOCX original para a apresentação visual.
