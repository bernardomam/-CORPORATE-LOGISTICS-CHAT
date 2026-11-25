# Issue #67 — Projetar preferências de aparência, respostas rápidas e ausência automática

**Projeto:** CallZUP · **Data de consolidação:** 25/11/2026 · **Fonte:** [Issue #67](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/67)

> Registro individual da entrega UX/UI. As evidências e propostas foram consolidadas das descrições das issues; o aplicativo oficial não foi redesenhado. O status de fechamento da issue não comprova, por si só, todos os critérios originais.

## Objetivo
Definir uma experiência coerente para preferências de interface e automações simples de atendimento, como evolução futura do chat corporativo.

## Atividades
- Projetar alternância entre tema claro/escuro e opção de seguir a preferência do sistema.
- Propor gerenciamento de respostas rápidas com atalho, conteúdo e pré-visualização antes do envio.
- Propor configuração de mensagem de ausência, horário/agenda e prévia do texto enviado.
- Diferenciar claramente mensagem automática de mensagem escrita manualmente e permitir revisar as configurações.

## Critério de pronto
- [x] Protótipo mostra tema claro/escuro e estados persistidos da preferência.
- [x] Fluxo de criar, editar e inserir resposta rápida está documentado.
- [x] Fluxo de configurar e pré-visualizar mensagem de ausência está documentado.
- [ ] PO priorizou os recursos e Tech Lead avaliou dependências; itens fora do MVP ficam identificados.

## Entregável e evidências

Base: [PR #120 integrado à main](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/120), commit `e1f6fce`; [requisitos oficiais](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md).
[Protótipo complementar HTML](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/c502f1158da2c4c7c46cc46a040ac40e51d80f22/docs/ux/prototipo-complementar-58-67.html) — baixar o arquivo pelo GitHub e abrir no navegador. Dados fictícios, sem API ou envio real. [PR #123](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/123). Verificação estática: JavaScript válido sintaticamente, IDs únicos e referências diretas presentes; execução em navegador e validação humana ainda não realizadas.

**Aparência:** Preferências → Claro/Escuro/Sistema; o protótipo usa CSS e armazenamento local com fallback de sessão. Se armazenamento for indisponível, aviso explícito; persistência real após recarregar ainda precisa de teste em navegador. **Resposta rápida:** cadastrar/editar atalho iniciado por /, conteúdo obrigatório (até 300 caracteres), prévia atualizada, salvar localmente, inserir no rascunho e revisar antes de enviar. **Ausência:** ativar/desativar, configurar início/fim e texto, prévia com indicação “Automática”, salvar localmente; valida intervalo dentro de 8h–18h, sem executar envio automático. Mensagem automática deve ser distinguível do texto manual; bloqueio de horário prevalece.

**Escopo:** tema e automações não estão confirmados nos requisitos atuais ([docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md (L25-L59)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md#L25-L59)); propostas de evolução. Nenhuma automação comercial foi incorporada ao app nem disparada. Priorização e dependências técnicas não confirmadas pela equipe.

## Pendências não verificadas ou externas

- PO priorizou os recursos e Tech Lead avaliou dependências; itens fora do MVP ficam identificados.

**Status:** issue fechada no escopo individual. A validação formal de outros integrantes não foi presumida. O demonstrador auxiliar permanece separado do aplicativo oficial e não é uma interface aprovada.
