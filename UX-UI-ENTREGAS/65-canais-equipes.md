# Issue #65 — Projetar canais por equipe e disponibilidade dos atendentes

**Projeto:** CallZUP · **Data de consolidação:** 25/11/2026 · **Fonte:** [Issue #65](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/65)

> Registro individual da entrega UX/UI. As evidências e propostas foram consolidadas das descrições das issues; o aplicativo oficial não foi redesenhado. O status de fechamento da issue não comprova, por si só, todos os critérios originais.

## Objetivo
Propor uma organização visual de canais ou conversas por setor/unidade, coerente com a estrutura organizacional e grupos operacionais já prevista no backend.

## Atividades
- Explorar navegação por equipe/setor e identificação de conversas de cada canal.
- Definir estados de disponibilidade como disponível, ocupado e ausente, se aprovados pelo PO.
- Mostrar claramente o escopo de acesso e diferenciar canal de equipe de grupo de conversa.
- Validar os termos e o modelo mental com representantes de usuários.

## Critério de pronto
- [x] Protótipo diferencia canais, grupos e conversas individuais.
- [x] Estados de disponibilidade têm significado e representação documentados.
- [ ] Regras de visibilidade e permissões foram alinhadas com PO/Tech Lead.
- [x] Pelo menos uma rodada de feedback foi registrada.

## Entregável e evidências

Base: [PR #120 integrado à main](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/120), commit `e1f6fce`; [requisitos oficiais](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md).
[Protótipo complementar HTML](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/c502f1158da2c4c7c46cc46a040ac40e51d80f22/docs/ux/prototipo-complementar-58-67.html) — baixar o arquivo pelo GitHub e abrir no navegador. Dados fictícios, sem API ou envio real. [PR #123](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/123). Verificação estática: JavaScript válido sintaticamente, IDs únicos e referências diretas presentes; execução em navegador e validação humana ainda não realizadas.

**Conceito pós-MVP:** Equipes → canal Expedição → abrir; Grupos → grupo gerenciado pela TI; Conversas → contato individual. Canal é espaço temático por setor com leitura/postagem condicionadas à permissão; grupo é conjunto de membros selecionados pela TI; conversa individual é 1:1. Disponível: pode receber contato; ocupado: resposta pode demorar; ausente: indisponível; sempre exibir texto, nunca apenas cor. Disponibilidade não substitui bloqueio de horário. Regras propostas: isolamento por empresa; TI administra visibilidade e associação; acesso negado para setor não autorizado; não expor lista de membros de outra empresa. [docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md (L25-L59)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md#L25-L59).

Grupos atuais: [app/grupos/page.tsx (L18-L75)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/grupos/page.tsx#L18-L75). Não há evidência de canal distinto implementado. Não foi possível entrevistar usuários ou obter revisão humana; nenhuma rodada de feedback é apresentada como realizada.

## Resultados de teste relatados

O responsável confirmou a execução do checklist de abertura da seção Equipes e solicitação de teste a um colega. Feedback textual fornecido pelo próprio responsável: demonstrador pouco agradável visualmente, confuso, com excesso de texto e pouco amigável. Não foi fornecida uma opinião separada atribuível ao colega. Recomendações registradas: reduzir textos explicativos na interface, simplificar hierarquia e navegação, preservar os padrões visuais do aplicativo oficial. Nenhum problema funcional reportado. A rodada de feedback está registrada, não aprovada; regras de permissão continuam externas.

## Pendências não verificadas ou externas

- Regras de visibilidade e permissões foram alinhadas com PO/Tech Lead.

**Status:** issue fechada no escopo individual. A validação formal de outros integrantes não foi presumida. O demonstrador auxiliar permanece separado do aplicativo oficial e não é uma interface aprovada.
