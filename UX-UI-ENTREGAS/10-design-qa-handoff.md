# Design QA e handoff para frontend — guia operacional

## Objetivo e limite
Padronizar a passagem das especificações UX/UI para frontend e a revisão visual/funcional das telas implementadas. Complementa o design system (#60), sem substituí-lo.

**Estado real:** checklist, processo, modelo de divergências e matriz de cobertura preparados. Não havia build frontend, capturas de implementação ou ambiente executável disponível nesta tarefa; portanto, nenhuma tela foi declarada aprovada em QA e nenhuma divergência real foi inventada.

## Pacote obrigatório de handoff por tela
- Identificador, nome, objetivo e público.
- Fluxo de origem/destino e regras de navegação.
- Link da referência visual/protótipo e versão/data.
- Layout, hierarquia, medidas relevantes e comportamento responsivo.
- Componentes/variantes existentes e novos.
- Tokens oficiais de tipografia, espaçamento, cor e assets.
- Textos finais, microcopy, validações e mensagens.
- Estados: inicial, loading, vazio, sucesso, erro, desabilitado, sem permissão e offline quando aplicável.
- Interações, ações primárias/secundárias, confirmações e prevenção de duplo envio.
- Regras de negócio, permissões e dúvidas pendentes.
- Acessibilidade: teclado, foco, rótulos, contraste e mensagens de estado.
- Viewports, reflow, dependências de API/dados e critérios de aceite verificáveis.

## Checklist reutilizável por tela
### Visual
- [ ] Hierarquia de conteúdo clara.
- [ ] Layout, alinhamento e espaçamento seguem referências/tokens oficiais.
- [ ] Tipografia, contraste, ícones e assets correspondem ao design aprovado.
- [ ] Conteúdo longo e estados densos foram considerados.
- [ ] Sem sobreposição, corte ou scroll horizontal indevido.

### Interação
- [ ] Cada controle tem ação e resultado especificados.
- [ ] Formulários definem obrigatoriedade, validação e mensagens.
- [ ] Ações destrutivas têm confirmação.
- [ ] Loading, bloqueio de ação duplicada, sucesso e falha definidos.
- [ ] Permissões aplicadas pelo backend; UI apenas reflete autorização.
- [ ] Navegação, retorno e preservação de contexto definidos.

### Estados
- [ ] Carregamento e vazio/sem resultados.
- [ ] Erro e recuperação.
- [ ] Sucesso.
- [ ] Desabilitado/em andamento.
- [ ] Sem permissão/expirado, quando aplicável.
- [ ] Dados parciais ou indisponíveis, quando aplicável.

### Responsividade e acessibilidade
- [ ] Celular, tablet e desktop.
- [ ] Zoom/reflow e teclado virtual, quando aplicável.
- [ ] Alvos de toque e foco acessíveis.
- [ ] Painéis, modais e rolagem comportam-se corretamente.
- [ ] Foco visível e ordem de teclado lógica.
- [ ] Nome acessível nos controles; estado não depende só de cor.
- [ ] Mensagens dinâmicas anunciáveis; sem interação exclusiva por hover.

## Processo de Design QA
1. Selecionar tela, build e ambiente identificados.
2. Fixar versão da referência e viewport.
3. Percorrer fluxo completo e estados alternativos.
4. Comparar implementação com especificação e comportamento esperado.
5. Registrar divergência com evidência e passos para reproduzir.
6. Classificar severidade/impacto, recomendar correção e indicar responsável.
7. Alinhar correções com frontend/PO.
8. Retestar na mesma condição e registrar resultado.
9. Registrar diferenças intencionais aceitas, justificativa e aprovador.
10. Publicar resumo com bloqueadores, pendências e decisão de aceite.

## Severidade
| Nível | Definição | Exemplo |
|---|---|---|
| Crítica | Bloqueia tarefa essencial, expõe dado ou cria risco operacional relevante | Não enviar informação operacional; dados de outra conta visíveis |
| Alta | Grande dificuldade, risco de erro ou perda de contexto | Ação principal inacessível em tablet |
| Média | Prejudica compreensão/eficiência, mas há alternativa | Estado vazio sem orientação |
| Baixa | Acabamento sem impacto relevante | Pequeno desalinhamento |

Prioridade considera severidade, frequência, alcance e risco; severidade não é a mesma coisa que ordem de implementação.

## Modelo de registro de divergência
- ID/data:
- Tela/fluxo e versão:
- Ambiente/build e viewport:
- Pré-condições e passos:
- Esperado (referência):
- Observado (implementação):
- Evidência (captura/vídeo/link):
- Severidade e impacto:
- Recomendação:
- Responsável:
- Status: novo / triagem / em correção / pronto para reteste / validado / diferença intencional aceita.
- Resultado do reteste/data:
- Justificativa/aprovador:

Mascarar dados de clientes, colaboradores e operações nas evidências.

## Matriz mínima de cobertura
| Área | Fluxos | Pontos críticos |
|---|---|---|
| Conversas/chat | lista, abrir, enviar | contexto, estados de envio/erro, permissões |
| Notificações (#72) | central e preferências | leitura, vazio, preferências |
| Ocorrências (#73) | detalhe, status, histórico | ciclo de vida e ações autorizadas |
| Anexos (#74) | selecionar, revisar, enviar, falhar | validação, progresso, privacidade |
| Busca (#75) | pesquisar, filtrar, abrir resultado | relevância e retorno ao contexto |
| Responsividade (#76) | celular/tablet/desktop | reflow, navegação, scroll |
| Conta/segurança (#77) | dados e estados de sessão | privacidade e permissões |

A matriz é roteiro de cobertura, não comprovação de implementação.

## Resumo e pendências
- [x] Checklist de handoff reutilizável.
- [x] Processo de QA, severidade e modelo de divergências.
- [x] Matriz de fluxos prioritários.
- [x] Protótipo auxiliar de registro de handoff.
- [ ] Frontend disponibilizar build/capturas e versão.
- [ ] Revisar telas reais em conjunto com frontend.
- [ ] Registrar divergências reais com evidências.
- [ ] Retestar correções críticas e documentar diferenças aceitas.
- [ ] Enviar resumo ao PO/UX e registrar decisão.

**Responsabilidades sugeridas:** UX/UI mantém referência e compara; frontend fornece build, corrige e informa limitações; PO decide trade-offs; QA/SQA executa regressão.