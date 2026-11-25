# Experiência de anexos e compartilhamento de arquivos no chat

## 1. Objetivo

Definir como os colaboradores podem selecionar, enviar, visualizar e compartilhar arquivos dentro das conversas do sistema.

A experiência deve tornar o envio de arquivos simples, informar o andamento da operação e orientar o usuário quando ocorrer algum problema.

## 2. Fluxo de envio de arquivos

### Etapa 1 — Seleção

O usuário deve encontrar uma ação clara para anexar arquivos na conversa.

A interface deve:
- Apresentar um botão ou ícone de anexar.
- Permitir selecionar os arquivos disponíveis no dispositivo.
- Informar quando nenhum arquivo foi selecionado.
- Permitir cancelar a seleção antes do envio.

### Etapa 2 — Revisão antes do envio

Antes de confirmar, apresentar uma lista dos arquivos selecionados com:
- Nome do arquivo.
- Formato ou extensão, quando disponível.
- Tamanho, quando disponível.
- Opção de remover o arquivo da seleção.

A interface deve deixar claro qual ação confirma o envio.

### Etapa 3 — Envio

Durante o envio, apresentar:
- Nome do arquivo.
- Indicador de progresso, se disponível.
- Estado de envio.
- Possibilidade de cancelar, caso o sistema permita.

O usuário deve conseguir entender se o arquivo está sendo enviado ou se o processo foi concluído.

### Etapa 4 — Arquivo enviado

Após a conclusão, o arquivo deve aparecer na conversa associado à mensagem ou ao registro de envio.

A interface deve permitir identificar:
- Nome do arquivo.
- Tipo de arquivo, quando possível.
- Autor do envio, quando disponível.
- Data e horário.
- Ação para visualizar ou baixar, conforme as permissões do sistema.

## 3. Estados de envio

### Aguardando envio
O arquivo foi selecionado, mas ainda não começou a ser enviado.

### Enviando
O sistema está realizando o envio. Apresentar um indicador de progresso quando essa informação estiver disponível.

### Enviado
O envio foi concluído com sucesso.

### Falha no envio
Apresentar a mensagem:

"Não foi possível enviar o arquivo. Tente novamente."

Oferecer uma ação de nova tentativa, quando aplicável.

### Envio cancelado
Informar que o envio foi cancelado e permitir iniciar novamente.

## 4. Regras e limitações

Os formatos permitidos, o tamanho máximo dos arquivos e a quantidade de anexos por envio precisam ser definidos pelo Product Owner e pelo Tech Lead.

A interface deve:
- Informar formatos não aceitos.
- Explicar quando um arquivo ultrapassar o limite permitido.
- Evitar iniciar envios que não atendam às regras do sistema.
- Apresentar mensagens claras para cada restrição.

Não inventar limites ou formatos antes da confirmação técnica.

## 5. Visualização e compartilhamento

A experiência deve considerar:
- Visualização de arquivos compatíveis, se suportada.
- Download de arquivos, conforme permissões.
- Identificação do arquivo dentro do histórico da conversa.
- Mensagens claras para arquivos indisponíveis.
- Comportamento adequado para arquivos que não podem ser visualizados diretamente.

O acesso aos anexos deve respeitar as permissões e regras de privacidade do produto.

## 6. Estados alternativos

### Nenhum arquivo selecionado
Não iniciar o envio e orientar o usuário a selecionar um arquivo.

### Formato não permitido
Exibir:

"Este tipo de arquivo não é permitido."

### Arquivo acima do limite
Exibir:

"O arquivo ultrapassa o tamanho máximo permitido."

### Falha de conexão
Informar que não foi possível concluir o envio por causa da conexão e oferecer nova tentativa, quando aplicável.

### Arquivo indisponível
Exibir:

"Este arquivo não está disponível no momento."

### Carregamento de visualização
Apresentar um indicador enquanto o arquivo é preparado para visualização.

## 7. Privacidade e segurança

- Respeitar as permissões de acesso às conversas.
- Não expor arquivos a usuários sem autorização.
- Evitar apresentar informações técnicas sensíveis.
- Não exibir caminhos internos ou dados privados do armazenamento.
- Seguir as regras de segurança definidas pela equipe técnica.

## 8. Diretrizes de UX/UI

- Manter a ação de anexar fácil de encontrar.
- Exibir claramente o andamento do envio.
- Diferenciar visualmente os estados do arquivo.
- Permitir identificar facilmente o arquivo na conversa.
- Utilizar mensagens de erro objetivas e orientativas.
- Considerar telas menores e diferentes dispositivos.
- Evitar que arquivos grandes prejudiquem a navegação da conversa.

## 9. Critérios de validação

- [ ] A seleção de arquivos está documentada.
- [ ] A revisão antes do envio está especificada.
- [ ] Os estados de envio, sucesso, falha e cancelamento estão contemplados.
- [ ] Os formatos permitidos estão identificados como dependência de validação.
- [ ] Os limites de tamanho e quantidade estão identificados como dependências.
- [ ] A visualização e o download respeitam as permissões.
- [ ] As mensagens de erro estão documentadas.
- [ ] A experiência responsiva foi considerada.
- [ ] A proposta de MVP e funcionalidades futuras foi discutida com a equipe.

## 10. Dependências e pontos pendentes

Precisam de confirmação:

- Formatos de arquivo aceitos.
- Tamanho máximo permitido.
- Quantidade máxima de anexos por envio.
- Possibilidade de cancelar e repetir envios.
- Tipos de arquivo que poderão ser visualizados dentro do sistema.
- Regras de download e compartilhamento.
- Políticas de armazenamento e privacidade.

