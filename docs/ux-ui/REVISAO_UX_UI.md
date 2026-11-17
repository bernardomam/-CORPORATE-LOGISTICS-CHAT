# CallZUP — revisão de UX/UI e plano de refinamento

**Base analisada:** branch `main`, em 17/11/2026.  
**Escopo:** leitura do frontend existente e refinamentos seguros de interface.  
**Limite da revisão:** esta avaliação foi feita pelo código-fonte; não equivale a teste visual em navegador, teste com usuários ou validação de integração com backend.

## 1. Resumo executivo

O CallZUP já possui uma primeira camada de interface: splash, login, lista de conversas, chat, grupos, solicitação de conversa privada, solicitações administrativas, perfil e painel de TI. A identidade visual usa azul/índigo, superfícies claras, cantos arredondados e uma navegação adaptada para mobile.

A recomendação é **evoluir a interface existente, não recomeçar do zero**. O trabalho mais valioso agora é consolidar a experiência, corrigir problemas de responsividade e acessibilidade e separar claramente o que é protótipo local do que já está integrado.

## 2. O que já existe no frontend

| Área | Estado observado no código | Observação de UX |
|---|---|---|
| Splash | Implementada | Identidade visual e CTA para login. |
| Login | Implementado visualmente | O formulário ainda não envia credenciais ao backend; o CTA navega para conversas. |
| Conversas | Implementada | Busca e filtros funcionam sobre uma lista estática. |
| Chat | Implementado como protótipo | Mensagens e estados de entrega são locais/simulados; anexos não são persistidos. |
| Grupos | Implementada | Lista fixa; solicitação apenas mostra confirmação local. |
| Solicitação privada | Implementada | Seleção e status são mantidos em estado local. |
| Solicitações TI | Implementada | Aprovação/rejeição altera somente o estado local. |
| Perfil | Parcial | Não havia conteúdo de perfil utilizável; foi incluído um estado informativo e acesso ao suporte. |
| Painel TI | Implementado como protótipo | Usuários e grupos são mantidos em estado local; não há persistência na API. |

## 3. Refinamentos incluídos nesta entrega

- **Navegação:** barra inferior no mobile e sidebar de 16rem no desktop, com estado ativo mais claro, rótulo acessível e seletor de perfil de teste oculto em produção.
- **Layout desktop:** área de conteúdo passa a respeitar o espaço reservado à sidebar, evitando centralização sob a navegação.
- **Login:** rótulos visíveis e associados aos campos, autocomplete apropriado, melhor hierarquia e área de formulário mais clara. A autenticação real permanece pendente.
- **Perfil:** substituição da tela quase vazia por um estado de disponibilidade transparente, sem fingir que edição de perfil já funciona, e atalho para suporte.
- **Chat:** largura melhor aproveitada em desktop, áreas clicáveis maiores, nomes acessíveis para controles, anúncio de erros e estado de envio desabilitado quando não há texto.
- **Acessibilidade global:** foco de teclado visível e respeito à preferência de movimento reduzido.
- **Estilos globais:** removido o escurecimento automático isolado que alterava variáveis sem oferecer um tema escuro consistente em todas as telas. Tema escuro completo continua como trabalho futuro.

## 4. Problemas e riscos que continuam abertos

### P0 — Antes de apresentar como produto funcional

1. **Autenticação:** integrar o formulário de login à API, tratar carregamento/erro/sucesso e impedir acesso indevido a rotas privadas. Hoje o CTA do login leva diretamente à lista de conversas.
2. **Persistência do chat:** carregar e enviar mensagens pela API; substituir status simulados por confirmações reais do servidor.
3. **Dados e permissões:** conectar painel TI, grupos e solicitações aos endpoints reais; garantir autorização por empresa e papel no backend.
4. **Deploy e build:** executar build, lint e smoke tests no ambiente de integração contínua e corrigir falhas antes do merge.

### P1 — Qualidade de experiência

5. Criar estados padronizados de carregamento, vazio, erro, sem permissão e sucesso para todas as telas.
6. Definir navegação e layout responsivos para larguras de 320px, 375px, 768px, 1024px e desktop amplo.
7. Revisar contraste, foco, ordem de tabulação, mensagens para leitores de tela e alvos de toque.
8. Validar se o menu e os itens disponíveis mudam de acordo com o perfil autenticado real — não por um seletor local de teste.
9. Definir padrões de data/hora, estados online/offline e confirmação de ações destrutivas.

### P2 — Evolução do produto

10. Completar perfil e preferências de conta.
11. Avaliar etiquetas, respostas rápidas, mensagem de ausência e catálogo, conforme prioridade do MVP.
12. Definir tema claro/escuro de ponta a ponta, com preferência persistida e contraste validado.
13. Conduzir testes de usabilidade com pessoas que representem a rotina logística.

## 5. Critérios mínimos de Design QA

- [ ] Layout validado em mobile, tablet e desktop.
- [ ] Navegação por teclado sem armadilhas; foco sempre visível.
- [ ] Contraste de texto e controles revisado.
- [ ] Inputs com rótulos persistentes e mensagens de erro associadas.
- [ ] Botões com estados padrão, hover, foco, pressionado e desabilitado.
- [ ] Todas as telas possuem estados de carregamento, vazio, erro e sucesso quando aplicável.
- [ ] Ações críticas pedem confirmação e comunicam o resultado.
- [ ] Conteúdo não depende exclusivamente de cor ou ícone.
- [ ] Nenhuma ferramenta de teste aparece em produção.
- [ ] Protótipo local está identificado como protótipo e não como integração concluída.

## 6. Próxima sequência recomendada

1. Integrar e validar autenticação/controle de acesso com backend.
2. Integrar conversas e mensagens com persistência real.
3. Consolidar componentes e tokens visuais em um Design System documentado.
4. Completar perfil, grupos e solicitações com dados reais.
5. Fazer uma rodada de Design QA em navegadores e dispositivos reais.
6. Rodar testes de usabilidade e priorizar ajustes com base nas evidências.

## 7. Arquivos tocados nesta entrega

- `app/globals.css`
- `app/comp/BarraInferior.tsx`
- `app/login/page.tsx`
- `app/perfil/page.tsx`
- `app/chat/[id]/ChatCliente.tsx`
- `docs/ux-ui/REVISAO_UX_UI.md`

**Importante:** esta entrega não altera a branch principal, não substitui a integração de backend e não fecha issues automaticamente. O conteúdo deve passar por revisão da equipe antes de ser incorporado em `main`.
