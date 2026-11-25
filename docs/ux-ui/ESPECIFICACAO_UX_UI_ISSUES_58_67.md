# CallZUP — especificação consolidada de UX/UI (issues #58–#67)

**Versão:** 1.0 — 24/11/2026  
**Responsabilidade:** UX/UI  
**Base de produto:** frontend e API existentes na branch `main` nesta data.  
**Status:** proposta de design e auditoria de interface; decisões que dependem de PO, Tech Lead, SQA ou usuários estão explicitamente marcadas como pendentes.

> Este documento não declara funcionalidades inexistentes como implementadas. Ele separa o que foi observado no produto, a especificação UX proposta e as validações necessárias antes de considerar cada issue concluída.

## 1. Direção de experiência e princípios

O CallZUP é uma ferramenta de comunicação corporativa para conversas individuais e em grupo, com fluxos operacionais de solicitação e administração. A interface deve priorizar comunicação rápida, contexto suficiente e previsibilidade.

Princípios:
1. **Clareza antes de densidade:** cada tela deve ter uma ação primária evidente e linguagem direta.
2. **Consistência:** navegação, campos, botões, mensagens de estado e confirmações devem repetir padrões.
3. **Mobile-first e desktop eficiente:** ações essenciais funcionam em telas estreitas; desktop aproveita a largura sem esticar linhas de leitura.
4. **Estado honesto:** distinguir dados reais da API, estados locais de protótipo e indisponibilidade do serviço.
5. **Acessibilidade por padrão:** controles nomeados, foco visível, contraste adequado, teclado funcional e informação que não dependa apenas de cor.
6. **Escopo incremental:** catálogo e automações comerciais não devem bloquear a experiência central de mensagens.

## 2. Mapa de jornadas e escopo — issue #58

### Jornadas prioritárias do MVP

| Jornada | Entrada | Caminho principal | Resultado esperado | Estados alternativos |
|---|---|---|---|---|
| Entrar | Tela de login | Informar e-mail e senha → enviar → aguardar API | Sessão válida e redirecionamento conforme papel | Campo inválido, credencial recusada, API indisponível, carregamento |
| Encontrar conversa | Conversas | Abrir conversas → buscar pessoa → selecionar | Abrir conversa individual | Lista vazia, busca sem resultado, erro ao carregar, sessão expirada |
| Enviar mensagem | Conversa individual | Digitar → enviar → receber confirmação | Mensagem aparece no histórico | Texto vazio, envio pendente, falha, reconexão, envio fora do horário |
| Conversar em grupo | Grupos | Consultar grupo → abrir conversa → enviar mensagem | Contexto coletivo correto | Sem grupos, sem permissão, grupo indisponível |
| Solicitar contato/suporte | Solicitar | Selecionar destino/motivo → enviar solicitação | Confirmação e status rastreável | Campos ausentes, solicitação duplicada, erro de API |
| Consultar perfil | Perfil | Abrir perfil → consultar dados da conta | Identidade e dados profissionais visíveis | Dados incompletos, falha de carregamento |

### Pós-MVP proposto

- Catálogo de produtos/serviços compartilhável no chat (#66).
- Respostas rápidas e mensagem automática de ausência (#67).
- Etiquetas comerciais e filtros avançados de atendimento (#62), condicionados à aprovação do modelo operacional pelo PO.
- Canais por equipe e disponibilidade de atendentes (#65), condicionados a regras de permissão e modelo organizacional.
- Tema escuro completo (#67), depois de tokens semânticos e verificação de contraste em todas as telas.

### Dependências e decisões

- **PO:** confirmar MVP versus pós-MVP, etiquetas comerciais, canais e regras de perfil comercial.
- **Tech Lead:** confirmar contratos da API, permissões, persistência e viabilidade dos componentes.
- **SQA:** validar cenários de erro, permissões e regressão.
- **Usuários representantes:** avaliar nomes e modelo mental de canais, grupos e estados de atendimento.

**Pendente para aceite da issue #58:** registrar a aprovação dessas prioridades por PO e Tech Lead no histórico da issue.

## 3. Protótipo e fluxos navegáveis — issue #59

A branch `main` já contém rotas e telas para login, conversas, chat, grupos, solicitações, perfil e painel de TI. A navegação real deve ser conferida no ambiente publicado com contas de teste válidas; não se deve apresentar dados simulados como persistentes.

### Roteiro de demonstração

1. Abrir a rota inicial e acessar login.
2. Entrar com credencial de teste autorizada.
3. Na lista de conversas, pesquisar um colaborador e abrir a conversa.
4. Enviar mensagem, observar confirmação e testar uma falha/reconexão quando disponível.
5. Voltar, abrir grupos e consultar um grupo autorizado.
6. Abrir solicitações e percorrer o fluxo de criação/consulta.
7. Abrir perfil e verificar dados disponíveis.
8. Repetir em viewport mobile e desktop.

### Requisitos de protótipo

- Cada ação deve ter resposta visual imediata: carregando, sucesso, vazio ou erro.
- A busca sem resultados deve oferecer uma mensagem específica e permitir limpar o termo.
- Ações destrutivas devem pedir confirmação e explicar o impacto.
- Em mobile, o usuário deve conseguir voltar à lista sem perder contexto desnecessariamente.
- Em desktop, lista e conversa podem coexistir lado a lado, com seleção evidente.

**Pendente para aceite da issue #59:** anexar URL de preview acessível aos revisores e registrar revisão do PO e Tech Lead. Este documento não substitui a aprovação do protótipo.

## 4. Design system — issue #60

### Tokens iniciais

Os valores abaixo consolidam a linguagem visual já presente no frontend e são uma proposta inicial para padronização, não uma biblioteca de componentes já publicada.

| Token | Valor inicial | Uso |
|---|---|---|
| Brand / navy | `#1E2A78` | Títulos e identidade |
| Brand / primary | `#3D3FE8` | Ação primária e seleção |
| Brand / accent | `#5146E5` | Destaques e navegação |
| Text / primary | `#1F2937` | Texto principal |
| Text / secondary | `#64748B` | Texto auxiliar |
| Surface / page | `#F8FAFC` | Fundo de página |
| Surface / card | `#FFFFFF` | Cartões e painéis |
| Border / default | `#E2E8F0` | Divisórias e campos |
| Feedback / success | `#15803D` | Sucesso (sempre com texto/ícone) |
| Feedback / warning | `#B45309` | Atenção (sempre com texto/ícone) |
| Feedback / danger | `#B91C1C` | Erro (sempre com texto/ícone) |

### Tipografia e escala

- Família: fonte sans-serif do sistema, priorizando legibilidade e carregamento rápido.
- Título de página: 28–32 px, peso 700–800.
- Título de seção: 18–20 px, peso 700.
- Corpo: 14–16 px, peso 400–500, line-height confortável.
- Metadados: mínimo de 12 px; evitar usar texto pequeno para instruções essenciais.
- Não usar apenas peso ou cor para transmitir status.

### Espaçamento, forma e elevação

- Escala de espaçamento baseada em múltiplos de 4 px: 4, 8, 12, 16, 24, 32 e 40.
- Campos e botões: altura mínima recomendada de 44 px.
- Raio: 8 px para controles compactos; 12 px para campos e cartões; 16–24 px para painéis destacados.
- Bordas discretas de 1 px; sombras suaves apenas para separar níveis de superfície.
- Ícones decorativos devem ser ocultados de tecnologias assistivas; ícones funcionais precisam de nome acessível.

### Componentes e estados

| Componente | Variantes | Estados obrigatórios |
|---|---|---|
| Botão | Primário, secundário, texto, perigo | Padrão, hover, foco, pressionado, desabilitado, carregando |
| Campo | Texto, e-mail, senha, busca | Vazio, preenchido, foco, inválido, desabilitado |
| Badge | Neutro, informativo, sucesso, atenção, perigo | Sempre acompanhado de texto compreensível |
| Avatar | Foto, iniciais, fallback | Imagem ausente e nome acessível |
| Item de conversa | Padrão, selecionado, não lido | Hover, foco, selecionado, indisponível |
| Mensagem | Recebida, enviada, anexo, resposta | Enviando, enviada, entregue, lida, falha |
| Modal/diálogo | Confirmação, formulário, detalhe | Foco inicial, foco contido, fechar e retorno de foco |
| Feedback | Toast, alerta em linha, estado vazio | Sucesso, erro, aviso, carregamento |

**Pendente para aceite da issue #60:** alinhar tokens e componentes com Tech Lead/frontend e publicar a biblioteca no local de design adotado pelo time (ou confirmar este documento como fonte oficial).

## 5. Usabilidade e acessibilidade — issue #61

### Checklist de auditoria

- [x] O frontend usa links para navegação e botões para ações em áreas já inspecionadas.
- [x] Há uso de `aria-current` em itens selecionados da navegação.
- [x] O login apresenta tratamento visual de erro com `role="alert"`.
- [ ] Garantir rótulo persistente e associação `label/htmlFor` em todos os campos (incluindo busca).
- [ ] Garantir nome acessível para todos os botões somente com ícone.
- [ ] Garantir anúncio de carregamento, atualização e falha para leitor de tela sem excesso de anúncios.
- [ ] Verificar contraste de texto, bordas, foco e estados em ferramenta automatizada.
- [ ] Percorrer todas as telas apenas com teclado e verificar ordem/foco de retorno.
- [ ] Verificar zoom de 200% e largura equivalente a 320 CSS px sem rolagem horizontal indevida.
- [ ] Testar com ao menos um leitor de tela e registrar navegador/tecnologia assistiva.

### Severidade e recomendações

| Severidade | Problema a verificar/corrigir | Recomendação |
|---|---|---|
| Alta | Campo sem rótulo programático | Associar label visível ao input; placeholder não substitui label |
| Alta | Botão de ícone sem nome | Adicionar `aria-label` descritivo e único |
| Alta | Fluxo impossível por teclado | Corrigir ordem de tabulação, foco visível e operação por Enter/Espaço |
| Média | Erro não anunciado | Usar região de alerta para mensagens relevantes |
| Média | Estado indicado só por cor | Incluir texto, ícone ou padrão adicional |
| Média | Alvo de toque pequeno | Preferir área interativa de pelo menos 44 × 44 px |
| Média | Movimento não respeita preferência | Aplicar `prefers-reduced-motion` em animações/transições |

**Limite da auditoria:** esta é uma inspeção estática do código e uma lista de testes; não equivale a certificação WCAG nem a teste real com leitor de tela.  
**Pendente para aceite da issue #61:** execução do checklist pelo frontend/SQA e registro das evidências.

## 6. Lista de conversas, busca, filtros e etiquetas — issue #62

### Estrutura proposta

- Cabeçalho com título, descrição curta e ação de atualizar.
- Busca por nome ou identificador, com botão para limpar.
- Filtros em chips: Todas, Não lidas, Individuais, Grupos e Atribuídas (este último somente se atribuição for aprovada).
- Lista com avatar, nome, tipo de conversa, prévia da última mensagem, horário e contador de não lidas quando houver dados reais.
- Etiquetas comerciais opcionais: Novo cliente, Pedido e Pago; não misturar com status técnico de mensagem.

### Comportamentos

- Busca filtra sem recarregar a página; estado vazio informa o termo pesquisado.
- Filtros podem ser combinados somente se o PO aprovar regras claras; oferecer “Limpar filtros”.
- Etiquetas devem ter ação explícita de adicionar/remover, confirmação visual e texto acessível.
- Não exibir horário, contagem ou prévia fictícios quando a API não fornecer esses dados.

### Estados

Carregando (skeleton), lista vazia, nenhum resultado de busca, erro com tentar novamente, lista carregada e falha de atualização mantendo os dados anteriores.

**Pendente para aceite da issue #62:** aprovação do PO sobre etiquetas/filtros e protótipo validado em largura estreita. A branch main consultada ainda não demonstra todas essas capacidades.

## 7. Experiência do chat — issue #63

### Hierarquia da tela

1. Cabeçalho: voltar, avatar/nome, tipo de conversa e contexto disponível.
2. Histórico: mensagens agrupadas por proximidade temporal, autoria e horário.
3. Compositor: campo multilinha, anexar (se suportado), enviar e indicação de envio.
4. Estados auxiliares: reconexão, falha, histórico vazio e restrição de horário.

### Regras de interação

- Enter envia; Shift+Enter cria nova linha (em desktop), com alternativa explícita e acessível.
- Desabilitar envio apenas quando vazio ou durante operação que realmente impeça novo envio.
- Falha de envio preserva o texto e oferece tentar novamente.
- Indicadores enviada/entregue/lida devem ter rótulo textual acessível, não apenas ícones.
- Anexos mostram nome, tipo e tamanho; erro de upload não deve apagar a mensagem.
- Ações destrutivas ficam em menu contextual e pedem confirmação.
- Reconexão deve informar que o envio está pendente e evitar duplicidade.

### Estados a validar

Histórico carregando, sem mensagens, envio pendente, enviada, entregue, lida, falha, reconectando, sem conexão e acesso negado.

**Pendente para aceite da issue #63:** confirmar com Tech Lead/SQA o contrato real de status, anexos e reconexão; revisar os estados com o fluxo implementado.

## 8. Perfil comercial — issue #64

### Visualização pública/interna proposta

- Nome comercial e imagem/logo.
- Descrição curta.
- Endereço (com ação de copiar/abrir mapa, se aprovado).
- Horário de funcionamento e estado “Aberto agora/Fechado” calculado pelo backend, incluindo fuso horário.
- Canais oficiais de contato.
- Sinalização clara quando um dado não foi informado.

### Edição

- Campos com rótulos persistentes, limites de caracteres e validação contextual.
- Pré-visualização antes de salvar.
- Cancelar descarta alterações; salvar mostra carregamento e confirmação.
- Definir quais papéis podem visualizar/editar cada campo.

**Pendente para aceite da issue #64:** PO define campos obrigatórios e visibilidade; Tech Lead confirma endpoints/permissões. O perfil de funcionário atual não deve ser confundido com perfil comercial da empresa.

## 9. Canais por equipe e disponibilidade — issue #65

### Modelo mental proposto

- **Canal:** espaço persistente associado a uma equipe/setor.
- **Grupo:** conversa coletiva com participantes definidos.
- **Conversa individual:** troca entre duas pessoas.
- Cada canal apresenta nome, descrição, setor e regra de acesso; não presumir que todos podem ver todos os canais.

### Disponibilidade

- Disponível, ocupado e ausente devem ter texto e ícone além da cor.
- Disponibilidade pessoal não deve ser confundida com disponibilidade do canal.
- Definir se o status expira automaticamente e quem pode alterá-lo.
- Não exibir presença em tempo real se o backend não fornecer esse dado.

**Pendente para aceite da issue #65:** validar modelo com representantes de usuários, PO e Tech Lead; registrar regras de visibilidade e permissões.

## 10. Catálogo no chat — issue #66

### Fluxo proposto

1. Abrir ação “Compartilhar item” no compositor.
2. Consultar catálogo e pesquisar item.
3. Abrir detalhe com imagem, nome, descrição, preço (quando aplicável) e disponibilidade.
4. Confirmar compartilhamento.
5. Exibir cartão do item no histórico com ação para consultar detalhes.

### Estados e conteúdo

- Catálogo vazio: explicar como adicionar itens (se houver permissão).
- Item sem imagem: placeholder consistente.
- Item indisponível: status textual e impedir compartilhamento como disponível.
- Dados incompletos: ocultar campos ausentes sem inventar valores.
- Telas pequenas: cartão empilhado, ação principal em largura total.

**Pendente para aceite da issue #66:** PO decide MVP ou pós-MVP; Tech Lead estima integração e define fonte dos dados. Não implementar preço/estoque fictícios.

## 11. Aparência, respostas rápidas e ausência automática — issue #67

### Aparência

- Opções: Claro, Escuro e Seguir sistema.
- Preferência deve persistir por usuário/dispositivo conforme decisão técnica.
- Tema escuro só deve ser liberado quando todas as superfícies, estados, gráficos e componentes tiverem tokens semânticos e contraste verificado.

### Respostas rápidas

- Lista com atalho, título e conteúdo.
- Criar/editar/excluir com confirmação quando necessário.
- Inserção no chat deve permitir revisar o texto antes de enviar; nunca enviar automaticamente ao selecionar.
- Atalho deve ser único por usuário/empresa conforme regra definida.

### Mensagem de ausência

- Ativar/desativar.
- Texto editável com prévia.
- Agenda e fuso horário explícitos.
- Informar ao usuário quando a mensagem automática será enviada e evitar múltiplos disparos indevidos.
- Diferenciar visualmente mensagem automática de mensagem manual no histórico.

**Pendente para aceite da issue #67:** PO prioriza os recursos e Tech Lead avalia persistência, agendamento e dependências. Catálogo, respostas rápidas e ausência devem permanecer identificados como pós-MVP até decisão formal.

## 12. Plano de Design QA e critérios de liberação

### Matriz mínima de validação

| Plataforma | Larguras de referência | Verificações |
|---|---|---|
| Mobile | 320, 375 e 430 px | Sem overflow, toque confortável, navegação inferior, teclado virtual |
| Tablet | 768 e 1024 px | Transição de navegação, hierarquia e uso de espaço |
| Desktop | 1280 e 1440 px | Sidebar, lista/chat, largura de leitura e foco |

### Roteiro de QA

- [ ] Executar `npm run lint`.
- [ ] Executar `npm run build`.
- [ ] Percorrer jornadas principais com usuário de teste.
- [ ] Verificar teclado: Tab, Shift+Tab, Enter, Espaço e Escape em diálogos.
- [ ] Verificar contraste e foco visível.
- [ ] Verificar zoom de 200% e viewport de 320 px.
- [ ] Verificar estados de carregamento, vazio, erro e sucesso.
- [ ] Confirmar que dados de demonstração estão identificados.
- [ ] Registrar navegador, dispositivo, resultado e evidência de cada teste.

### Critério de conclusão responsável

Uma issue só deve ser fechada quando seus critérios estiverem demonstrados e as validações externas exigidas (PO, Tech Lead, SQA ou usuários) estiverem registradas. Este documento organiza a especificação e o plano de validação; não substitui testes executados nem aprovações de terceiros.
