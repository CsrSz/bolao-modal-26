# Sprint 6 — Segurança Administrativa

## Status

Em andamento.

Este documento registra o primeiro bloco concluído da Sprint 6, relacionado à autenticação administrativa e à proteção das funções administrativas do Supabase.

Ainda não houve commit nem push desta Sprint.

---

## Objetivo

Substituir a antiga proteção administrativa baseada em senha fixa no JavaScript por autenticação real utilizando Supabase Auth.

Também proteger no banco de dados as funções administrativas que anteriormente podiam ser executadas por usuários anônimos.

---

## Proteção antiga removida

O arquivo `js/admin.js` utilizava:

* senha administrativa fixa no código;
* `prompt()` para solicitar a senha;
* `sessionStorage` como controle de autorização.

Essa proteção foi completamente removida.

---

## Supabase Auth

Foi criada e validada uma conta administrativa no Supabase Auth.

O acesso administrativo passou a depender de:

1. sessão autenticada no Supabase Auth;
2. UID autorizado na tabela `public.admin_usuarios`.

---

## Tabela administrativa

Foi criada a tabela:

```sql
public.admin_usuarios
```

Estrutura:

* `user_id uuid primary key`;
* referência para `auth.users(id)`;
* exclusão em cascata;
* `criado_em timestamptz default now()`.

O RLS foi ativado nessa tabela.

Política criada:

```text
Usuario consulta propria autorizacao
```

A política permite que usuários autenticados consultem somente o registro correspondente ao próprio UID:

```sql
auth.uid() = user_id
```

O papel `anon` não possui acesso à tabela.

O papel `authenticated` possui somente permissão de leitura, limitada pelo RLS.

---

## Página de login administrativo

Foi criado o arquivo:

```text
login-admin.html
```

Responsabilidades:

* login por e-mail e senha;
* autenticação com `signInWithPassword()`;
* consulta da autorização em `admin_usuarios`;
* encerramento da sessão de contas não autorizadas;
* redirecionamento de administradores para `admin.html`;
* apresentação de mensagens para credenciais inválidas ou ausência de autorização.

Nenhuma senha administrativa fixa está armazenada no arquivo.

---

## Proteção do painel administrativo

O arquivo:

```text
js/admin.js
```

foi alterado para:

* remover a senha fixa;
* remover o uso de `prompt()`;
* remover o `sessionStorage` como autorização;
* validar a sessão com `supabase.auth.getUser()`;
* consultar a autorização em `admin_usuarios`;
* redirecionar usuários sem sessão para `login-admin.html`;
* desconectar usuários autenticados sem autorização;
* preservar a lógica de jogos, resultados e mata-mata.

---

## Proteção da auditoria visual

O arquivo:

```text
js/auditoria.js
```

foi alterado para:

* validar a sessão com `supabaseClient.auth.getUser()`;
* consultar a autorização em `admin_usuarios`;
* redirecionar usuários sem sessão;
* desconectar usuários sem autorização administrativa;
* preservar os filtros, cálculos e recursos da auditoria.

---

## Proteção da RPC de reprocessamento

A função:

```sql
public.reprocessar_chaveamento_mata_mata()
```

foi alterada para validar:

```sql
auth.uid()
```

e confirmar a existência do usuário em:

```sql
public.admin_usuarios
```

A função continua como `SECURITY DEFINER`, mas agora rejeita qualquer chamada que não pertença a um administrador autorizado.

Permissões finais:

* `anon`: sem permissão de execução;
* `authenticated`: com permissão de execução;
* autenticado comum: bloqueado pela validação interna;
* administrador autorizado: execução permitida.

---

## Proteção da RPC de auditoria

A função:

```sql
public.auditoria_pontuacao(bigint)
```

foi alterada para:

* executar como `SECURITY DEFINER`;
* validar `auth.uid()`;
* consultar `admin_usuarios`;
* rejeitar usuários não autorizados;
* preservar parâmetros, colunas e cálculos existentes.

Permissões finais:

* `anon`: sem permissão de execução;
* `authenticated`: com permissão de execução;
* autenticado comum: bloqueado pela validação interna;
* administrador autorizado: execução permitida.

---

## Proteção da função interna do mata-mata

A função:

```sql
public.resolver_origem_mata_mata(text)
```

é utilizada internamente pelo reprocessamento do mata-mata.

Sua execução direta foi removida de:

* `public`;
* `anon`;
* `authenticated`.

A função administrativa de reprocessamento continuou funcionando normalmente após essa restrição.

---

## Testes realizados

Foram concluídos com sucesso:

* acesso direto ao `admin.html` sem sessão;
* redirecionamento para `login-admin.html`;
* login com conta administrativa;
* carregamento normal do painel administrativo;
* ausência do antigo `prompt()`;
* permanência da sessão após atualização da página;
* acesso à auditoria com sessão administrativa;
* bloqueio da auditoria sem autenticação;
* carregamento dos participantes e resultados da auditoria;
* bloqueio anônimo do reprocessamento;
* execução administrativa do reprocessamento;
* execução do reprocessamento após bloquear a função auxiliar;
* validação das permissões das RPCs;
* validação local com `git diff --check`.

---

## Arquivos locais alterados

```text
js/admin.js
js/auditoria.js
login-admin.html
docs/10-andamento-sprint-6.md
```

---

## Diagnóstico ainda pendente

As tabelas abaixo continuam com RLS desativado:

```text
jogos
resultados
palpites
participantes
```

Os papéis `anon` e `authenticated` ainda possuem permissões amplas de leitura e escrita nessas tabelas.

A continuação da Sprint deverá definir cuidadosamente:

1. leitura pública de jogos e resultados;
2. escrita administrativa de jogos e resultados;
3. leitura e escrita dos palpites;
4. acesso aos participantes;
5. funcionamento público de `ranking_completo()`;
6. políticas RLS necessárias;
7. remoção segura dos privilégios excessivos.

Nenhuma permissão dessas tabelas deve ser removida antes da preparação e teste das respectivas políticas.

---

## Git

Até este ponto:

* nenhum `git add` foi executado;
* nenhum commit foi criado;
* nenhum push foi realizado.
