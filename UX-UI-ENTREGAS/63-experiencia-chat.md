# Issue #63 — Especificar experiência do chat e ações contextuais

**Projeto:** CallZUP · **Data de consolidação:** 25/11/2026 · **Fonte:** [Issue #63](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/63)

> Registro individual da entrega UX/UI. As evidências e propostas foram consolidadas das descrições das issues; o aplicativo oficial não foi redesenhado. O status de fechamento da issue não comprova, por si só, todos os critérios originais.

## Objetivo
Detalhar a experiência de conversa individual e em grupo, conectada ao envio/histórico de mensagens já previsto na issue #30 e à atualização em tempo real da #31.

## Atividades
- Projetar composição e envio de mensagem, timestamps, não lidas, falha de envio e tentativa novamente.
- Definir apresentação de anexos e referências operacionais, se incluídas no escopo do MVP.
- Especificar menu de ações e confirmação para operações destrutivas.
- Mapear comportamentos em reconexão e quando o histórico está vazio.

## Critério de pronto
- [x] Protótipo contempla chat individual e grupo com estados principais.
- [x] Estados de envio, falha, reconexão e não lidas estão descritos.
- [x] Ações têm rótulos claros e confirmação quando necessário.
- [ ] Especificação revisada com Tech Lead e SQA.

## Entregável e evidências

Base: [PR #120 integrado à main](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/120), commit `e1f6fce`; [requisitos oficiais](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md).
[Protótipo complementar HTML](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/c502f1158da2c4c7c46cc46a040ac40e51d80f22/docs/ux/prototipo-complementar-58-67.html) — baixar o arquivo pelo GitHub e abrir no navegador. Dados fictícios, sem API ou envio real. [PR #123](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/123). Verificação estática: JavaScript válido sintaticamente, IDs únicos e referências diretas presentes; execução em navegador e validação humana ainda não realizadas.

**Fluxos:** abrir chat privado/grupo → digitar → enviar → mostrar status textual; responder → prévia da resposta → cancelar ou enviar; anexar → selecionar PDF/JPEG → rejeitar formato não autorizado; simular histórico vazio, falha de envio, offline, reconectar e nova tentativa. Rascunho é preservado em falha. Leitura é simulada com texto, não somente cor. Ações destrutivas não estão propostas no chat atual; nas solicitações, aprovar/rejeitar abre confirmação e opção de cancelar. Indicadores de entrega/leitura devem permanecer obrigatórios (RF10–12).

**Evidência real:** [app/chat/[id]/ChatCliente.tsx (L301-L358)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/chat/[id]/ChatCliente.tsx#L301-L358) (envio, falha, horário, upload ainda dependente do servidor); [app/chat/[id]/ChatCliente.tsx (L578-L709)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/chat/[id]/ChatCliente.tsx#L578-L709) (histórico, status, reação/resposta); [app/chat/[id]/ChatCliente.tsx (L765-L804)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/chat/[id]/ChatCliente.tsx#L765-L804) (composição/anexo). Não afirmar upload funcional, sincronização, reconexão automática ou indicadores corretos sem testes. Revisão humana pendente.

## Pendências não verificadas ou externas

- Especificação revisada com Tech Lead e SQA.

**Status:** issue fechada no escopo individual. A validação formal de outros integrantes não foi presumida. O demonstrador auxiliar permanece separado do aplicativo oficial e não é uma interface aprovada.
