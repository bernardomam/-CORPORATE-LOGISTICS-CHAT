# Experiência responsiva para celular, tablet e desktop

## 1. Objetivo e princípio
Definir uma experiência consistente para os fluxos operacionais do CallZUP em telas estreitas, médias e largas. A interface deve reorganizar áreas e controles conforme o espaço disponível, sem remover funcionalidades essenciais nem exigir rolagem horizontal da aplicação.

**Princípio:** adaptar a estrutura, não apenas reduzir os componentes. Priorizar leitura, localização rápida de conversas e execução segura das ações operacionais.

## 2. Faixas de viewport e comportamento
Os valores abaixo são **breakpoints de partida para prototipação**, não tokens já aprovados pelo produto. Frontend deve validá-los com o conteúdo real e os dispositivos-alvo.

| Faixa | Largura CSS de referência | Estrutura recomendada |
|---|---:|---|
| Celular | < 768 px | Uma área principal por vez; navegação compacta; lista e conversa em telas/estados separados |
| Tablet | 768–1023 px | Navegação compacta; lista e conversa lado a lado quando couberem com legibilidade; painel contextual recolhível |
| Desktop | >= 1024 px | Navegação, lista e conversa em colunas; detalhes em painel lateral opcional a partir de largura suficiente |

Não criar saltos de layout baseados exclusivamente no nome do dispositivo. Testar larguras intermediárias, zoom do navegador e orientação paisagem/retrato. Se o conteúdo não couber, recolher o painel secundário antes de comprimir a conversa.

## 3. Arquitetura responsiva
### 3.1 Navegação principal
- Celular: navegação compacta, com rótulos acessíveis e acesso às seções principais; evitar ocupar altura excessiva.
- Tablet: trilho lateral compacto ou menu recolhível.
- Desktop: navegação lateral persistente, com opção de recolher se a largura útil ficar limitada.
- O estado ativo deve ser identificado por texto/ícone e não somente por cor.

### 3.2 Lista de conversas
- Celular: ocupar a tela quando não houver conversa selecionada; ao abrir uma conversa, oferecer ação clara de voltar à lista.
- Tablet: coluna própria com largura mínima legível; permitir recolhimento quando o usuário precisar priorizar a conversa.
- Desktop: coluna persistente, com largura controlada e rolagem independente.
- Cada item deve preservar identificação da conversa, contexto operacional prioritário, última mensagem/horário e indicador de não lidas quando aplicável. Truncar conteúdo secundário, nunca ocultar o destino da conversa.

### 3.3 Área de mensagens
- Deve ser a área de maior prioridade visual.
- Cabeçalho, histórico e compositor devem manter hierarquia consistente.
- O histórico rola independentemente da lista e dos detalhes.
- O compositor permanece visível na base da área de conversa, respeitando teclado virtual em dispositivos móveis.
- Mensagens longas, anexos e estados de envio devem quebrar linha sem gerar scroll horizontal.
- Ao abrir mensagem antiga, preservar contexto e oferecer retorno à posição anterior quando tecnicamente viável.

### 3.4 Painel de detalhes
- Celular: abrir como tela ou painel sobreposto com fechar/voltar explícito.
- Tablet: painel lateral recolhível ou drawer; não reduzir a conversa abaixo da largura legível.
- Desktop: painel contextual opcional à direita. Se faltar espaço, recolher antes de comprometer a leitura.
- Conteúdo do painel deve ter rolagem própria e não bloquear ações essenciais da conversa.

## 4. Componentes e padrões
| Componente | Celular | Tablet | Desktop |
|---|---|---|---|
| Menus | Drawer/ação compacta | Menu compacto | Navegação persistente |
| Ações secundárias | Menu contextual com rótulos | Menu ou grupo compacto | Ações visíveis quando houver espaço |
| Diálogos | Tela cheia ou quase cheia para tarefas complexas | Modal dimensionado | Modal central dimensionado |
| Detalhes | Tela/painel sobreposto | Drawer recolhível | Coluna lateral recolhível |
| Notificações | Mensagem/toast sem cobrir compositor | Toast discreto | Toast discreto |
| Anexos | Lista vertical e ações empilhadas | Lista com metadados | Lista/tabela conforme densidade |
| Formulários | Uma coluna | Uma ou duas colunas conforme campo | Grade quando melhorar leitura |

Menus e diálogos devem ter fechamento previsível, foco visível e retorno de foco ao elemento que os abriu. Ações destrutivas ou irreversíveis precisam de confirmação e texto explícito, independentemente do tamanho da tela.

## 5. Densidade, largura e rolagem
- Usar largura máxima de leitura para blocos de texto; não esticar mensagens por toda a tela ultrawide.
- Definir larguras mínimas funcionais para lista e conversa em vez de comprimir indefinidamente.
- Preferir rolagem vertical dentro de regiões claramente delimitadas; evitar múltiplas barras concorrentes.
- Não usar rolagem horizontal para o fluxo principal. Tabelas realmente extensas podem ter contêiner próprio e alternativa em cartões/lista.
- Não esconder conteúdo essencial em hover: controles devem estar disponíveis por toque e teclado.
- Respeitar áreas seguras do dispositivo e teclado virtual.
- Em telas baixas, permitir rolagem do conteúdo e manter ações prioritárias alcançáveis.

## 6. Interação e acessibilidade
- Alvos de toque recomendados: pelo menos 44 × 44 CSS px, sempre que viável.
- Foco de teclado claramente visível; ordem de tabulação acompanha a ordem visual e lógica.
- Botões com nome acessível; ícones isolados precisam de rótulo acessível.
- Contraste adequado, estados não comunicados somente por cor e zoom de texto sem perda de conteúdo.
- Suportar reflow em largura equivalente a 320 CSS px, sem rolagem horizontal da página (exceto conteúdo bidimensional indispensável).
- Respeitar preferência por movimento reduzido.
- Não depender de hover para revelar ações.
- Garantir que drawer/modal tenha foco gerenciado, escape/fechar quando apropriado e retorno de foco.

## 7. Estados e fluxos prioritários
Validar em cada faixa: lista vazia, carregamento, erro, conversa sem mensagens, conversa longa, mensagem não lida, envio em andamento/falha, anexos, busca, notificações e painel de detalhes. Para cada fluxo, confirmar que o usuário consegue:
1. localizar e abrir uma conversa;
2. identificar interlocutor/contexto e status;
3. ler histórico e distinguir mensagens;
4. escrever e enviar mensagem;
5. acessar ações e detalhes sem perder o contexto;
6. perceber erros e recuperar-se deles.

As especificações de anexos (#74), busca (#75), notificações (#72) e ocorrências (#73) devem seguir os mesmos princípios de navegação, rolagem, foco e adaptação.

## 8. Matriz de validação
| Viewport de teste | Verificações principais |
|---|---|
| 360 × 800 | Fluxo de lista/conversa em uma coluna, compositor visível, alvos de toque, sem overflow |
| 390 × 844 | Mesmo fluxo com conteúdo realista e teclado virtual |
| 768 × 1024 | Transição para layout intermediário, lista e conversa legíveis |
| 834 × 1112 | Orientação retrato de tablet, painel contextual recolhível |
| 1024 × 768 | Colunas sem compressão excessiva e sem sobreposição |
| 1280 × 800 | Navegação, lista e conversa; detalhes opcionais |
| 1440 × 900 | Densidade e largura máxima de leitura |
| 320 CSS px / zoom 200% | Reflow, acesso às ações e ausência de perda de conteúdo |

Em cada viewport, testar também orientação, teclado, foco, rolagem, estados de erro e conteúdo com nomes/mensagens longos. Registrar capturas do navegador real após implementação; o protótipo anexado é referência visual, não evidência de validação do produto integrado.

## 9. Critérios de aceite de UX
- [x] Diretrizes para celular, tablet e desktop documentadas.
- [x] Breakpoints de referência e mudanças estruturais documentados.
- [x] Ações e informações essenciais preservadas por padrão responsivo.
- [x] Matriz de viewports e verificações definida.
- [x] Protótipo demonstrativo incluído.
- [ ] Frontend confirmar viabilidade, breakpoints finais e comportamento com componentes/dados reais.
- [ ] Capturas de telas do produto integrado anexadas após implementação.

## 10. Pendências para produto e engenharia
- Frontend: validar breakpoints, largura mínima das colunas, comportamento de teclado virtual, foco, rolagem e compatibilidade com componentes existentes.
- Produto: priorizar quais informações operacionais permanecem visíveis em cada contexto e quais detalhes podem ser recolhidos.
- QA: executar a matriz de viewports em navegadores/dispositivos suportados e anexar evidências reais.
- Design system: consolidar tokens de espaçamento, tipografia, elevação e estados após validação.

## 11. Limites do entregável
O arquivo HTML é um protótipo estático/interativo local para demonstrar a reorganização responsiva com dados fictícios. Não representa integração com backend, autenticação, mensagens reais, persistência, telemetria ou validação em dispositivos físicos. Breakpoints e larguras são recomendações iniciais, sujeitos à validação de frontend.

## 12. Referências internas
- #58 e #59: fluxos e experiência base.
- #72: notificações.
- #73: ocorrências.
- #74: anexos e compartilhamento.
- #75: busca de mensagens.
