# Testes de usabilidade com operadores logísticos — plano de pesquisa

## Objetivo e perguntas
Avaliar se profissionais de operação logística conseguem localizar conversas, comunicar divergências e acompanhar ocorrências com clareza e segurança. Complementa #58 (jornadas) e #61 (acessibilidade), sem refazer esses entregáveis.

Perguntas:
1. Encontram a conversa operacional correta?
2. Entendem como comunicar divergência e quais dados incluir?
3. Localizam ocorrência, interpretam status e próximo passo?
4. Reconhecem estados de envio, erro e confirmação?
5. Quais termos/controles geram hesitação ou erro?

## Perfis e amostra
Rodada exploratória sugerida: 3–5 voluntários, buscando:
- Operador(a) logístico(a), com experiência de execução diária.
- Supervisor(a), com acompanhamento de equipe e exceções.
- Gestor(a) de unidade/CD, com visão de operação e escalonamento.

A amostra é qualitativa, não estatisticamente representativa. Usar códigos P01, P02 etc. Registrar apenas perfil amplo e familiaridade autodeclarada. Não coletar nome, telefone, matrícula, empresa, rota real ou dados confidenciais.

## Método e duração
Sessão individual moderada, presencial ou remota, com protótipo navegável; 25–35 minutos. Pedir que a pessoa pense em voz alta. Não ensinar a solução durante a tarefa; registrar ajuda necessária. Fazer piloto interno para verificar roteiro, sem contar piloto como participante representativo. Gravação é opcional e exige consentimento específico; preferir notas anonimizadas.

## Preparação
- [ ] Confirmar participantes e perfis gerais.
- [ ] Confirmar participação voluntária e consentimento para anotações.
- [ ] Selecionar versão do protótipo e verificar links/estados.
- [ ] Preparar dados fictícios, nunca dados reais da operação.
- [ ] Testar ambiente, compartilhamento de tela e cronômetro.
- [ ] Preparar ficha e definir moderador/observador.
- [ ] Se houver gravação, obter autorização separada e explicar uso/retensão.
- [ ] Explicar que o produto está sendo avaliado, não a pessoa.

## Abertura do moderador
“Obrigado por participar. Vamos observar como a interface funciona em algumas situações de rotina logística. Não estamos avaliando você; queremos descobrir o que está claro e o que precisa melhorar. Diga o que está procurando e o que espera que aconteça. Você pode parar a qualquer momento. Usaremos dados fictícios e registraremos observações sem identificar você.”

Pergunta inicial: “Qual é, em linhas gerais, sua função na operação e com que frequência utiliza ferramentas digitais para se comunicar ou acompanhar tarefas?” Não pedir nome, empresa ou detalhes confidenciais.

## Roteiro de tarefas
### 1 — Localizar uma conversa
Cenário: “Você precisa encontrar a conversa da equipe responsável por uma operação em andamento. Localize a conversa indicada no cenário.”
Sucesso: abre a conversa correta sem ajuda.
Observar: ponto de entrada, compreensão dos nomes/indicadores, tentativas, retorno, tempo aproximado e ajuda solicitada.
Perguntas neutras: “O que você esperava encontrar aqui?”; “Como decidiu abrir essa conversa?”

### 2 — Comunicar divergência de estoque
Cenário: “Durante a conferência, você percebeu uma diferença entre a quantidade registrada e a quantidade encontrada. Mostre como comunicaria isso à equipe responsável usando os dados fictícios.”
Sucesso: encontra o fluxo e identifica dados necessários. Se protótipo não permitir envio real, registrar apenas conclusão do fluxo demonstrativo, não envio real.
Observar: ponto de entrada, campos, linguagem, anexos, revisão, confirmação e prevenção de envio duplicado.
Perguntas: “Há alguma informação que você esperaria incluir?”; “O que indica que sua mensagem foi enviada?”

### 3 — Acompanhar uma ocorrência
Cenário: “Uma ocorrência foi registrada anteriormente. Encontre-a, explique em que situação está e o que entende que acontece em seguida.”
Sucesso: localiza ocorrência, identifica status/histórico e explica próximo passo apresentado, sem ajuda.
Observar: localização, significado dos status, sequência temporal, responsável e ações disponíveis.
Perguntas: “O que esse status significa para você?”; “O que faria depois?”

## Encerramento
- “Qual tarefa foi mais simples? Por quê?”
- “Em qual momento teve mais dúvida?”
- “Faltou alguma informação importante?”
- “O que mudaria primeiro?”
- “Algo poderia causar erro na rotina real?”

Não induzir respostas nem pedir aprovação da interface.

## Métricas e ficha
Para cada tarefa: conclusão (sem ajuda / com ajuda / não concluída), tempo aproximado, erros, tentativas, ajuda, hesitações, comentários anonimizados e confiança autodeclarada opcional (baixa/média/alta). Separar observação de interpretação.

| Campo | Registro |
|---|---|
| Código | P01 |
| Perfil amplo | Operador / Supervisor / Gestor |
| Familiaridade | Baixa / média / alta (autodeclarada) |
| Tarefa | 1 / 2 / 3 |
| Resultado | Sem ajuda / com ajuda / não concluída |
| Tempo aproximado | |
| Erro ou hesitação observada | |
| Comentário anonimizado | |
| Ajuda necessária | |
| Evidência sem dado pessoal | |

## Severidade e síntese
- **Crítico:** impede tarefa essencial ou cria risco operacional/privacidade.
- **Alto:** causa erro provável, bloqueio ou interpretação incorreta importante.
- **Médio:** gera esforço/hesitação, mas há alternativa.
- **Baixo:** ajuste de clareza ou acabamento.

Cada achado deve conter ID, tarefa, observação, evidência anonimizada, n/N participantes (somente sessões realizadas), severidade, impacto, recomendação, dependência técnica e responsável. Em amostra pequena, não generalizar frequência.

Após as sessões: agrupar problemas; separar observação de interpretação; priorizar por severidade, frequência observada e impacto; propor mudança verificável; registrar dependências; apresentar ao PO e UX/UI.

Modelo de achado:
- ID/título:
- Tarefa:
- Evidência anonimizada:
- Participantes afetados: n/N:
- Severidade/impacto:
- Recomendação:
- Responsável sugerido:
- Decisão PO/UX:
- Estado: proposto / aceito / descartado / em implementação / retestado.

## Estado e impedimento
**Preparado:** objetivo, perguntas, perfis, amostra sugerida, roteiro, tarefas, métricas, ficha, severidade, privacidade e síntese.

**Não realizado:** recrutamento, consentimento, sessões com usuários reais, observações, evidências e validação de melhorias. Não foram disponibilizados participantes nem agenda/ambiente de pesquisa nesta tarefa.

**Próxima ação:** PO/Operações indicar 3–5 voluntários e responsável pelo agendamento; UX/UI conduzir sessões e preencher fichas. Se não houver participantes, manter o plano pronto e registrar o impedimento, sem fabricar resultados.

## Critérios de aceite e status
- [x] Roteiro e perfis documentados.
- [x] Método, tarefas e critérios de observação definidos.
- [x] Ficha anonimizada e classificação de achados preparadas.
- [x] Plano de síntese e devolutiva ao PO documentado.
- [x] Impedimento sem participantes reais registrado.
- [ ] Participantes recrutados e sessões realizadas.
- [ ] Achados reais com evidências anonimizadas documentados.
- [ ] Recomendações revisadas com PO e UX/UI.

## Relação com backlog
Complementa #58 e #61. Os cenários abrangem conversa, comunicação operacional e ocorrência, sem duplicar mapa de jornadas ou checklist de acessibilidade.