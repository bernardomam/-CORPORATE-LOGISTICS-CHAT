# Issue #59 — Evoluir o protótipo navegável dos fluxos principais

**Projeto:** CallZUP · **Data de consolidação:** 25/11/2026 · **Fonte:** [Issue #59](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/59)

> Registro individual da entrega UX/UI. As evidências e propostas foram consolidadas das descrições das issues; o aplicativo oficial não foi redesenhado. O status de fechamento da issue não comprova, por si só, todos os critérios originais.

## Objetivo
Transformar a proposta visual da issue #56 em um protótipo navegável, cobrindo a estrutura existente de login, navegação, conversas, grupos e solicitações.

## Atividades
- Conectar as telas por meio dos fluxos mais frequentes.
- Demonstrar iniciar conversa, abrir histórico, consultar grupo e acessar uma solicitação relacionada.
- Incluir estados de interação, erros e confirmação de ações importantes.
- Revisar a experiência mobile-first e os pontos de adaptação para desktop.

## Critério de pronto
- [x] Protótipo navegável compartilhado e ligado à issue.
- [ ] Fluxos prioritários podem ser percorridos sem orientação verbal.
- [x] Estados de erro, vazio, carregamento e sucesso estão representados.
- [ ] PO e Tech Lead revisaram o protótipo e registraram ajustes ou aprovação.

## Entregável e evidências

Base: [PR #120 integrado à main](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/120), commit `e1f6fce`; [requisitos oficiais](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md).
[Protótipo complementar HTML](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/c502f1158da2c4c7c46cc46a040ac40e51d80f22/docs/ux/prototipo-complementar-58-67.html) — baixar o arquivo pelo GitHub e abrir no navegador. Dados fictícios, sem API ou envio real. [PR #123](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/123). Verificação estática: JavaScript válido sintaticamente, IDs únicos e referências diretas presentes; execução em navegador e validação humana ainda não realizadas.

**Roteiro navegável:** Login → Conversas → abrir contato → escrever/enviar texto → voltar; Grupos → Operação do CD → chat em grupo; Solicitações → consultar estado → ação de TI com confirmação; Perfil → informações do funcionário. Botões de simulação cobrem login inválido, horário bloqueado, lista vazia, carregamento, erro com nova tentativa, histórico vazio, falha/reconexão, envio e confirmação. A navegação usa controles rotulados e layout responsivo (grade no desktop, coluna em largura estreita).

**Base real:** [app/comp/BarraInferior.tsx (L122-L174)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/comp/BarraInferior.tsx#L122-L174); [app/conversas/page.tsx (L218-L315)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/conversas/page.tsx#L218-L315); [app/chat/[id]/ChatCliente.tsx (L301-L358)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/chat/[id]/ChatCliente.tsx#L301-L358). O protótipo não substitui as telas existentes. Percurso completo sem orientação e revisão humana ainda não testados.

## Resultados de teste relatados

O responsável relatou ter executado entrada com dados fictícios, abertura e envio em conversa, abertura de grupo, acesso a solicitações e perfil, simulação de erro e retorno à navegação normal. Nenhum problema funcional reportado. Avaliação qualitativa do demonstrador: aparência pouco agradável, navegação confusa, excesso de texto e baixa facilidade de uso. O teste foi guiado por checklist; não comprova uso independente nem aprovação de usabilidade. Não se refere à interface oficial da main.

## Encerramento registrado

O responsável informou que outro integrante da equipe já realizou o trabalho de UX/UI e a revisão correspondente, e autorizou considerar esta tarefa concluída no seu escopo individual para evitar duplicidade. O grupo relatou que a interface está praticamente concluída e revisada, com uma página ainda pendente de identificação. Foram apresentadas capturas das telas oficiais de conversas e grupos em celular; o percurso completo independente não foi verificado diretamente.

O acesso autenticado do responsável está temporariamente impedido por falta de credenciais disponíveis. Os critérios originais ainda sem evidência individual permanecem desmarcados; não se presume aprovação do PO/Tech Lead/SQA nem conformidade integral de acessibilidade. O encerramento registra a conclusão da responsabilidade individual conforme relato da equipe, não uma certificação de todos os fluxos. As telas oficiais permanecem inalteradas.

## Pendências não verificadas ou externas

- Fluxos prioritários podem ser percorridos sem orientação verbal.
- PO e Tech Lead revisaram o protótipo e registraram ajustes ou aprovação.

**Status:** issue fechada no escopo individual. A validação formal de outros integrantes não foi presumida. O demonstrador auxiliar permanece separado do aplicativo oficial e não é uma interface aprovada.
