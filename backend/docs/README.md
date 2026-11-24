# Documentação da API Callzup

O contrato [openapi.json](./openapi.json) descreve as 33 operações HTTP da main em OpenAPI 3.0.3.

## Swagger

Abra https://editor.swagger.io/ e importe o arquivo openapi.json. Para testar, execute o backend localmente e selecione http://localhost:3001. A execução pelo editor remoto pode ser bloqueada pelo CORS ou pelo navegador; nesse caso use Swagger UI local ou curl. Não altere o CORS de produção para contornar isso.

## Autenticação

POST /api/auth/login
```json
{"email":"usuario@example.com","senha":"senha-de-teste"}
```

Copie o token retornado e use Authorize no Swagger (somente o token), ou envie Authorization: Bearer TOKEN. O JWT dura 8 horas. Nunca compartilhe tokens ou senhas reais.

Atenção: cadastro de usuário usa password; login usa senha.

## Regras

- Login, envio de mensagens e operações de solicitação de conversa: 08h inclusive a 18h exclusive, horário de Brasília.
- Rotas administrativas exigem IT_ADMIN.
- Histórico e reações exigem participação no grupo ou conversa.
- Mensagens de grupo têm dois caminhos equivalentes: /api/my-groups/{id} e /api/group-messages/{id}.
- O envio atual aceita texto; anexos e paginação não estão implementados no contrato.
- Respostas aninhadas de entidades estão descritas de forma aberta; os envelopes e campos de entrada são documentados.

## Alterações pendentes

PR #110 padroniza middleware de horário; PR #111 trata conexão RLS; PR #112 propõe GET /api/health e GET /api/my-groups, entre outras mudanças. Não são parte do contrato da main até aprovação. Atualize o OpenAPI após o merge.

## Manutenção

Ao alterar uma rota, atualize método, parâmetros, corpo, permissões e códigos HTTP no OpenAPI na mesma PR. Não execute operações de escrita contra produção durante testes.
