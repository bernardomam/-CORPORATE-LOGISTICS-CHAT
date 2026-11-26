# Issue #72 — Central de notificações e preferências de alertas

**Status:** Especificação UX/UI concluída para prototipação e implementação.  
**Objetivo:** permitir que colaboradores identifiquem eventos relevantes, entendam sua origem, acessem o contexto relacionado e controlem preferências sem perder alertas importantes.

## 1. Princípios da experiência

- Priorizar informação útil e acionável; evitar notificações redundantes.
- Diferenciar visualmente itens lidos e não lidos, sem depender apenas de cor.
- Mostrar origem, horário e contexto sempre que disponíveis.
- Abrir somente recursos aos quais o usuário tenha permissão.
- Preferências devem refletir canais efetivamente suportados.
- Ações de leitura devem ter comportamento previsível e feedback imediato.
- Não transformar cada mensagem em alerta intrusivo por padrão.

## 2. Arquitetura de informação

A central terá:
1. Cabeçalho “Notificações” e indicador de não lidas.
2. Filtro de visualização: “Todas” e “Não lidas”.
3. Ação “Marcar todas como lidas”, habilitada apenas quando houver itens não lidos.
4. Lista agrupada por período: “Hoje”, “Ontem” e “Anteriores”.
5. Cada item com título, resumo, categoria, origem, horário e estado de leitura.
6. Acesso às preferências por ação “Configurar notificações”.

Não incluir exclusão em massa na primeira versão proposta. Evita remoção acidental de informações relevantes. Se houver necessidade futura, tratar como ação separada com confirmação.

## 3. Modelo de conteúdo de uma notificação

| Elemento | Regra |
|---|---|
| Título | Frase curta que identifica o evento |
| Descrição | Complemento de contexto, preferencialmente uma linha |
| Categoria | Mensagem, menção, ocorrência ou solicitação |
| Origem | Nome da conversa ou identificador/título da ocorrência |
| Horário | Hora para eventos de hoje; data para anteriores |
| Estado | Lida ou não lida |
| Ação | Abrir conversa, ocorrência ou solicitação, conforme permissão |

### Exemplos de conteúdo

| Evento | Título | Descrição | Destino |
|---|---|---|---|
| Nova mensagem | Nova mensagem | {remetente} enviou uma mensagem em {conversa}. | Conversa |
| Menção | Você foi mencionado | {remetente} mencionou você em {conversa}. | Mensagem na conversa |
| Atualização de ocorrência | Ocorrência atualizada | A ocorrência {codigo} recebeu uma atualização. | Detalhe da ocorrência |
| Mudança de status | Status alterado | A ocorrência {codigo} agora está {status}. | Detalhe da ocorrência |
| Solicitação atribuída | Nova solicitação atribuída | Uma solicitação foi atribuída a você. | Detalhe da solicitação |

Só gerar categorias e eventos que façam parte das funcionalidades habilitadas. A notificação não deve incluir conteúdo sensível desnecessário.

## 4. Comportamentos da central

### Abrir uma notificação
1. Usuário seleciona o item.
2. Sistema registra como lida, se essa for a regra de leitura adotada.
3. Sistema verifica autorização do usuário para o destino.
4. Abre o recurso relacionado.
5. Se o recurso não estiver mais disponível, exibe: “Este conteúdo não está disponível ou você não tem acesso a ele.”

### Marcar como lida
- Disponibilizar ação individual no item.
- Atualizar o indicador de não lidas após confirmação do sistema.
- Não remover o item da lista “Todas”.
- Se a atualização falhar: “Não foi possível atualizar a notificação. Tente novamente.”

### Marcar todas como lidas
- Ação no cabeçalho.
- Exibir confirmação leve: “Marcar todas as notificações como lidas?”
- Botões: “Cancelar” e “Marcar como lidas”.
- Atualizar a lista somente após resposta positiva do sistema.
- Em falha: “Não foi possível atualizar suas notificações. Tente novamente.”

### Filtros
- “Todas”: exibe notificações disponíveis, lidas e não lidas.
- “Não lidas”: exibe apenas itens pendentes.
- Ao trocar filtro, preservar posição de rolagem quando possível.
- Filtro sem resultados: “Nenhuma notificação encontrada neste filtro.”

## 5. Estados da central

| Estado | Título / mensagem | Comportamento |
|---|---|---|
| Carregando | Carregando notificações… | Skeleton ou indicador com rótulo acessível |
| Com notificações | Notificações | Exibir lista e agrupamentos |
| Sem notificações | Tudo em dia | Você não tem notificações no momento. |
| Sem não lidas | Nenhuma notificação não lida | Exibir orientação para consultar “Todas” |
| Falha ao carregar | Não foi possível carregar suas notificações. | Ação “Tentar novamente” |
| Falha ao marcar lida | Não foi possível atualizar a notificação. | Manter estado anterior e permitir nova tentativa |
| Destino indisponível | Este conteúdo não está disponível ou você não tem acesso a ele. | Voltar à central |
| Lista paginada | Carregando mais notificações… | Preservar itens já carregados |

## 6. Preferências de notificações

### Estrutura da tela

**Título:** Preferências de notificações  
**Descrição:** Escolha quais atividades devem gerar notificações para você.

Categorias propostas:

| Categoria | Descrição | Padrão proposto |
|---|---|---|
| Mensagens | Novas mensagens nas conversas das quais participo | Ativada |
| Menções | Quando alguém mencionar meu nome ou perfil | Ativada |
| Ocorrências | Atualizações de ocorrências que posso acompanhar | Ativada |
| Solicitações | Alterações em solicitações relacionadas a mim | Ativada, se houver esse módulo |

O padrão acima é uma proposta de UX. Se o sistema oferecer apenas notificações internas, não mostrar seletores de canal externo.

### Canais

- **Dentro do CallZUP:** canal principal da central.
- **E-mail:** exibir somente se houver envio transacional implementado e preferência configurável.
- **Navegador:** exibir somente se houver suporte a permissões e notificações web push.
- Não apresentar SMS, WhatsApp ou aplicativo móvel como opções sem suporte real.

### Regras de preferência
- Separar preferências por categoria e canal quando ambos existirem.
- Desabilitar controles indisponíveis com explicação, ou ocultá-los até que o canal exista.
- Salvar alterações com feedback “Preferências atualizadas.”
- Em falha, manter o valor anterior e mostrar “Não foi possível salvar suas preferências. Tente novamente.”
- Não permitir desligar alertas obrigatórios de segurança, caso existam; identificá-los como obrigatórios.
- Mudanças devem afetar notificações futuras, sem apagar histórico existente.

## 7. Wireframes textuais

### Tela A — Central

```text
┌──────────────────────────────────────────────────────────────┐
│ Notificações                                  [Preferências]  │
│ Você tem 3 notificações não lidas. [Marcar todas como lidas]  │
│                                                              │
│ [Todas] [Não lidas]                                           │
│                                                              │
│ HOJE                                                         │
│ ● Nova mensagem                         10:42                │
│   Ana enviou uma mensagem em Operação Salvador              │
│   Operação Salvador                                  [Abrir] │
│                                                              │
│ ● Você foi mencionado                    09:18               │
│   Carlos mencionou você em Expedição                         │
│   Expedição                                           [Abrir] │
│                                                              │
│ ONTEM                                                        │
│ ○ Ocorrência atualizada                  16:30               │
│   A ocorrência OC-204 recebeu uma atualização.               │
│   OC-204                                             [Abrir] │
└──────────────────────────────────────────────────────────────┘
```

Legenda: ● não lida; ○ lida. O estado também deve ser comunicado por texto acessível.

### Tela B — Preferências

```text
┌──────────────────────────────────────────────────────────────┐
│ Preferências de notificações                                 │
│ Escolha quais atividades devem gerar alertas para você.      │
│                                                              │
│ ATIVIDADES                                                   │
│ Mensagens             Novas mensagens nas suas conversas  [✓]│
│ Menções               Quando alguém mencionar você        [✓]│
│ Ocorrências           Atualizações que você acompanha     [✓]│
│ Solicitações          Atualizações relacionadas a você    [✓]│
│                                                              │
│ CANAIS DISPONÍVEIS                                           │
│ Dentro do CallZUP                                         [✓]│
│ E-mail                Disponível somente se habilitado    [ ]│
│ Navegador             Disponível somente se habilitado    [ ]│
│                                                              │
│                                  [Cancelar] [Salvar]         │
└──────────────────────────────────────────────────────────────┘
```

Os canais condicionais só devem aparecer quando suportados. Os controles demonstrados são ilustrativos, não indicam integração ativa.

## 8. Responsividade

### Desktop
- Lista em coluna principal com cabeçalho e filtros no topo.
- Preferências em página própria ou painel lateral amplo.
- Manter data e horário alinhados sem comprimir a descrição.

### Tablet
- Reduzir metadados secundários antes de reduzir a legibilidade.
- Preferências em uma coluna.
- Alvos de toque confortáveis.

### Celular
- Lista em uma coluna, com título e descrição em linhas separadas.
- Filtros em controles horizontais roláveis ou empilhados.
- Ação “Marcar todas como lidas” acessível sem competir com cada item.
- Preferências com controles grandes e rótulos clicáveis.
- Não depender de hover ou gestos ocultos.

## 9. Acessibilidade

- Informar “Não lida” ou “Lida” em texto acessível.
- Anunciar atualização de contagem sem mover o foco.
- Botões de ação devem ter nomes específicos.
- Filtros devem comunicar seleção atual.
- Alternância de preferência deve ter rótulo associado.
- Respeitar navegação por teclado e ordem lógica de foco.
- Não usar somente cor, posição ou ícone para indicar categoria e estado.

## 10. Regras de privacidade e autorização

- A central deve retornar apenas notificações do usuário autenticado.
- Verificar permissão novamente ao abrir o destino.
- Não incluir prévias de mensagens sensíveis na notificação quando não forem necessárias.
- Não revelar o conteúdo de uma conversa em notificações de usuários sem acesso.
- Evitar expor dados operacionais em notificações externas, especialmente na tela bloqueada.
- Preferências não substituem regras de autorização nem garantem entrega em canais externos.

## 11. Critérios de aceite UX/UI

- [x] Estrutura da central, item de notificação e metadados definidos.
- [x] Estados lida/não lida e comportamento de leitura documentados.
- [x] Agrupamento por Hoje, Ontem e Anteriores definido.
- [x] Navegação para conteúdo relacionado e falhas de destino especificadas.
- [x] Estados vazio, carregamento e erro documentados.
- [x] Preferências por categoria especificadas.
- [x] Canais condicionados à existência de suporte real.
- [x] Wireframes textuais da central e preferências incluídos.
- [x] Responsividade, acessibilidade e privacidade contempladas.
- [x] Material pronto para estimativa e prototipação visual pelo frontend/design.

## 12. Diretrizes de implementação

1. Ordenar notificações por data de criação, mais recentes primeiro.
2. Manter identificador único e estado de leitura por usuário.
3. Atualizar contagem de não lidas após operações confirmadas.
4. Aplicar paginação ou carregamento progressivo em históricos extensos.
5. Tratar falhas de carregamento e de atualização separadamente.
6. Garantir que abrir um destino respeite autorização atual.
7. Persistir preferências por usuário.
8. Não gerar notificações duplicadas para o mesmo evento de origem.
9. Não disponibilizar canais que não estejam implementados.
10. Centralizar os textos no catálogo de microcopy do documento `02-microcopy.md`.

## 13. Resultado

Especificação de UX/UI da central e preferências concluída, com arquitetura de informação, conteúdo, comportamentos, wireframes textuais, estados, regras de canal, responsividade, acessibilidade, privacidade e diretrizes para frontend.