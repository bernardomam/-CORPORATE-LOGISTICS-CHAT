# Issue #66 — Desenhar catálogo de produtos e serviços dentro da conversa

**Projeto:** CallZUP · **Data de consolidação:** 25/11/2026 · **Fonte:** [Issue #66](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/66)

> Registro individual da entrega UX/UI. As evidências e propostas foram consolidadas das descrições das issues; o aplicativo oficial não foi redesenhado. O status de fechamento da issue não comprova, por si só, todos os critérios originais.

## Objetivo
Explorar como uma empresa pode compartilhar produtos ou serviços no chat sem interromper o fluxo da conversa; confirmar com o PO se entra no MVP ou numa fase posterior.

## Atividades
- Projetar lista/cartões de itens com imagem, nome, descrição curta e preço quando aplicável.
- Definir visualização de detalhes e envio/compartilhamento de um item na conversa.
- Representar catálogo vazio, item indisponível e conteúdo sem imagem.
- Considerar acessibilidade, telas pequenas e itens com dados incompletos.

## Critério de pronto
- [x] Fluxo de abrir catálogo, consultar item e compartilhar no chat está prototipado.
- [x] Campos mínimos e estados alternativos estão documentados.
- [ ] PO decide e registra prioridade MVP ou pós-MVP.
- [ ] Tech Lead recebe especificação para estimativa técnica.

## Entregável e evidências

Base: [PR #120 integrado à main](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/120), commit `e1f6fce`; [requisitos oficiais](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md).
[Protótipo complementar HTML](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/c502f1158da2c4c7c46cc46a040ac40e51d80f22/docs/ux/prototipo-complementar-58-67.html) — baixar o arquivo pelo GitHub e abrir no navegador. Dados fictícios, sem API ou envio real. [PR #123](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/123). Verificação estática: JavaScript válido sintaticamente, IDs únicos e referências diretas presentes; execução em navegador e validação humana ainda não realizadas.

**Conceito pós-MVP:** Chat → Catálogo → selecionar item → detalhes → compartilhar como rascunho → revisar → enviar na demonstração. Campos: nome obrigatório, descrição breve, imagem opcional (mostrar “Imagem não fornecida”), preço opcional (mostrar “sob consulta”), disponibilidade textual. Item indisponível desabilita compartilhamento e explica o motivo; catálogo vazio apresenta mensagem. Sem compra, dados reais, acesso entre empresas ou comércio externo; proposta de catálogo interno compatível com isolamento. Layout responsivo declarado.

**Prioridade proposta:** pós-MVP, pois não consta dos RF atuais: [docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md (L25-L59)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md#L25-L59). Especificação disponível à equipe neste registro; não há decisão formal do PO nem confirmação de recebimento/estimativa técnica.

## Pendências não verificadas ou externas

- PO decide e registra prioridade MVP ou pós-MVP.
- Tech Lead recebe especificação para estimativa técnica.

**Status:** issue fechada no escopo individual. A validação formal de outros integrantes não foi presumida. O demonstrador auxiliar permanece separado do aplicativo oficial e não é uma interface aprovada.
