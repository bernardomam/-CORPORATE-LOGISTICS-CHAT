# Diagramas Estruturais UML CallZUP

Diagramas Estruturais UML – CallZUP

Documento acadêmico — Modelagem estrutural do sistema

Projeto CallZUP

Novembro de 2026

## Introdução

Os diagramas estruturais da UML descrevem a organização estática de um sistema: seus elementos, responsabilidades, relações e distribuição em infraestrutura. Neste documento são apresentados o Diagrama de Classes, o Diagrama de Componentes e o Diagrama de Implantação do CallZUP, uma aplicação de comunicação corporativa destinada à troca de mensagens dentro dos limites de cada empresa.

A modelagem considera os dois perfis autorizados — Equipe de TI e Usuário Comum —, o isolamento entre empresas, as permissões administrativas e os formatos de comunicação aprovados. Também diferencia a situação técnica informada (base de frontend parcialmente simulada, servidor e conexão ao banco testados) da arquitetura de integração e implantação ainda planejada.

Nota metodológica: não foi possível confirmar, nesta consulta, o conteúdo atual dos arquivos-fonte do repositório. Assim, os diagramas representam um modelo conceitual e arquitetural derivado dos requisitos e do contexto técnico fornecidos, e não uma extração fiel do schema Prisma ou de todos os módulos já existentes. Nomes de classes e operações são propostas de modelagem; componentes explicitamente indicados como pendentes ou planejados não devem ser interpretados como implementados.

## 1. Diagrama de Classes

## Objetivo

Representar as principais entidades do domínio, seus atributos essenciais e os relacionamentos necessários à comunicação corporativa com segregação por empresa.

## Elementos representados

Empresa agrupa usuários e grupos. A multiplicidade 1 para 0..* indica que uma empresa pode possuir vários usuários e grupos, e cada usuário/grupo pertence a uma única empresa.

Usuario representa uma conta vinculada a uma empresa. O atributo perfil utiliza o enum Perfil, limitado a EQUIPE_TI ou USUARIO_COMUM. O estado da conta permite desativação sem exclusão permanente.

Grupo e ParticipacaoGrupo modelam a associação muitos-para-muitos entre usuários e grupos. A entidade associativa permite registrar a associação sem permitir que o usuário comum administre grupos.

ConversaIndividual reúne os dois participantes de uma conversa individual e suas mensagens. Mensagem registra remetente, conteúdo textual e horários de envio, entrega e leitura.

Arquivo representa anexos vinculados à mensagem. TipoArquivo deve restringir-se a PDF ou JPEG; não se modelam áudio, Word, Excel ou chamadas.

## Relação com as necessidades do CallZUP

A chave de empresa deve estar presente nos vínculos relevantes e ser validada em todas as operações para impedir acesso cruzado. O perfil define autorização: somente Equipe de TI executa administração de usuários e grupos. Usuários comuns participam de conversas, mas não administram contas ou grupos. A classe Mensagem contempla os estados obrigatórios de entrega e leitura.

Observação de status: Os atributos e métodos são conceituais e deverão ser ajustados ao schema Prisma definitivo. A multiplicidade de participantes está indicada como exatamente dois na conversa individual; grupos e conversas coletivas não foram incluídos como conversas de mensagem, pois o escopo solicitado aqui enfatiza chat individual.

## 2. Diagrama de Componentes

## Objetivo

Apresentar a decomposição lógica do sistema e as dependências entre interface, API, módulos de negócio, persistência e ferramentas externas.

## Elementos representados

O frontend Next.js, TypeScript e Tailwind CSS é acessado pelo navegador. Parte das telas utiliza dados simulados e a integração com a API está em andamento.

A API Node.js/Express recebe as requisições do frontend e encaminha operações aos componentes de autenticação, usuários, grupos e comunicação.

Autenticação e autorização devem verificar identidade, perfil e contexto empresarial. Gerenciamento de usuários e grupos implementa operações restritas à Equipe de TI.

Comunicação/mensagens, anexos PDF/JPEG e confirmações de entrega/leitura são componentes funcionais previstos; suas integrações completas permanecem pendentes segundo o estado informado.

Prisma faz a mediação entre a lógica do backend e PostgreSQL no Supabase. GitHub é representado como ferramenta de versionamento, não como componente de execução.

## Relação com as necessidades do CallZUP

As interfaces entre frontend e backend devem transportar identidade e contexto da empresa; o backend deve reforçar permissões e isolamento, independentemente da interface. As operações administrativas devem ser negadas a Usuário Comum. A persistência dos estados de mensagem e das referências de anexos depende da camada de dados.

Observação de status: Servidor Express e conexão PostgreSQL/Supabase foram reportados como testados. Isso não confirma a integração completa dos módulos de autenticação, usuários, grupos, mensagens, anexos e recibos. O diagrama explicita esses componentes como estrutura lógica alvo, com pendências identificadas.

## 3. Diagrama de Implantação

## Objetivo

Mostrar os nós de execução e as conexões entre os ambientes de desenvolvimento atual e a arquitetura de implantação planejada, evitando afirmar hospedagens ainda não confirmadas.

## Elementos representados

No ambiente atual, o frontend Next.js é executado em ambiente de desenvolvimento e o backend Node.js/Express foi reportado em execução local na porta 3000.

Prisma atua como artefato/camada de acesso a dados entre o backend e o PostgreSQL hospedado no Supabase; a conexão com o banco foi testada.

Na arquitetura planejada, o navegador acessa o frontend Next.js publicado na Vercel. O frontend deverá chamar um backend Node.js/Express hospedado em provedor ainda não confirmado.

O backend planejado utiliza Prisma para acessar o PostgreSQL no Supabase. A comunicação entre nós deverá usar conexões de rede seguras, com credenciais e variáveis de ambiente protegidas.

GitHub mantém o código-fonte e pode servir como origem do processo de deploy do frontend; sua representação não implica que pipeline automatizado esteja configurado.

## Relação com as necessidades do CallZUP

A separação dos nós torna explícito que Vercel é o destino previsto para o frontend, não uma hospedagem confirmada para o backend. O banco Supabase é compartilhado pela aplicação apenas sob controles de autenticação e isolamento por empresa. A janela de acesso das 8h às 18h e o logout às 18h são regras de aplicação a serem impostas pelo backend e refletidas no frontend.

Observação de status: Backend em execução local e conexão com Supabase foram reportados como testados. A hospedagem do backend não foi confirmada. Vercel aparece apenas como destino planejado do frontend; a arquitetura de produção ainda depende de configuração e validação.

## Considerações finais

Os três diagramas se complementam ao descrever diferentes perspectivas do mesmo sistema. O Diagrama de Classes apresenta o modelo conceitual dos dados e as relações entre empresa, usuários, grupos, conversas, mensagens e arquivos. O Diagrama de Componentes organiza as responsabilidades de software e evidencia as integrações necessárias entre frontend, backend e persistência. O Diagrama de Implantação posiciona esses elementos nos ambientes de execução atuais e na topologia futura prevista.

Em conjunto, os modelos destacam os princípios centrais do CallZUP: administração exclusiva pela Equipe de TI, participação do Usuário Comum sem privilégios administrativos, segregação dos dados por empresa, comunicação limitada a texto e anexos PDF/JPEG, confirmações obrigatórias e aplicação da janela de funcionamento. Também deixam explícito que a arquitetura alvo não deve ser confundida com funcionalidades já concluídas.

A evolução destes diagramas deve acompanhar a implementação: quando o schema Prisma, os contratos da API, os mecanismos de autenticação e a topologia de hospedagem forem consolidados, a equipe deverá revisar os elementos conceituais e substituir os rótulos de planejado/pendente por descrições verificadas, quando houver evidências.

---

> **Nota de conversão:** este arquivo Markdown preserva o conteúdo textual e as tabelas do documento Word. Elementos gráficos incorporados (diagramas/imagens) podem não ser reproduzidos integralmente nesta conversão; consulte o DOCX original para a apresentação visual.
