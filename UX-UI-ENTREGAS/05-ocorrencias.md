# Detalhes e ciclo de vida de ocorrências operacionais

## 1. Objetivo

Definir como os colaboradores visualizam, acompanham e compreendem as ocorrências operacionais dentro do sistema.

A experiência deve facilitar o acompanhamento de problemas, permitir a identificação dos responsáveis e apresentar claramente as mudanças de status de cada ocorrência.

## 2. Estrutura da tela de detalhes

A tela de detalhes de uma ocorrência deve apresentar, quando essas informações estiverem disponíveis:

- **Título:** identificação resumida da ocorrência.
- **Descrição:** explicação do problema ou situação.
- **Identificador:** código ou número de referência.
- **Unidade:** unidade ou local relacionado.
- **Responsável:** colaborador responsável pelo acompanhamento.
- **Status:** situação atual da ocorrência.
- **Data de criação:** momento em que foi registrada.
- **Última atualização:** momento da alteração mais recente.
- **Conversa relacionada:** acesso às mensagens associadas à ocorrência.

Os campos definitivos dependem das informações disponibilizadas pelo backend e das regras do produto.

## 3. Ciclo de vida da ocorrência

A interface deve comunicar claramente a situação atual da ocorrência.

Como proposta inicial, podem ser avaliados os seguintes estados:

### Aberta
A ocorrência foi registrada e precisa de acompanhamento.

### Em andamento
A ocorrência está sendo analisada ou tratada pelos responsáveis.

### Resolvida
A situação foi solucionada, aguardando eventual confirmação, caso essa etapa exista no produto.

### Encerrada
A ocorrência teve seu ciclo finalizado, conforme as regras definidas pela equipe.

Esses estados são uma proposta de organização visual. Os nomes e as transições oficiais devem ser confirmados pelo Product Owner e pelo Tech Lead.

## 4. Histórico de alterações

A tela deve permitir compreender o histórico da ocorrência.

Quando os dados estiverem disponíveis, apresentar:

- Alteração realizada.
- Responsável pela alteração.
- Data e horário.
- Status anterior e novo status.
- Comentários ou registros associados.

O histórico deve ser organizado cronologicamente para facilitar o acompanhamento.

## 5. Ações e permissões

As ações disponíveis devem respeitar o perfil e as permissões do colaborador.

Ações que podem ser avaliadas:

- Consultar detalhes.
- Acessar a conversa relacionada.
- Atualizar informações.
- Alterar o status.
- Consultar o histórico.

Não considerar todas essas ações como funcionalidades confirmadas. O Product Owner e o Tech Lead devem definir quais operações serão permitidas para cada perfil.

## 6. Estados alternativos da interface

### Carregamento
Apresentar um indicador enquanto os dados da ocorrência são carregados.

### Ocorrência não encontrada
Exibir:

"Não foi possível encontrar esta ocorrência."

Orientar o usuário a verificar o acesso ou retornar à lista.

### Falha ao carregar
Exibir:

"Não foi possível carregar os detalhes da ocorrência. Tente novamente."

### Sem histórico
Exibir uma mensagem informando que ainda não existem atualizações registradas.

### Sem responsável definido
Apresentar uma informação clara de que a ocorrência ainda não possui responsável atribuído, caso essa situação seja permitida pelo produto.

## 7. Diretrizes de UX/UI

- Destacar o status atual da ocorrência.
- Organizar as informações por importância.
- Facilitar a identificação do responsável.
- Manter o histórico fácil de consultar.
- Diferenciar visualmente informações principais e complementares.
- Evitar excesso de informações na mesma área.
- Utilizar linguagem objetiva.
- Garantir boa visualização em dispositivos móveis e desktops.
- Não depender somente de cores para comunicar os estados.

## 8. Critérios de validação

- [ ] A tela apresenta as informações principais da ocorrência.
- [ ] O status atual é facilmente identificado.
- [ ] O ciclo de vida está documentado.
- [ ] As possíveis transições de status foram consideradas.
- [ ] O histórico de alterações está especificado.
- [ ] As ações respeitam as permissões dos perfis.
- [ ] Os estados de carregamento, falha e ausência de dados estão contemplados.
- [ ] A navegação para a conversa relacionada está considerada.
- [ ] A proposta foi revisada com Product Owner, frontend e SQA.

## 9. Dependências e pontos pendentes

Precisam de confirmação:

- Quais informações
