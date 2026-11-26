# Gestão de conta, dispositivos e segurança da sessão

## 1. Objetivo e limites
Definir uma experiência compreensível para consulta de dados básicos da conta e apresentação de estados de acesso. O gerenciamento de sessões/dispositivos é uma capacidade **condicional**: só deve entrar no MVP após aprovação de Produto e confirmação de suporte técnico.

A interface nunca deve expor senha, token, cookie, chave, identificador interno de sessão ou detalhes que facilitem abuso.

## 2. Arquitetura da área
Organizar a área em seções:
1. **Minha conta:** nome, e-mail/identificador de acesso e organização, somente quando fornecidos pelo backend.
2. **Vínculo e acesso:** organização/equipe e informações de acesso não sensíveis, conforme permissões.
3. **Dispositivos e sessões:** seção opcional, exibida apenas se aprovada e suportada.
4. **Segurança e ajuda:** orientação para solicitar correção de dados ou suporte.

Distinguir dados somente leitura de campos editáveis. Não sugerir edição onde a fonte de verdade for diretório corporativo/SSO. Exibir estado de carregamento, vazio, erro e indisponibilidade.

## 3. Dados e privacidade
Dados potencialmente exibíveis: nome de exibição, e-mail corporativo ou identificador de login, organização/equipe e, se aprovado, rótulo genérico de dispositivo/navegador e última atividade.

**Nunca exibir:** senhas, tokens, cookies, segredos, chaves privadas, cabeçalhos de autenticação, fingerprints detalhados ou identificadores técnicos de sessão. Evitar IP completo e geolocalização precisa sem necessidade e aprovação explícita.

Aplicar menor privilégio, autorização no servidor, minimização de dados e trilha de auditoria para ações sensíveis. A UI não substitui controles de segurança do backend.

## 4. Lista de sessões — proposta condicional
Se Produto/Tech Lead aprovarem:
- Listar somente sessões pertencentes ao usuário autenticado.
- Identificar claramente “Este dispositivo”/“Sessão atual”.
- Mostrar descrição genérica do dispositivo, navegador/plataforma se disponível e última atividade.
- Não afirmar que uma sessão está ativa em tempo real se o backend fornecer apenas atividade recente.
- Oferecer encerramento individual e, se aprovado, encerramento de outras sessões.
- Não permitir encerrar a sessão atual por ação ambígua; logout deve ser fluxo separado.

Se não houver decisão de produto, API e autorização, ocultar a seção no MVP. Não simular que a funcionalidade está operacional.

## 5. Fluxos e confirmações
### Logout da sessão atual
1. Usuário aciona “Sair da conta”.
2. Exibir confirmação com consequência explícita.
3. Ao confirmar, solicitar logout ao serviço de autenticação.
4. Em sucesso, limpar estado local conforme implementação e encaminhar para login.
5. Em falha, informar que não foi possível concluir e orientar nova tentativa sem revelar detalhes técnicos.

Microcopy:
- Confirmação: “Deseja sair deste dispositivo? Será necessário entrar novamente para acessar o CallZUP.”
- Sucesso: “Você saiu da sua conta.”
- Falha: “Não foi possível sair agora. Tente novamente.”

### Encerrar outra sessão (condicional)
1. Ação contextual “Encerrar sessão”.
2. Confirmação identifica a sessão por rótulo amigável, sem expor identificadores internos.
3. Explicar que o dispositivo selecionado precisará autenticar novamente.
4. Confirmar somente após resposta positiva do usuário.
5. Exibir sucesso ou falha; atualizar lista apenas após confirmação do servidor.

Microcopy:
- Confirmação: “Encerrar a sessão deste dispositivo? A pessoa que estiver usando-o precisará entrar novamente.”
- Sucesso: “Sessão encerrada.”
- Falha: “Não foi possível encerrar esta sessão. Atualize a lista e tente novamente.”

## 6. Estados de acesso
| Estado | Mensagem sugerida | Ação |
|---|---|---|
| Sessão ativa | “Sua conta está conectada.” | Uso normal |
| Sessão expirada | “Sua sessão expirou. Entre novamente para continuar.” | Ir para login |
| Acesso bloqueado | “Seu acesso está indisponível. Procure o suporte ou administrador da sua organização.” | Orientação de suporte |
| Conta sem permissão | “Você não tem permissão para alterar esta informação.” | Manter leitura/explicar canal |
| Falha ao carregar | “Não foi possível carregar os dados da conta. Tente novamente.” | Repetir |
| Ação em andamento | “Processando…” | Desabilitar ação duplicada |
| Ação concluída | Mensagem de sucesso correspondente | Atualizar estado |
| Falha na ação | Mensagem objetiva, sem código interno | Manter contexto e permitir tentar novamente |

Não revelar se uma conta existe, por que uma autenticação falhou ou detalhes que ajudem enumeração de usuários. Mensagens de login devem seguir o padrão de segurança do serviço de identidade.

## 7. Permissões e proteção contra erro
- A API deve verificar autorização em toda leitura/alteração; esconder botão não é controle de segurança.
- Ações devem ser protegidas contra duplo clique.
- Confirmar ações que encerram acesso; não pedir confirmação para simples navegação.
- Não permitir que um usuário consulte ou encerre sessões de terceiros.
- Após expiração ou bloqueio, não manter dados sensíveis visíveis em telas compartilhadas; seguir política de limpeza definida pelo produto.
- Registrar eventos de segurança no backend sem mostrar conteúdo sensível ao usuário.

## 8. Responsividade e acessibilidade
- Celular: seções em cartões/uma coluna; ações com rótulos claros e alvos de toque confortáveis; confirmação adaptada à tela.
- Tablet: conteúdo central com largura legível; lista de sessões em cartões ou tabela simplificada.
- Desktop: seções agrupadas em coluna principal; lista tabular somente se houver espaço.
- Não depender de hover; foco de teclado visível; diálogo com foco gerenciado e retorno de foco.
- Estados comunicados por texto e ícone, não apenas cor; suporte a zoom e leitores de tela.
- Evitar exibir informações sensíveis em notificações/toasts persistentes.

## 9. Protótipo e cenários
O protótipo 09-conta-seguranca-prototype.html demonstra resumo de conta com dados fictícios, lista condicional de sessões, distinção da sessão atual, confirmação antes de encerrar uma sessão demonstrativa, logout demonstrativo e estados simulados.

O protótipo não autentica, não consulta dispositivos reais, não encerra sessões no servidor e não persiste alterações. As ações são demonstrações locais para discutir fluxo e microcopy.

## 10. Critérios de aceite de UX
- [x] Estrutura da área de conta e dados potencialmente exibidos documentados.
- [x] Regras de privacidade e informações que nunca devem aparecer especificadas.
- [x] Fluxo de logout e fluxo condicional de encerramento de outra sessão documentados.
- [x] Estados de sessão expirada, bloqueio, falha e ausência de permissão documentados.
- [x] Protótipo demonstrativo entregue.
- [ ] Produto/Tech Lead aprovarem se gestão de sessões/dispositivos entra no MVP.
- [ ] Engenharia confirmar fonte dos dados, API, autorização, auditoria e comportamento de revogação.
- [ ] Política de identidade/SSO e mensagens de bloqueio confirmadas com responsáveis.

## 11. Decisões pendentes
| Decisão | Responsável sugerido | Padrão seguro até decisão |
|---|---|---|
| Exibir sessões/dispositivos? | PO + Tech Lead | Fora do MVP; seção não exibida |
| Quais metadados da sessão? | Segurança + Tech Lead | Somente rótulo genérico e última atividade, se disponíveis |
| Encerrar uma ou todas as outras sessões? | PO + Segurança | Não oferecer ação até aprovação |
| Edição de nome/e-mail/organização? | PO + identidade/SSO | Somente leitura |
| Canal de suporte para acesso bloqueado? | PO/Operações | Mensagem genérica sem inventar contato |

## 12. Relação com backlog
Complementa #39, #27 e #71. Não substitui o perfil comercial #64. Alinhar estados e navegação com a experiência responsiva #76.
