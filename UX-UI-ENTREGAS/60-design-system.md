# Issue #60 — Definir design system e especificação dos componentes base

**Projeto:** CallZUP · **Data de consolidação:** 25/11/2026 · **Fonte:** [Issue #60](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/60)

> Registro individual da entrega UX/UI. As evidências e propostas foram consolidadas das descrições das issues; o aplicativo oficial não foi redesenhado. O status de fechamento da issue não comprova, por si só, todos os critérios originais.

## Objetivo
Detalhar a identidade visual e os componentes reutilizáveis previstos na issue #37 para reduzir inconsistências durante a implementação.

## Atividades
- Definir tokens de cor, tipografia, espaçamento, bordas, elevação e ícones.
- Especificar botões, campos, avatares, badges/etiquetas, modais, menus e indicadores de estado.
- Documentar estados padrão, hover, foco, pressionado, desabilitado, erro e sucesso.
- Alinhar nomes e especificações com quem implementará o frontend.

## Critério de pronto
- [x] Tokens e biblioteca de componentes documentados no arquivo de design.
- [x] Componentes base têm variantes e estados necessários descritos.
- [x] Contraste e foco visível foram verificados nos componentes interativos.
- [ ] Tech Lead/frontend confirmou que as especificações são implementáveis.

## Entregável e evidências

Base: [PR #120 integrado à main](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/120), commit `e1f6fce`; [requisitos oficiais](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md).
[Protótipo complementar HTML](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/c502f1158da2c4c7c46cc46a040ac40e51d80f22/docs/ux/prototipo-complementar-58-67.html) — baixar o arquivo pelo GitHub e abrir no navegador. Dados fictícios, sem API ou envio real. [PR #123](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/123). Verificação estática: JavaScript válido sintaticamente, IDs únicos e referências diretas presentes; execução em navegador e validação humana ainda não realizadas. A seção Componentes demonstra os estados básicos; a especificação abaixo registra os padrões para evolução, sem substituir a biblioteca existente.

**Tokens existentes:** fundo #F8F9FC; texto #202333; primário #5146E5; hover #4338CA; superfície #FFFFFF; secundária #F1F3F9; borda #E7E9F0; auxiliar #858BA0; sucesso #16A36A; perigo #E5484D. Tipografia real: Arial/Helvetica/sans-serif; tokens Geist disponíveis. [app/globals.css (L1-L89)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/globals.css#L1-L89).

**Especificação complementar:** espaçamento 4/8/12/16/24/32 px; raio 10–16 px para campos/cartões e circular para avatar/badge; elevação discreta para modal e cartões; ícones com rótulo acessível. Botão: primário/ secundário, hover, pressionado, foco e desabilitado; campo: label persistente, padrão/foco/erro/desabilitado, mensagem associada; avatar: foto ou iniciais, nome associado; badge: texto de status, não apenas cor; modal: título, cancelar/confirmar, foco inicial e retorno; menu: item atual e foco; carregamento: texto, ação bloqueada quando necessário. Estados erro/sucesso com texto e cor. Demonstração usa áreas de ação de pelo menos 44 px e foco visível.

**Contraste calculado (cores sólidas, WCAG AA texto normal: 4,5:1):** primário/branco 6,25:1; texto/fundo 14,78:1; foco/fundo 5,94:1; auxiliar/branco 3,39:1; sucesso/branco 3,24:1; perigo/branco 3,91:1. Os últimos três não atingem AA para texto normal; recomendação demonstrada: #526079 (6,35:1), #08764A (5,67:1), #B4232B (6,53:1) sobre branco. Não é auditoria de todas as combinações renderizadas. Confirmação técnica humana ainda não registrada.

## Pendências não verificadas ou externas

- Tech Lead/frontend confirmou que as especificações são implementáveis.

**Status:** issue fechada no escopo individual. A validação formal de outros integrantes não foi presumida. O demonstrador auxiliar permanece separado do aplicativo oficial e não é uma interface aprovada.
