# Central de notificações e preferências de alertas

## 1. Objetivo

Definir como os colaboradores recebem, visualizam e organizam notificações relacionadas às atividades do sistema.

A central deve permitir que o usuário identifique rapidamente acontecimentos importantes e acesse a conversa ou ocorrência relacionada.

## 2. Estrutura da central de notificações

Cada notificação deve apresentar, sempre que essas informações estiverem disponíveis:

- **Título:** resumo do acontecimento.
- **Descrição:** explicação curta do que aconteceu.
- **Tipo:** categoria da notificação.
- **Origem:** conversa, ocorrência ou área do sistema relacionada.
- **Data e horário:** momento em que a notificação foi gerada.
- **Ação:** possibilidade de abrir o conteúdo relacionado.

## 3. Categorias de notificações

As categorias abaixo são uma proposta inicial e precisam ser confirmadas com o Product Owner:

- Novas mensagens.
- Atualizações de ocorrências.
- Alterações de status.
- Menções ou direcionamentos ao colaborador.
- Outros avisos operacionais aprovados pelo produto.

A interface não deve apresentar categorias ou alertas que ainda não tenham sido aprovados pela equipe responsável.

## 4. Estados das notificações

### Não lida
A notificação deve possuir um indicador visual que permita identificar que ainda não foi visualizada.

### Lida
Após a visualização ou ação definida pelo produto, a notificação deve apresentar um estado visual diferente.

### Central vazia
Quando não houver notificações, apresentar uma mensagem amigável:

"Você não tem notificações no momento."

### Carregamento
Durante a busca das notificações, apresentar um indicador de carregamento.

### Falha
Se não for possível carregar as notificações, informar:

"Não foi possível carregar suas notificações. Tente novamente."

Disponibilizar uma ação para tentar novamente, quando aplicável.

## 5. Organização e navegação

A central deve permitir:

- Identificar notificações recentes.
- Diferenciar notificações lidas e não lidas.
- Visualizar o tipo e a origem do aviso.
- Abrir o conteúdo relacionado à notificação.
- Identificar quando a notificação aconteceu.

O agrupamento por data pode ser utilizado para facilitar a leitura, por exemplo:

- Hoje.
- Ontem.
- Anteriores.

A possibilidade de filtrar, marcar todas como lidas ou excluir notificações depende da confirmação das regras do produto.

## 6. Preferências de alertas

A área de preferências deve apresentar somente opções de notificação aprovadas pelo Product Owner e pelo Tech Lead.

A proposta é organizar as preferências por categoria e por canal, caso esses canais sejam suportados pelo sistema.

Exemplos de canais que podem ser avaliados:
- Notificações dentro da plataforma.
- E-mail.
- Notificações do navegador.

Não considerar esses canais como funcionalidades confirmadas. Sua disponibilidade depende da arquitetura e das decisões do projeto.

## 7. Diretrizes de UX/UI

- Destacar notificações não lidas sem prejudicar a leitura.
- Utilizar títulos curtos e descrições objetivas.
- Facilitar o acesso ao conteúdo relacionado.
- Manter consistência visual com o restante do sistema.
- Evitar excesso de elementos visuais.
- Garantir boa experiência em telas menores.
- Não depender somente de cores para indicar estados.
- Apresentar mensagens claras em situações de erro ou ausência de dados.

## 8. Critérios de validação

- [ ] Cada notificação apresenta tipo, origem e horário, quando disponíveis.
- [ ] Os estados lida e não lida estão diferenciados.
- [ ] A navegação para o conteúdo relacionado está especificada.
- [ ] Os estados vazio, carregamento e falha estão documentados.
- [ ] O agrupamento das notificações está definido.
- [ ] As preferências consideram somente canais aprovados.
- [ ] A experiência responsiva foi considerada.
- [ ] As regras foram revisadas com o Product Owner e o Tech Lead.

## 9. Dependências e pontos pendentes

Precisam de confirmação:

- Quais eventos realmente geram notificações.
- Quais categorias serão disponibilizadas no produto.
- Quais canais de notificação serão implementados.
- Como funciona a marcação de notificações como lidas.
- Se haverá filtros, exclusão ou agrupamento.
- Quais permissões cada perfil de usuário possui.

## 10. Resultado esperado

Uma especificação inicial da central de notificações e das preferências de alertas, preparada para orientar a criação das telas e o desenvolvimento frontend, sujeita à validação das regras definitivas do produto.
