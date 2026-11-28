# Issue #17 — Identidade visual e design system corporativo

**Projeto:** CallZUP  
**Escopo:** especificação UX/UI e critérios de aplicação para frontend  
**Referências:** [Issue #17](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/17) · [Issue #37 — implementação frontend](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/37) · [Issue #60 — detalhamento do design system](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/60)

> Este documento consolida a identidade visual e transforma as decisões do design system em padrões aplicáveis às telas essenciais. Ele é uma especificação de UX/UI, não uma declaração de que todos os componentes e telas já foram implementados ou aprovados no produto integrado.

## 1. Direção visual

A interface deve transmitir confiança, clareza operacional e eficiência para comunicação entre empresas e operadores logísticos.

Princípios:
- **Clareza antes de decoração:** destacar conversa, interlocutor, contexto operacional e próxima ação.
- **Consistência:** um mesmo componente mantém aparência e comportamento equivalentes em todas as áreas.
- **Hierarquia previsível:** navegação, conteúdo principal e ações seguem a mesma organização.
- **Feedback explícito:** toda ação relevante informa se está carregando, foi concluída ou falhou.
- **Acessibilidade:** cor nunca é o único meio de transmitir estado; foco e rótulos devem ser perceptíveis.
- **Responsividade:** adaptar a estrutura ao espaço disponível sem remover tarefas essenciais.

## 2. Tokens visuais

Os valores abaixo registram a base identificada em `app/globals.css` e a escala complementar documentada na entrega #60.

### Cores

| Token | Valor atual | Uso |
|---|---|---|
| `background` | `#F8F9FC` | Fundo geral da aplicação |
| `foreground` | `#202333` | Texto principal |
| `primary` | `#5146E5` | Ação primária, seleção e destaque |
| `primary-hover` | `#4338CA` | Hover da ação primária |
| `surface` | `#FFFFFF` | Cartões, campos e superfícies |
| `surface-secondary` | `#F1F3F9` | Áreas secundárias e fundos sutis |
| `border` | `#E7E9F0` | Divisórias e contornos |
| `muted` | `#858BA0` | Texto auxiliar, sujeito a ajuste de contraste |
| `success` | `#16A36A` | Estado positivo, acompanhado de texto/ícone |
| `danger` | `#E5484D` | Erro/ação destrutiva, acompanhado de texto/ícone |

**Atenção ao contraste:** os cálculos registrados na entrega #60 indicam que `muted`, `success` e `danger` atuais não atingem 4,5:1 sobre branco para texto normal. Para texto pequeno sobre branco, adotar como candidatos acessíveis `#526079` (auxiliar), `#08764A` (sucesso) e `#B4232B` (perigo), sujeitos à validação de todas as combinações no frontend. Não usar as cores atuais de estado como texto pequeno sem conferir contraste.

### Tipografia

- Família existente no CSS: Arial, Helvetica, sans-serif.
- Tokens Geist estão disponíveis no tema; a adoção efetiva deve ser uniforme e confirmada no frontend.
- Títulos: peso semibold/bold, com hierarquia consistente.
- Corpo: tamanho confortável e altura de linha suficiente para leitura de mensagens.
- Metadados: menores que o corpo, mas sem reduzir legibilidade ou contraste.
- Evitar usar muitas famílias, pesos ou estilos na mesma tela.

### Espaçamento, forma e elevação

| Token | Valor | Aplicação |
|---|---:|---|
| `space-1` | 4 px | Ajustes pequenos |
| `space-2` | 8 px | Elementos relacionados |
| `space-3` | 12 px | Espaçamento interno compacto |
| `space-4` | 16 px | Espaçamento padrão |
| `space-6` | 24 px | Separação entre grupos |
| `space-8` | 32 px | Separação entre seções |
| `radius-control` | 10 px | Campos e botões |
| `radius-card` | 16 px | Cartões e painéis |
| `radius-round` | 999 px | Avatares e elementos circulares |

Usar sombras discretas apenas para indicar elevação (menus, popovers e modais). Não usar sombra como substituto de borda ou hierarquia.

## 3. Componentes e padrões reutilizáveis

| Componente | Variantes e estados | Regras de uso |
|---|---|---|
| Botão | Primário, secundário, terciário/ícone; padrão, hover, foco, pressionado, desabilitado, carregando | Um botão primário por grupo de ações; rótulo começa com verbo; ícone isolado exige nome acessível |
| Campo de texto | Padrão, foco, preenchido, erro, desabilitado | Label persistente; placeholder é exemplo, não substitui label; erro associado ao campo |
| Seletor | Padrão, aberto, selecionado, foco, erro, desabilitado | Mostrar valor selecionado e permitir navegação por teclado |
| Avatar | Foto, iniciais, indisponível | Nome da pessoa disponível em texto ou nome acessível |
| Badge | Neutro, informativo, sucesso, atenção, perigo | Texto curto + cor/ícone; nunca comunicar estado somente pela cor |
| Modal | Informativo, confirmação, formulário | Título claro, ação de saída, foco inicial e retorno do foco ao elemento de origem |
| Indicador de carregamento | Inline, botão em progresso, carregamento de área | Informar o que está carregando; evitar bloquear áreas não relacionadas |
| Toast/alerta | Sucesso, informação, atenção, erro | Mensagem objetiva e ação de recuperação quando necessária |
| Menu | Item padrão, hover, foco, selecionado, desabilitado | Ordem previsível, rótulos claros e estado atual identificável |

### Regras transversais

- Alvos interativos recomendados de pelo menos 44 × 44 CSS px quando viável.
- Foco de teclado claramente visível, sem depender de hover.
- Estados desabilitados devem continuar legíveis.
- Mensagens de erro explicam o problema e como corrigir.
- Ações destrutivas exigem confirmação e identificação clara do impacto.
- Loading deve prevenir envio duplicado quando houver operação em andamento.
- Componentes devem usar os tokens, não cores e espaçamentos avulsos por tela.

## 4. Padrões para telas essenciais

### Login e autenticação
- Superfície simples, com foco no formulário e identificação do produto.
- Campos com labels persistentes, validação junto ao campo e mensagens de erro compreensíveis.
- Ação principal destacada; estados de envio e falha explícitos.
- Não revelar se uma conta existe quando isso criar risco de privacidade.

### Navegação principal
- Item ativo claramente identificado por texto/ícone e não apenas cor.
- Ícones acompanhados de rótulo acessível.
- Navegação lateral persistente em telas largas e compacta/recolhível em telas menores.
- Manter posição e contexto ao alternar entre áreas sempre que possível.

### Diretório de empresas e contatos
- Busca e filtros próximos da lista.
- Cada linha/cartão apresenta identificação primária e metadados secundários com hierarquia consistente.
- Estados de carregamento, lista vazia, sem resultados e falha devem orientar a próxima ação.
- Ações por item não podem depender exclusivamente de hover.

### Lista de conversas
- Destacar nome/empresa e contexto da conversa.
- Prévia da última mensagem e horário são secundários.
- Indicador de não lidas deve ser perceptível e textual/acessível.
- Seleção da conversa precisa ter estado visual consistente.

### Conversa e mensagens
- Cabeçalho identifica interlocutor e contexto.
- Mensagens enviadas e recebidas têm diferenciação visual suficiente sem depender só da cor.
- Horário e estado de envio/leitura são metadados legíveis.
- Compositor de mensagem permanece facilmente localizável; envio em andamento e falha são explícitos.
- Anexos, mensagens longas e nomes extensos não podem causar overflow horizontal.

### Anexos, notificações e telas administrativas
- Anexos mostram nome, tipo, tamanho e progresso/erro quando aplicável.
- Notificações distinguem lidas e não lidas e oferecem acesso ao contexto de origem.
- Telas administrativas priorizam rótulos claros, confirmação de ações sensíveis e feedback após salvar.
- Permissões são aplicadas pelo backend; a interface apenas reflete o acesso permitido.

## 5. Estados globais obrigatórios

| Estado | Padrão |
|---|---|
| Carregamento | Indicador contextual + descrição do conteúdo carregado |
| Vazio | Explicar por que não há conteúdo e indicar próxima ação, se possível |
| Sem resultados | Informar que filtros/busca não retornaram itens e permitir limpar filtros |
| Erro | Descrever falha em linguagem simples e oferecer recuperação segura |
| Sucesso | Confirmar ação realizada sem interromper o fluxo |
| Desabilitado | Indicar visualmente indisponibilidade e, quando necessário, explicar o motivo |
| Sem permissão | Explicar que o usuário não tem acesso, sem expor dados protegidos |
| Offline/instabilidade | Informar limitação e estado de operações pendentes, quando aplicável |

## 6. Acessibilidade e responsividade

- Seguir WCAG 2.2 nível AA como referência de projeto.
- Texto normal: contraste mínimo de 4,5:1; texto grande: 3:1.
- Componentes e foco: contraste perceptível; foco não pode ser removido sem alternativa.
- Suportar navegação por teclado e ordem de foco lógica.
- Usar rótulos acessíveis em controles e anúncios adequados para mensagens dinâmicas.
- Não transmitir status apenas por cor.
- Suportar reflow em 320 CSS px e zoom de 200% sem perda de conteúdo essencial.
- Celular: uma área principal por vez; lista e conversa em estados separados quando necessário.
- Tablet: navegação compacta e painéis recolhíveis.
- Desktop: navegação, lista e conversa em colunas quando houver largura suficiente.

Os breakpoints são pontos de partida; frontend deve validar com conteúdo real, zoom, orientação e teclado virtual. Ver também [08-responsividade.md](./08-responsividade.md).

## 7. Critérios de aplicação por tela

Antes de considerar uma tela alinhada ao design system, verificar:
- [ ] Usa tokens oficiais de cor, tipografia, espaçamento e forma.
- [ ] Reutiliza componentes documentados, sem recriar estilos equivalentes.
- [ ] Define estados padrão, foco, desabilitado, erro, sucesso e carregamento aplicáveis.
- [ ] Tem hierarquia visual e ação principal inequívocas.
- [ ] Estados e indicadores não dependem exclusivamente de cor.
- [ ] Funciona por teclado e apresenta foco visível.
- [ ] Mantém leitura e operação em celular, tablet e desktop.
- [ ] Foi revisada em build real com evidência (captura, viewport, versão e responsável).

## 8. Revisão e governança

| Papel | Responsabilidade na revisão |
|---|---|
| UX/UI | Manter especificação, tokens, padrões e referências |
| Frontend | Confirmar viabilidade, implementar componentes compartilhados e apontar limitações |
| Tech Lead | Revisar consistência técnica e integração com arquitetura |
| PO | Confirmar aderência aos fluxos e prioridades do produto |
| QA/SQA | Executar cenários, registrar divergências e retestar correções |

### Registro de revisão

| Revisor | Data | Escopo | Resultado/evidência |
|---|---|---|---|
| PO | Pendente | Identidade visual e fluxos essenciais | Aguardando revisão |
| Tech Lead | Pendente | Viabilidade e consistência técnica | Aguardando revisão |
| Frontend | Pendente | Componentes e aplicação nas telas | Aguardando revisão |
| QA/SQA | Pendente | Estados, acessibilidade e responsividade | Aguardando build integrado |

## 9. Relação com entregas existentes

- [60-design-system.md](./60-design-system.md): detalhamento de tokens, componentes e contraste.
- [10-design-qa-handoff.md](./10-design-qa-handoff.md): processo de handoff e revisão visual.
- [08-responsividade.md](./08-responsividade.md): comportamento responsivo e matriz de viewports.
- [Issue #37](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/37): implementação frontend dos componentes e aplicação visual.

## 10. Status honesto dos critérios da issue #17

- [x] Design system documentado e compartilhado — especificação consolidada neste arquivo e em #60.
- [x] Padrões reutilizáveis dos componentes principais descritos — variantes, estados e regras de uso especificados; implementação dos componentes pertence à #37.
- [ ] Telas essenciais seguem a identidade visual definida — depende de implementação e inspeção do produto integrado; este documento define o padrão, mas não comprova conformidade visual das telas reais.
- [ ] PO e equipe revisaram o protótipo/implementação — revisão humana formal ainda precisa ser registrada na tabela acima.

**Conclusão:** a entrega documental de UX/UI está preparada. Não marcar como concluídos os critérios que dependem de implementação frontend ou aprovação humana sem evidência correspondente. A issue #37 permanece como dependência para a implementação visual.
