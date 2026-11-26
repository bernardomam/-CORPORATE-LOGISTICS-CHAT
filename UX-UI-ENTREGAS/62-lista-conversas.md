# Issue #62 — Projetar lista de conversas com busca, filtros e estados de atendimento

**Projeto:** CallZUP · **Data de consolidação:** 25/11/2026 · **Fonte:** [Issue #62](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/62)

> Registro individual da entrega UX/UI. As evidências e propostas foram consolidadas das descrições das issues; o aplicativo oficial não foi redesenhado. O status de fechamento da issue não comprova, por si só, todos os critérios originais.

## Objetivo
Facilitar que colaboradores encontrem e priorizem conversas em uma interface que poderá evoluir para atendimento comercial e operacional.

## Atividades
- Projetar lista com nome/identificador, prévia da última mensagem, horário e contagem de não lidas.
- Definir busca, filtros e ordenação sem sobrecarregar a tela.
- Explorar etiquetas configuráveis como “Novo cliente”, “Pedido” e “Pago”, deixando claro que são estados/organização de negócio.
- Representar listas vazias, carregamento, erro e conversa atribuída/em atendimento, caso esse conceito seja aprovado pelo PO.

## Critério de pronto
- [x] Protótipo mostra lista, busca, filtros e aplicação/remoção de etiquetas.
- [x] Cada estado tem hierarquia visual e comportamento documentados.
- [x] Uso em telas estreitas foi validado.
- [ ] PO validou o modelo de etiquetas e filtros antes do desenvolvimento.

## Entregável e evidências

Base: [PR #120 integrado à main](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/120), commit `e1f6fce`; [requisitos oficiais](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md).
[Protótipo complementar HTML](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/c502f1158da2c4c7c46cc46a040ac40e51d80f22/docs/ux/prototipo-complementar-58-67.html) — baixar o arquivo pelo GitHub e abrir no navegador. Dados fictícios, sem API ou envio real. [PR #123](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/123). Verificação estática: JavaScript válido sintaticamente, IDs únicos e referências diretas presentes; execução em navegador e validação humana ainda não realizadas.

**Comportamento:** Conversas apresenta nome, prévia, horário, número de não lidas e etiqueta textual; busca por nome/mensagem, filtro Todas/Não lidas/Novo cliente/Pedido/Pago. Abrir conversa → escolher etiqueta → Aplicar/remover → Voltar mantém a seleção durante a sessão. Lista vazia, busca sem resultado, carregamento e erro com nova tentativa estão representados. Hierarquia: nome e ação principal primeiro; prévia/horário abaixo; contagem/etiqueta textual. Em tela estreita, filtros empilham e itens usam quebra de texto. Etiquetas e estados de atendimento são hipóteses pós-MVP; não significam implementação ou decisão de produto.

Na produção atual a lista busca por nome e mostra o contato, mas a prévia é “Conversa privada”; filtros e etiquetas não estão evidenciados: [app/conversas/page.tsx (L143-L147)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/conversas/page.tsx#L143-L147), [app/conversas/page.tsx (L249-L310)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/conversas/page.tsx#L249-L310). Teste efetivo em tela estreita e validação do modelo pela equipe não realizados.

## Resultados de teste relatados

O responsável relatou ter testado busca pelo nome, aplicação e remoção de etiqueta e filtros na visualização mobile, sem problemas funcionais reportados. Trata-se do demonstrador HTML, não da produção. A avaliação qualitativa geral foi negativa (excesso de texto e navegação confusa); não constitui aprovação visual. O teste em tela estreita foi registrado por relato do responsável. Validação de produto continua externa.

## Pendências não verificadas ou externas

- PO validou o modelo de etiquetas e filtros antes do desenvolvimento.

**Status:** issue fechada no escopo individual. A validação formal de outros integrantes não foi presumida. O demonstrador auxiliar permanece separado do aplicativo oficial e não é uma interface aprovada.
