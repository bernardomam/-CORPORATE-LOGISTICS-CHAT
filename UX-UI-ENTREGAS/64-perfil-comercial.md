# Issue #64 — Projetar perfil comercial e informações de atendimento

**Projeto:** CallZUP · **Data de consolidação:** 25/11/2026 · **Fonte:** [Issue #64](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/issues/64)

> Registro individual da entrega UX/UI. As evidências e propostas foram consolidadas das descrições das issues; o aplicativo oficial não foi redesenhado. O status de fechamento da issue não comprova, por si só, todos os critérios originais.

## Objetivo
Definir uma experiência para empresas apresentarem informações úteis ao contato, ampliando o cadastro/perfil de empresa previsto na issue #40.

## Atividades
- Propor campos para nome comercial, descrição, endereço, horário de funcionamento e canais de contato.
- Definir visualização pública/interna e estados para dados ausentes ou empresa fechada.
- Alinhar quais campos são obrigatórios e quem pode editá-los com o PO.

## Critério de pronto
- [x] Fluxos de visualizar e editar perfil estão prototipados.
- [x] Campos, validações e estados vazios estão especificados.
- [ ] Regras de visibilidade e edição foram validadas com PO/Tech Lead.
- [x] Layout responsivo revisado.

## Entregável e evidências

Base: [PR #120 integrado à main](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/120), commit `e1f6fce`; [requisitos oficiais](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/docs/markdown/CallZUP_Projeto_A3_Requisitos_e_Diagramas.md).
[Protótipo complementar HTML](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/c502f1158da2c4c7c46cc46a040ac40e51d80f22/docs/ux/prototipo-complementar-58-67.html) — baixar o arquivo pelo GitHub e abrir no navegador. Dados fictícios, sem API ou envio real. [PR #123](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/pull/123). Verificação estática: JavaScript válido sintaticamente, IDs únicos e referências diretas presentes; execução em navegador e validação humana ainda não realizadas.

**Conceito pós-MVP:** Perfil → perfil comercial → visualizar → editar como responsável (simulação) → salvar ou cancelar. Nome comercial obrigatório (até 100 caracteres); descrição opcional (até 300); endereço, horário e e-mail opcional (validação HTML de formato). Dados ausentes aparecem como “Não informado”. Horário de atendimento não altera bloqueio de sessão 8h–18h. Estado de empresa fechada/fora do horário deve ser mostrado com texto e horário de retorno, sem permitir comunicação fora das regras de acesso. Visibilidade proposta: apenas empresa própria; edição somente TI/responsável autorizado, sem exposição externa, até decisão formal. Campo de horário ainda é texto livre na demonstração; validação semântica de horário a definir na implementação.

O perfil real é de funcionário: [app/perfil/page.tsx (L12-L26)](https://github.com/bernardomam/-CORPORATE-LOGISTICS-CHAT/blob/e1f6fceba560a8ab7a514780270ec0a871cb2ca4/app/perfil/page.tsx#L12-L26). A estrutura responsiva do conceito é declarada em CSS, mas não testada em navegador. Permissões e validação humana não confirmadas.

## Resultados de teste relatados

O responsável relatou ter aberto a seção Empresa, editado e salvo os dados e verificado o funcionamento no formato celular, sem problemas funcionais reportados. Trata-se de dados locais fictícios no demonstrador HTML, não integração com API. Revisão responsiva registrada por relato do responsável; avaliação visual geral negativa, sem aprovação de design. Permissões continuam sujeitas a validação externa.

## Pendências não verificadas ou externas

- Regras de visibilidade e edição foram validadas com PO/Tech Lead.

**Status:** issue fechada no escopo individual. A validação formal de outros integrantes não foi presumida. O demonstrador auxiliar permanece separado do aplicativo oficial e não é uma interface aprovada.
