# Issue #61 — Revisar usabilidade e acessibilidade dos fluxos essenciais

**Projeto:** CallZUP · **Data de consolidação:** 25/11/2026 · **Fonte:** [Issue #61](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/61)

> Registro individual da entrega UX/UI. As evidências e propostas foram consolidadas das descrições das issues; o aplicativo oficial não foi redesenhado. O status de fechamento da issue não comprova, por si só, todos os critérios originais.

## Objetivo
Garantir que os fluxos principais sejam compreensíveis e utilizáveis por pessoas com diferentes necessidades, antes de expandir o produto.

## Atividades
- Revisar contraste, tamanho de texto, foco por teclado, rótulos e mensagens de erro.
- Especificar nomes acessíveis para ícones e controles sem texto.
- Verificar ordem de navegação, estados de foco e uso que não dependa apenas de cor.
- Registrar problemas e recomendações priorizados para frontend e SQA.

## Critério de pronto
- [x] Checklist de acessibilidade básica aplicado às telas prioritárias.
- [x] Problemas encontrados têm evidência, severidade e recomendação.
- [ ] Componentes e fluxos não dependem exclusivamente de cor ou ícones sem rótulo.
- [ ] Recomendações foram revisadas com frontend/SQA.

## Entregável e evidências

Base: [PR #120 integrado à main](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/120), commit `e1f6fce`; [requisitos oficiais](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md).
**Checklist de acessibilidade — inspeção estática (sem navegador ou leitor de tela)**

| Verificação | Evidência / resultado | Severidade e recomendação |
|---|---|---|
| Foco visível | [app/globals.css (L79-L89)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/globals.css#L79-L89): outline global; navegação usa aria-current | Presente no código; validar teclado em execução |
| Redução de movimento | [app/globals.css (L110-L116)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/globals.css#L110-L116) | Presente; verificar aplicação nos componentes |
| Contraste | #858BA0 em branco 3,39:1; #16A36A 3,24:1; #E5484D 3,91:1; texto normal pede 4,5:1 | Alta quando usados como texto; usar tons escuros e testar combinação real |
| Rótulos persistentes | [app/login/page.tsx (L102-L133)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/login/page.tsx#L102-L133), [app/conversas/page.tsx (L209-L215)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/conversas/page.tsx#L209-L215), [app/chat/[id]/ChatCliente.tsx (L783-L794)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/chat/[id]/ChatCliente.tsx#L783-L794): inputs dependem de placeholder/label sem texto | Alta; adicionar label visível ou nome acessível explícito |
| Status do chat | [app/chat/[id]/ChatCliente.tsx (L43-L53)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/chat/[id]/ChatCliente.tsx#L43-L53): dois ticks iguais para entregue/lida, distinção por cor | Alta; incluir texto acessível de status e diferença não cromática |
| Reações | [app/chat/[id]/ChatCliente.tsx (L653-L709)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/chat/[id]/ChatCliente.tsx#L653-L709): botões com emoji; parte com title/aria-label | Média; nomes descritivos em cada botão e estados anunciados |
| Erros/carregamento | Login usa role=alert; listas mostram texto de erro/vazio/carregamento | Média; usar aria-live/role=status em atualizações assíncronas e preservar foco |
| Responsividade e alvos | Classes mobile/desktop na lista e barra; anexar/enviar têm h-10/w-10 | Média; verificar largura 320/375/768/1280 px e alvos de toque; aumentar área quando necessário |
| Teclado/modal/leitor de tela | Não executado | Pendente; testar Tab/Shift+Tab, Escape, retorno de foco e leitor de tela |

[Protótipo complementar HTML](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/c502f1158da2c4c7c46cc46a040ac40e51d80f22/docs/ux/prototipo-complementar-58-67.html) — baixar o arquivo pelo GitHub e abrir no navegador. Dados fictícios, sem API ou envio real. [PR #123](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/123). Verificação estática: JavaScript válido sintaticamente, IDs únicos e referências diretas presentes; execução em navegador e validação humana ainda não realizadas. A demonstração inclui rótulos, texto para estados, foco, aria-live e modal nativo. **Não** significa que a produção esteja corrigida ou conforme WCAG. As correções de frontend foram identificadas, não aplicadas ao app para preservar o trabalho existente; revisão humana não registrada.

## Resultados de teste relatados

O responsável relatou ter verificado destaque de foco com Tab, legibilidade e identificação dos botões no demonstrador HTML, sem problemas funcionais reportados. Este teste não substitui a auditoria do aplicativo oficial: permanecem as evidências de contraste, rótulos e status dependente de cor documentadas anteriormente. O feedback geral do demonstrador aponta excesso de texto e navegação confusa.

## Encerramento registrado

O responsável informou que outro integrante da equipe já realizou o trabalho de UX/UI e a revisão correspondente, e autorizou considerar esta tarefa concluída no seu escopo individual para evitar duplicidade. O grupo relatou que a interface está praticamente concluída e revisada, com uma página ainda pendente de identificação. A revisão anterior por outro integrante foi informada pelo responsável; a correção das ocorrências específicas de contraste, rótulos e indicadores documentadas acima não foi verificada diretamente.

O acesso autenticado do responsável está temporariamente impedido por falta de credenciais disponíveis. Os critérios originais ainda sem evidência individual permanecem desmarcados; não se presume aprovação do PO/Tech Lead/SQA nem conformidade integral de acessibilidade. O encerramento registra a conclusão da responsabilidade individual conforme relato da equipe, não uma certificação de todos os fluxos. As telas oficiais permanecem inalteradas.

## Pendências não verificadas ou externas

- Componentes e fluxos não dependem exclusivamente de cor ou ícones sem rótulo.
- Recomendações foram revisadas com frontend/SQA.

**Status:** issue fechada no escopo individual. A validação formal de outros integrantes não foi presumida. O demonstrador auxiliar permanece separado do aplicativo oficial e não é uma interface aprovada.
