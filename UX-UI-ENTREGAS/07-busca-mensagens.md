# Busca de mensagens dentro das conversas

## 1. Objetivo e escopo

Permitir que a pessoa encontre mensagens anteriores no histórico da conversa aberta e retorne ao contexto original. Esta busca é **interna à conversa atual** e não substitui a busca geral/lista de conversas (#62).

A especificação define a experiência UX/UI. A implementação, indexação, permissões e filtros dependem dos contratos reais do produto.

## 2. Entrada e comportamento

- Disponibilizar ação “Buscar nesta conversa” no cabeçalho ou menu de ações da conversa, seguindo o padrão visual do produto.
- Ao ativar, abrir campo com placeholder “Buscar mensagens nesta conversa…”.
- Exibir ação explícita para limpar a consulta e fechar a busca.
- Permitir Enter para pesquisar e Escape para fechar/limpar conforme padrão de teclado.
- Não disparar busca para campo vazio ou composto apenas por espaços.
- Se houver busca incremental, aplicar debounce definido pela engenharia; não simular resultados como definitivos enquanto a consulta estiver pendente.
- Preservar a consulta e os resultados ao abrir um resultado e retornar ao painel, enquanto a conversa permanecer ativa.

## 3. Resultados

Cada resultado deve mostrar:
- Trecho da mensagem com o termo destacado sem depender apenas da cor.
- Autor, data e horário, se disponíveis.
- Tipo de mensagem/anexo, quando aplicável e suportado.
- Contexto suficiente para diferenciar mensagens semelhantes.
- Ação para “Ir para mensagem”.

Ordenação sugerida: mais recentes primeiro, com indicação clara da ordenação. A equipe deve confirmar paginação, limite de resultados e ordenação suportada pelo serviço.

Mensagens com anexos ou conteúdo especial devem apresentar uma descrição compreensível, sem expor dados que o usuário não tenha permissão para consultar.

## 4. Navegação e contexto

Ao selecionar um resultado:
1. Fechar ou recolher temporariamente o painel de resultados sem descartar a consulta.
2. Navegar até a mensagem no histórico, carregando a página/lote necessário se o serviço suportar.
3. Posicionar a mensagem de forma visível, preferencialmente com mensagens vizinhas.
4. Aplicar destaque temporário e acessível à mensagem localizada.
5. Oferecer retorno aos resultados sem reiniciar a pesquisa.

Se a mensagem tiver sido removida, estiver fora do escopo de acesso ou não puder ser carregada, informar isso sem revelar conteúdo restrito. Não posicionar o usuário em um ponto incorreto como se a localização tivesse sido bem-sucedida.

## 5. Filtros e refinamento

Filtros opcionais para avaliação com PO e engenharia:
- Autor.
- Intervalo de datas.
- Tipo de conteúdo (texto, arquivo, imagem ou outro tipo suportado).

**Não são requisitos confirmados do MVP.** A interface só deve exibir filtros que tenham suporte real na API e decisão de produto. A busca por texto é o fluxo base. Quando filtros estiverem ativos, mostrar chips/indicadores e uma ação “Limpar filtros”.

## 6. Estados e microcopy

| Estado | Mensagem / apresentação | Ação |
|---|---|---|
| Inicial | “Buscar mensagens nesta conversa…” | Digitar termo |
| Consulta vazia | Orientação para informar um termo | Não pesquisar |
| Carregando | “Buscando mensagens…” | Aguardar |
| Resultados | Lista com trecho, autor e data | Ir para mensagem |
| Sem resultado | “Nenhuma mensagem encontrada. Tente outro termo.” | Editar consulta |
| Conversa sem histórico | “Ainda não há mensagens nesta conversa.” | Voltar |
| Falha | “Não foi possível realizar a busca. Tente novamente.” | Tentar novamente |
| Sem permissão | “Você não tem acesso a estas mensagens.” | Voltar |
| Mensagem indisponível | “Esta mensagem não está mais disponível.” | Voltar aos resultados |
| Conexão instável | “Verifique sua conexão e tente novamente.” | Tentar novamente |

Evitar distinguir visualmente causas sensíveis de ausência de conteúdo quando isso puder revelar a existência de mensagens privadas.

## 7. Layout responsivo

### Desktop
- Busca acessível no cabeçalho da conversa.
- Resultados em painel lateral ou área dedicada, mantendo a conversa reconhecível.
- Selecionar resultado mantém contexto e permite retornar aos resultados.

### Tablet
- Painel de resultados adaptável, podendo ocupar a largura principal.
- Não sobrepor controles essenciais da conversa.

### Celular
- Busca em tela ou painel dedicado, com campo e botão de fechar sempre acessíveis.
- Resultados em lista vertical com alvos de toque confortáveis.
- Ao abrir resultado, retornar ao histórico com ação visível para voltar à busca.
- Não exigir hover ou rolagem horizontal.

## 8. Acessibilidade

- Campo com rótulo acessível, não apenas placeholder.
- Botões com nomes claros (“Limpar busca”, “Fechar busca”, “Ir para mensagem de Ana”).
- Navegação completa por teclado e foco visível.
- Resultados em estrutura semântica; termo destacado também por marcação textual/semântica.
- Anunciar quantidade de resultados e mudanças de estado com região de status, evitando anúncios repetitivos.
- Ao abrir um resultado, mover foco de forma previsível para a mensagem ou título/contexto apropriado.
- Ao retornar, restaurar foco ao resultado selecionado.
- Contraste adequado e nenhuma informação comunicada apenas por cor.

## 9. Privacidade, segurança e desempenho

- Respeitar as permissões da conversa tanto na consulta quanto ao abrir a mensagem.
- Não usar a busca para contornar mensagens apagadas, restritas ou inacessíveis.
- Não exibir conteúdo de conversas diferentes da conversa atual.
- Tratar consultas como potencialmente sensíveis; não colocá-las em URLs públicas, telemetria aberta ou logs expostos.
- Aplicar limites, paginação e proteção contra consultas excessivas conforme decisão técnica.
- Definir comportamento para mensagens editadas/removidas e indexação atrasada.
- O backend é a fonte de verdade para resultados e autorização.

## 10. Diferenciação da busca geral (#62)

| Busca nesta issue (#75) | Busca geral de conversas (#62) |
|---|---|
| Pesquisa mensagens da conversa aberta | Localiza conversas na lista/ambiente |
| Resultado leva a uma mensagem específica | Resultado leva à conversa |
| Mostra trecho, autor e data da mensagem | Mostra informações da conversa |
| Mantém escopo restrito à conversa atual | Pode abranger múltiplas conversas conforme produto |

A UI deve nomear explicitamente a ação “Buscar nesta conversa” para evitar confusão.

## 11. Critérios de aceite UX/UI

- [x] Fluxo de busca interna documentado e prototipado.
- [x] Resultados incluem trecho, autor/data e ação de navegação.
- [x] Navegação ao contexto e retorno aos resultados especificados.
- [x] Estados inicial, vazio, carregamento, sem resultado, erro e indisponibilidade documentados.
- [x] Diferença entre busca interna e busca geral (#62) explicitada.
- [x] Filtros opcionais separados do fluxo base.
- [x] Responsividade, acessibilidade, privacidade e desempenho considerados.
- [ ] PO confirma escopo de filtros e priorização para MVP.
- [ ] Engenharia confirma API, ordenação, paginação, indexação e comportamento para mensagens removidas.

## 12. Limites desta entrega

O protótipo usa mensagens fictícias em memória no navegador. A busca é local e demonstrativa; não consulta histórico real, não implementa indexação, paginação de servidor, autorização, auditoria nem integração com a API. Os filtros aparecem como demonstração de interação e não representam funcionalidades aprovadas ou disponíveis no backend.
