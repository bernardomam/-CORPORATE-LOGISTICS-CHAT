# Experiência de anexos e compartilhamento de arquivos no chat

## 1. Objetivo e escopo

Definir uma experiência consistente para selecionar, revisar, enviar, consultar e baixar anexos em conversas do CallZUP. A proposta cobre o fluxo UX/UI e os estados necessários para que frontend e backend implementem o recurso com comportamento previsível.

**Importante:** esta entrega especifica a experiência. Não confirma que anexos fazem parte do MVP, nem define políticas técnicas que ainda dependem de Product Owner (PO), Tech Lead e segurança.

## 2. Princípios da experiência

1. **Clareza:** o usuário sempre sabe quais arquivos selecionou e em que estado cada um está.
2. **Controle:** pode remover itens antes do envio e cancelar quando o serviço suportar.
3. **Recuperação:** erros explicam o que aconteceu e oferecem um próximo passo.
4. **Privacidade:** anexos herdam as permissões da conversa; não existe compartilhamento público implícito.
5. **Resiliência:** falha em um arquivo não deve apagar o estado dos demais.
6. **Acessibilidade:** ações e estados são compreensíveis sem depender apenas de cor ou ícones.

## 3. Fluxo principal

### 3.1 Abrir o seletor
- A ação “Anexar arquivo” fica junto ao campo de mensagem e tem rótulo acessível.
- O usuário pode selecionar um ou vários arquivos, conforme limite configurado.
- Em desktop, considerar arrastar e soltar na área de composição; a alternativa pelo seletor permanece disponível.
- Em dispositivos móveis, usar o seletor nativo do sistema.
- Não iniciar upload apenas por selecionar ou arrastar.

### 3.2 Revisar a fila
Cada item da fila apresenta:
- Nome completo (com truncamento visual sem perder o nome acessível).
- Tipo/extensão e tamanho formatado, quando disponíveis.
- Ícone ou miniatura apenas como reforço visual.
- Estado individual: aguardando, validando, enviando, enviado, falhou ou cancelado.
- Ação de remover antes do envio.
- Mensagem específica quando a validação reprovar o arquivo.

O botão principal informa a ação, por exemplo “Enviar 3 arquivos”. Deve ficar desabilitado se a fila estiver vazia ou se todos os itens forem inválidos. Não bloquear itens válidos por falha isolada de outro arquivo, a menos que a API imponha envio atômico.

### 3.3 Validação anterior ao envio
Validar, conforme configuração do produto:
- Extensão e MIME type, sem confiar apenas no nome do arquivo.
- Tamanho máximo por arquivo.
- Quantidade máxima por envio.
- Regras de autorização e disponibilidade do serviço.

Os limites não são definidos nesta entrega. A interface deve receber os limites da configuração/serviço e apresentar o valor real ao usuário. Não inventar formatos, tamanhos ou quantidades.

### 3.4 Envio e progresso
- Mostrar progresso individual quando o serviço fornecer percentual confiável.
- Se não houver percentual, usar estado indeterminado e texto “Enviando…”, sem simular porcentagem.
- Permitir cancelar quando a API oferecer cancelamento seguro.
- Evitar duplicidade ao repetir uma ação; frontend deve bloquear duplo clique enquanto a solicitação estiver em andamento.
- Em falha de conexão, manter metadados do item na fila para permitir nova tentativa, respeitando as regras de segurança e validade do arquivo.
- Uma nova tentativa deve ser uma ação explícita.

### 3.5 Confirmação e histórico
Após sucesso, o anexo aparece na conversa como item associado ao autor e ao horário do envio. Mostrar:
- Nome e tipo do arquivo.
- Tamanho, se disponibilizado.
- Autor e data/hora, conforme padrão de mensagens.
- Ações “Visualizar” e/ou “Baixar”, somente se suportadas e autorizadas.

A mensagem não deve expor URL assinada, caminho de armazenamento, identificadores internos ou metadados sensíveis.

## 4. Estados e microcopy

| Estado | Texto sugerido | Ação |
|---|---|---|
| Fila vazia | “Selecione um arquivo para anexar.” | Selecionar arquivo |
| Aguardando | “Pronto para enviar” | Remover / Enviar |
| Validando | “Verificando arquivo…” | Aguardar |
| Enviando | “Enviando…” | Cancelar, se suportado |
| Sucesso | “Arquivo enviado” | Visualizar / Baixar |
| Falha | “Não foi possível enviar este arquivo.” | Tentar novamente |
| Sem conexão | “Conexão instável. Verifique a internet e tente novamente.” | Tentar novamente |
| Tipo não permitido | “Este tipo de arquivo não é permitido.” | Remover |
| Acima do limite | “Este arquivo excede o tamanho máximo permitido.” | Remover |
| Quantidade excedida | “Você atingiu o limite de arquivos por envio.” | Remover itens |
| Cancelado | “Envio cancelado.” | Enviar novamente |
| Indisponível | “Este arquivo não está disponível no momento.” | Tentar novamente / voltar |
| Sem permissão | “Você não tem permissão para acessar este arquivo.” | Voltar à conversa |
| Visualização não suportada | “A prévia não está disponível para este tipo de arquivo.” | Baixar, se autorizado |

Mensagens devem ser associadas ao item correto e anunciadas por tecnologia assistiva quando o estado mudar. Evitar alertas genéricos que não indiquem qual arquivo falhou.

## 5. Visualização, download e compartilhamento

- A prévia é opcional e depende de suporte técnico para o formato.
- Para tipos sem prévia, apresentar um cartão de arquivo e oferecer download se permitido.
- Abrir prévia em painel/modal acessível, com título, botão de fechar e foco controlado.
- Download deve usar endpoint autorizado; não disponibilizar link público permanente por padrão.
- Compartilhamento significa disponibilizar o anexo aos participantes autorizados da conversa, não criar link externo automaticamente.
- Se houver compartilhamento externo no futuro, exigir ação explícita, escopo, expiração e confirmação clara; fica fora do escopo desta proposta.
- Ao perder acesso à conversa, o usuário também deve perder acesso aos anexos conforme a política de autorização.

## 6. Permissões, privacidade e segurança

- Aplicar autorização no servidor para upload, leitura, prévia e download.
- Validar conteúdo no servidor; extensão e MIME informados pelo cliente não são prova suficiente.
- Considerar varredura antimalware, armazenamento privado, URLs temporárias e limites de requisição conforme arquitetura.
- Não renderizar conteúdo ativo ou potencialmente perigoso diretamente na página sem isolamento adequado.
- Não incluir nomes de arquivos ou conteúdo sensível em logs expostos ao usuário.
- Não revelar a existência de arquivos a quem não tenha acesso à conversa.
- Definir retenção, exclusão, auditoria e tratamento de arquivos órfãos com PO/Tech Lead/segurança.
- Mensagens de erro não devem revelar detalhes internos da infraestrutura.

## 7. Responsividade

### Desktop
- Área de drop próxima ao compositor, sem cobrir a conversa.
- Fila em lista compacta; progresso alinhado por item.
- Prévia em painel lateral ou modal amplo, mantendo contexto da conversa.

### Tablet
- Fila em uma coluna; alvos de toque confortáveis.
- Prévia em painel ou modal adaptado à largura.

### Celular
- Seletor nativo do dispositivo.
- Fila em cartões empilhados, com ações claramente identificadas.
- Ações primárias acessíveis sem rolagem horizontal.
- Prévia em tela cheia; respeitar áreas seguras e teclado virtual.
- Não depender de hover.

## 8. Acessibilidade

- Botões com nomes acessíveis (“Remover relatório.pdf”, por exemplo).
- Ordem de foco acompanha a ordem visual e permite operar toda a fila pelo teclado.
- Progresso exposto semanticamente quando percentual existir; mudanças de estado anunciadas sem anúncios excessivos.
- Contraste suficiente e estado não comunicado apenas por cor.
- Área de arrastar e soltar tem alternativa por botão.
- Erros associados ao item e descritos em linguagem simples.
- Ao fechar prévia, devolver foco ao controle que a abriu.

## 9. Modelo de estados por arquivo

`queued → validating → ready → uploading → uploaded`

Rotas alternativas:
- `validating → rejected` (tipo/tamanho/regra)
- `uploading → failed → uploading` (nova tentativa)
- `uploading → canceled` (se cancelamento suportado)
- `uploaded → unavailable` (arquivo removido, expirado ou sem acesso)

O estado final exibido deve refletir a resposta real do serviço. Não marcar como enviado antes da confirmação do servidor.

## 10. Proposta de MVP e evolução

**MVP sugerido (sujeito à decisão do PO):**
- Seleção de arquivo(s), fila de revisão e remoção.
- Validação dos limites configurados.
- Upload com estado de progresso ou estado indeterminado.
- Sucesso/falha e nova tentativa.
- Cartão no histórico e download autorizado.
- Acessibilidade e layout responsivo.

**Evolução possível:**
- Pré-visualização embutida para formatos selecionados.
- Arrastar e soltar, se não couber no MVP.
- Upload retomável para arquivos grandes.
- Compartilhamento externo controlado, se houver necessidade e política definida.

A ordem final depende da decisão do PO e da capacidade da API.

## 11. Critérios de aceite UX/UI

- [x] Fluxo de seleção e revisão documentado.
- [x] Fila permite compreender e remover itens antes do envio.
- [x] Estados de validação, envio, sucesso, falha e cancelamento descritos.
- [x] Limites e formatos permanecem decisões configuráveis, não inventadas.
- [x] Prévia e download condicionados a suporte e permissão.
- [x] Riscos de privacidade e segurança registrados.
- [x] Responsividade e acessibilidade especificadas.
- [x] Protótipo navegável de referência criado.
- [ ] PO confirma se o recurso entra no MVP ou em fase posterior.
- [ ] Tech Lead confirma limites, endpoints, cancelamento, retomada e formatos suportados.
- [ ] Segurança/engenharia confirma políticas de validação, armazenamento e retenção.

## 12. Dependências e limitações desta entrega

O protótipo é demonstrativo: usa seleção local de arquivos e simula estados no navegador. Não envia arquivos ao backend, não persiste anexos, não implementa autorização, antivírus, armazenamento, prévia real ou download por endpoint. As decisões marcadas como pendentes precisam ser mapeadas às regras reais do produto antes da implementação.
