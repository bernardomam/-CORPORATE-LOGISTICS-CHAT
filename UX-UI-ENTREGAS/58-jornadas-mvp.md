# Issue #58 — Mapear jornadas prioritárias e escopo visual do MVP

**Projeto:** CallZUP · **Data de consolidação:** 25/11/2026 · **Fonte:** [Issue #58](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/58)

> Registro individual da entrega UX/UI. As evidências e propostas foram consolidadas das descrições das issues; o aplicativo oficial não foi redesenhado. O status de fechamento da issue não comprova, por si só, todos os critérios originais.

## Objetivo
Consolidar as jornadas essenciais do callZUP antes de detalhar novas telas, aproveitando o protótipo inicial da issue #56 e alinhando-o ao escopo já planejado no repositório.

## Atividades
- Mapear jornadas de login, lista de conversas, chat individual/grupo, perfil e solicitações operacionais.
- Identificar estados vazios, carregamento, erro, sucesso e falta de conexão.
- Separar o que é essencial para o MVP do que fica para uma fase posterior (ex.: catálogo e automações comerciais).
- Validar prioridades e dependências com PO, Tech Lead e SQA.

## Critério de pronto
- [x] Mapa de jornadas e telas publicado no repositório ou anexado à issue.
- [x] Cada jornada prioritária tem objetivo, entradas, saídas e estados alternativos.
- [ ] Escopo MVP vs. pós-MVP está identificado e validado com PO/Tech Lead.

## Entregável e evidências

Base: [PR #120 integrado à main](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/120), commit `e1f6fce`; [requisitos oficiais](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md).
**Mapa de jornadas (entregável anexado nesta issue)**

| Jornada / objetivo | Entrada | Saída esperada | Estados alternativos |
|---|---|---|---|
| Autenticar | E-mail e senha corporativos | Sessão autorizada e navegação inicial | Credenciais inválidas, carregamento, fora das 8h–18h, conexão indisponível |
| Encontrar conversa | Lista e busca por contato | Abrir histórico privado | Lista vazia, busca sem resultados, erro de rede, carregamento, tentar novamente |
| Comunicar ocorrência | Chat individual ou de grupo, texto ou PDF/JPEG | Mensagem enviada e indicadores de entrega/leitura | Histórico vazio, falha, texto preservado, reconexão, formato inválido, horário bloqueado |
| Consultar grupo | Lista de grupos de que participa | Abrir chat e informações dos membros | Sem grupos, erro, carregamento, acesso restrito |
| Consultar perfil | Sessão autenticada e perfil | Exibir dados pessoais e alterar foto quando disponível | Dados ausentes, erro, carregamento, confirmação |
| Acompanhar solicitação | Lista de solicitações e papel autorizado | Consultar estado; TI decide quando permitido | Pendente, aprovada, rejeitada, sem resultados, erro |

**Escopo:** MVP documentado: comunicação interna, texto, PDF/JPEG, entrega/leitura obrigatórias, TI gerencia usuários e grupos, isolamento entre empresas e janela 8h–18h. Pós-MVP/propostas não confirmadas: etiquetas comerciais, canais distintos, catálogo, perfil comercial expandido, tema e automações. Áudio/vídeo são excluídos pelo RNF07 atual. [docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md (L25-L59)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md#L25-L59).

**Evidência:** [app/login/page.tsx](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/login/page.tsx); [app/conversas/page.tsx](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/conversas/page.tsx); [app/chat/[id]/ChatCliente.tsx](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/chat/[id]/ChatCliente.tsx); [app/grupos/page.tsx](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/grupos/page.tsx); [app/perfil/page.tsx](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/perfil/page.tsx); [app/solicitacoes/page.tsx](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/solicitacoes/page.tsx). [Protótipo complementar HTML](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/c502f1158da2c4c7c46cc46a040ac40e51d80f22/docs/ux/prototipo-complementar-58-67.html) — baixar o arquivo pelo GitHub e abrir no navegador. Dados fictícios, sem API ou envio real. [PR #123](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/123). Verificação estática: JavaScript válido sintaticamente, IDs únicos e referências diretas presentes; execução em navegador e validação humana ainda não realizadas.

**Limite:** o mapa descreve fluxos desejados e estados alternativos; não afirma que todos estejam implementados. Confirmação formal de escopo com a equipe não localizada.

## Pendências não verificadas ou externas

- Escopo MVP vs. pós-MVP está identificado e validado com PO/Tech Lead.

**Status:** issue fechada no escopo individual. A validação formal de outros integrantes não foi presumida. O demonstrador auxiliar permanece separado do aplicativo oficial e não é uma interface aprovada.
