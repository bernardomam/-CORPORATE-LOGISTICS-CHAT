# Issue #70 — Guia de conteúdo e microcopy do CallZUP

**Status:** Entrega de UX Writing concluída e preparada para implementação.  
**Escopo:** conteúdo textual da interface, mensagens de sistema e padrões de comunicação.

## 1. Objetivo

Estabelecer uma linguagem clara, objetiva e consistente para o CallZUP, cobrindo os principais fluxos de comunicação e operação logística. Este guia é a referência de texto para design e frontend.

## 2. Tom de voz

- **Claro:** usar palavras comuns e frases curtas.
- **Objetivo:** informar primeiro o que aconteceu; depois, quando necessário, explicar a ação.
- **Profissional e humano:** manter respeito e cordialidade sem informalidade excessiva.
- **Orientativo:** erros devem indicar como a pessoa pode prosseguir.
- **Consistente:** a mesma ação ou entidade deve usar o mesmo termo em toda a interface.
- **Neutro:** evitar culpabilizar o usuário ou usar alarmismo.

### Regras de escrita

1. Preferir voz ativa: “Não foi possível enviar a mensagem”.
2. Usar verbos específicos em botões: “Salvar alterações”, “Enviar mensagem”.
3. Não usar “Clique aqui”; nomear a ação.
4. Não exibir códigos técnicos, stack traces ou detalhes internos ao usuário.
5. Informar consequências antes de ações destrutivas.
6. Usar pontuação consistente; botões não levam ponto final.
7. Não depender apenas de cor ou ícone para comunicar status.
8. Não prometer prazo de resolução que o sistema não garante.

## 3. Vocabulário oficial

| Termo | Uso recomendado | Evitar como sinônimo |
|---|---|---|
| Conversa | Espaço de troca de mensagens | Chat, sala (alternados sem critério) |
| Mensagem | Conteúdo enviado em uma conversa | Recado |
| Grupo | Conversa com vários participantes, quando aplicável | Equipe (se forem conceitos diferentes) |
| Equipe | Conjunto de colaboradores de uma área | Grupo, setor (sem equivalência definida) |
| Unidade | Local ou unidade operacional | Filial, base (sem equivalência definida) |
| Ocorrência | Registro de situação operacional que exige acompanhamento | Problema, chamado (quando não forem equivalentes) |
| Solicitação | Pedido de ação ou atendimento | Ocorrência (não intercambiar) |
| Anexo | Arquivo associado a uma mensagem ou registro | Documento (quando puder ser qualquer tipo de arquivo) |
| Responsável | Pessoa designada para acompanhar uma ocorrência | Dono |
| Status | Situação atual de um registro | Estado (manter “status” na interface) |

## 4. Navegação, ações e botões

| Contexto | Texto recomendado |
|---|---|
| Criar conversa | Nova conversa |
| Abrir conversa | Abrir conversa |
| Enviar mensagem | Enviar |
| Editar mensagem (se permitido) | Editar mensagem |
| Responder | Responder |
| Buscar | Buscar |
| Limpar busca | Limpar busca |
| Criar grupo (se disponível) | Criar grupo |
| Adicionar participante | Adicionar participante |
| Ver participantes | Ver participantes |
| Anexar arquivo | Anexar arquivo |
| Baixar arquivo | Baixar arquivo |
| Ver ocorrência | Ver ocorrência |
| Criar ocorrência | Nova ocorrência |
| Atualizar ocorrência | Atualizar ocorrência |
| Salvar formulário | Salvar alterações |
| Descartar edição | Descartar alterações |
| Confirmar ação | Confirmar |
| Cancelar ação | Cancelar |
| Fechar janela | Fechar |
| Sair da conta | Sair |

## 5. Campos, rótulos e textos de ajuda

| Campo | Rótulo | Placeholder / ajuda |
|---|---|---|
| Busca geral | Buscar | Buscar conversas e mensagens |
| Busca na conversa | Buscar nesta conversa | Digite uma palavra ou expressão |
| Nova conversa | Nome da conversa | Informe um nome para identificar a conversa |
| Participantes | Participantes | Adicione pessoas à conversa |
| Mensagem | Mensagem | Escreva uma mensagem |
| Assunto da ocorrência | Assunto | Resuma o que aconteceu |
| Descrição | Descrição | Descreva a situação com as informações relevantes |
| Unidade | Unidade | Selecione a unidade relacionada |
| Responsável | Responsável | Selecione quem acompanhará a ocorrência |
| Prioridade | Prioridade | Selecione o nível de prioridade |
| Comentário | Comentário | Adicione uma atualização |
| Nome do perfil | Nome | Informe seu nome |

Não usar placeholder como substituto do rótulo. Campos obrigatórios devem ser identificados visualmente e programaticamente.

## 6. Mensagens de sucesso

| Situação | Mensagem |
|---|---|
| Mensagem enviada | Mensagem enviada. |
| Conversa criada | Conversa criada. |
| Alterações salvas | Alterações salvas. |
| Participante adicionado | Participante adicionado à conversa. |
| Arquivo anexado | Arquivo anexado. |
| Arquivo baixado | Download iniciado. |
| Ocorrência criada | Ocorrência criada. |
| Ocorrência atualizada | Ocorrência atualizada. |
| Comentário registrado | Atualização registrada. |
| Preferências salvas | Preferências atualizadas. |

## 7. Erros e recuperação

| Situação | Mensagem | Ação oferecida |
|---|---|---|
| Falha ao enviar mensagem | Não foi possível enviar a mensagem. Verifique sua conexão e tente novamente. | Tentar novamente |
| Sem conexão | Você está sem conexão. Verifique sua rede para continuar. | Tentar novamente |
| Erro inesperado | Não foi possível concluir esta ação. Tente novamente. | Tentar novamente |
| Acesso negado | Você não tem permissão para acessar este conteúdo. | Voltar |
| Sessão expirada | Sua sessão expirou por segurança. Entre novamente para continuar. | Entrar novamente |
| Campo obrigatório | Preencha este campo para continuar. | Foco no campo |
| Formato inválido | Confira o formato informado e tente novamente. | Corrigir campo |
| Busca sem resultados | Nenhum resultado encontrado. Tente outros termos. | Limpar busca |
| Conversa indisponível | Esta conversa não está disponível ou você não tem acesso a ela. | Voltar |
| Falha ao carregar | Não foi possível carregar as informações. | Tentar novamente |
| Falha ao salvar | Não foi possível salvar as alterações. Suas informações continuam disponíveis nesta tela. | Tentar novamente |
| Arquivo não permitido | Este tipo de arquivo não é permitido. Escolha outro arquivo. | Selecionar arquivo |
| Arquivo excede limite | O arquivo é maior do que o permitido. Escolha um arquivo menor. | Selecionar arquivo |
| Upload interrompido | O envio do arquivo foi interrompido. Tente novamente. | Tentar novamente |
| Permissão insuficiente para anexo | Você não tem permissão para anexar arquivos nesta conversa. | Fechar |
| Ocorrência não encontrada | Não encontramos esta ocorrência. Atualize a lista e tente novamente. | Atualizar lista |

**Regra:** só afirmar que os dados foram preservados quando a aplicação realmente mantiver o conteúdo localmente. Se isso não for garantido, usar: “Não foi possível salvar as alterações. Tente novamente.”

## 8. Estados vazios

| Tela / contexto | Título | Descrição | Ação |
|---|---|---|---|
| Lista de conversas vazia | Nenhuma conversa por aqui | Quando você participar de uma conversa, ela aparecerá nesta lista. | Nova conversa (se permitido) |
| Conversa sem mensagens | Esta conversa ainda não tem mensagens | Envie a primeira mensagem para iniciar a comunicação. | Escrever mensagem |
| Busca sem resultado | Nenhum resultado encontrado | Tente buscar por outro termo. | Limpar busca |
| Anexos vazios | Nenhum arquivo compartilhado | Os arquivos enviados nesta conversa aparecerão aqui. | Anexar arquivo (se permitido) |
| Ocorrências vazias | Nenhuma ocorrência encontrada | As ocorrências disponíveis para você aparecerão aqui. | Limpar filtros |
| Notificações vazias | Tudo em dia | Você não tem notificações no momento. | — |
| Filtro sem resultado | Nenhum item corresponde aos filtros | Ajuste ou remova os filtros para ver mais resultados. | Limpar filtros |

## 9. Carregamento e processamento

- Carregamento de conversas: “Carregando conversas…”
- Carregamento de mensagens: “Carregando mensagens…”
- Busca em andamento: “Buscando…”
- Envio em andamento: “Enviando…”
- Upload em andamento: “Enviando arquivo…”
- Salvamento em andamento: “Salvando…”
- Atualização em andamento: “Atualizando…”

Durante o processamento, evitar submissões duplicadas e indicar visualmente que a ação está em andamento. Não usar mensagens de sucesso antes da confirmação do sistema.

## 10. Confirmações e ações sensíveis

| Ação | Título | Texto | Botões |
|---|---|---|---|
| Sair da conta | Sair da conta? | Você precisará entrar novamente para acessar o CallZUP. | Continuar na conta / Sair |
| Descartar edição | Descartar alterações? | As alterações que ainda não foram salvas serão perdidas. | Continuar editando / Descartar |
| Remover participante | Remover participante? | A pessoa deixará de participar desta conversa. | Cancelar / Remover |
| Excluir arquivo (se permitido) | Excluir arquivo? | Esta ação pode impedir que outras pessoas acessem o arquivo. | Cancelar / Excluir |
| Encerrar ocorrência (se permitido) | Encerrar ocorrência? | A ocorrência será marcada como encerrada. | Cancelar / Encerrar |

Ações irreversíveis devem usar confirmação explícita e destacar a ação principal sem induzir erro. Exibir somente ações que existam e sejam autorizadas no produto.

## 11. Ocorrências operacionais

| Contexto | Texto |
|---|---|
| Status inicial | Aberta |
| Em acompanhamento | Em andamento |
| Aguardando informação | Aguardando informação |
| Concluída | Concluída |
| Encerrada | Encerrada |
| Prioridade baixa | Baixa |
| Prioridade média | Média |
| Prioridade alta | Alta |
| Prioridade urgente | Urgente |
| Sem responsável | Sem responsável |
| Histórico vazio | Ainda não há atualizações nesta ocorrência. |
| Nova atualização | Registrar atualização |
| Campo de atualização | O que mudou? |
| Confirmação de atualização | Atualização registrada na ocorrência. |

Os status e níveis de prioridade devem corresponder aos valores efetivamente adotados pela regra de negócio. Não apresentar status como ação se o usuário não tiver permissão para alterá-lo.

## 12. Notificações

| Evento | Título | Mensagem |
|---|---|---|
| Nova mensagem | Nova mensagem | Você recebeu uma mensagem em {nome_conversa}. |
| Menção (se disponível) | Você foi mencionado | {nome_remetente} mencionou você em uma conversa. |
| Novo anexo | Novo arquivo compartilhado | Um arquivo foi compartilhado em {nome_conversa}. |
| Ocorrência atribuída | Ocorrência atribuída | A ocorrência {identificador} foi atribuída a você. |
| Ocorrência atualizada | Ocorrência atualizada | Houve uma atualização na ocorrência {identificador}. |
| Alteração de status | Status atualizado | A ocorrência {identificador} agora está como {status}. |

Placeholders devem ser substituídos por valores reais e escapados adequadamente. Não exibir informação de ocorrência ou conversa para quem não tem autorização de acesso.

## 13. Busca

- Campo vazio: “Digite algo para pesquisar.”
- Busca em andamento: “Buscando…”
- Sem resultado: “Nenhum resultado encontrado para ‘{termo}’.”
- Falha: “Não foi possível concluir a busca. Tente novamente.”
- Resultado: “{quantidade} resultados encontrados.”
- Filtro ativo: “Filtros aplicados.”
- Limpar filtros: “Limpar filtros.”

Não indicar quantidade se ela não estiver disponível ou atualizada. Destacar o termo encontrado sem alterar o conteúdo original da mensagem.

## 14. Anexos

- Seleção: “Selecionar arquivo”.
- Arrastar: “Arraste um arquivo para anexá-lo ou selecione no dispositivo.”
- Upload: “Enviando arquivo…”
- Concluído: “Arquivo anexado.”
- Falha: “Não foi possível enviar o arquivo. Tente novamente.”
- Tipo inválido: “Este tipo de arquivo não é permitido.”
- Tamanho excedido: “O arquivo é maior do que o permitido.”
- Remoção: “Remover anexo”.

A interface deve informar os formatos e o tamanho máximo aceitos com valores reais definidos pelo produto; não inventar limites no texto.

## 15. Acessibilidade e consistência

- Mensagens importantes devem ser anunciadas por tecnologias assistivas quando surgirem dinamicamente.
- Erros devem ser associados ao campo correspondente e não comunicados apenas por cor.
- Ícones de ação devem ter nome acessível.
- Manter linguagem simples e evitar abreviações internas.
- Datas, horários e números devem seguir a configuração regional da aplicação.
- Evitar textos que dependam exclusivamente de posição, como “clique no botão verde”.
- Garantir contraste e legibilidade é responsabilidade visual complementar ao conteúdo.

## 16. Regras para implementação

1. Centralizar textos reutilizados em um catálogo de mensagens, evitando cópias divergentes.
2. Usar identificadores estáveis para cada mensagem.
3. Separar texto de interface de logs técnicos.
4. Tratar variáveis como `{nome_conversa}`, `{identificador}` e `{status}` como placeholders documentados.
5. Não concatenar frases de forma que gerem concordância incorreta; usar mensagens completas quando a gramática variar.
6. Não exibir ação que o usuário não possa executar.
7. Exibir sucesso apenas após resposta positiva da operação.
8. Permitir nova tentativa quando a operação for recuperável.
9. Evitar duplicar alertas para o mesmo evento.
10. Não inserir dados pessoais ou conteúdo sensível em mensagens de erro.

## 17. Checklist de entrega

- [x] Guia de tom de voz publicado.
- [x] Vocabulário consistente definido.
- [x] Microcopy de navegação, botões e campos documentada.
- [x] Mensagens de sucesso, erro e recuperação documentadas.
- [x] Estados vazios e de carregamento documentados.
- [x] Confirmações de ações sensíveis documentadas.
- [x] Textos de ocorrências, notificações, busca e anexos documentados.
- [x] Recomendações de acessibilidade e implementação registradas.
- [x] Conteúdo organizado para consulta pelo frontend.

## 18. Decisões e limites

Este guia define a proposta de conteúdo UX/UI para os fluxos descritos. Textos condicionais — marcados como “se disponível” ou “se permitido” — só devem ser usados se a funcionalidade correspondente existir e estiver habilitada. Limites de upload, estados de negócio e permissões devem refletir os valores reais implementados, sem criar regras técnicas por meio de microcopy.

**Resultado:** pacote de microcopy documentado e pronto para ser consumido pelo design e frontend.