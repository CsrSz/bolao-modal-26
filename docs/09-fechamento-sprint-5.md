# Fechamento da Sprint 5 — Tela Visual de Auditoria

## Status

Sprint concluída, testada e pronta para versionamento.

## Objetivo

Criar uma tela administrativa para auditoria detalhada da pontuação dos participantes, utilizando como fonte oficial a função `public.auditoria_pontuacao(...)` do Supabase/PostgreSQL.

## Arquivos criados

- `auditoria.html`
- `js/auditoria.js`
- `docs/09-fechamento-sprint-5.md`

## Arquivos alterados

- `css/style.css`
- `admin.html`

## Entregas realizadas

A tela de auditoria passou a oferecer:

- Seleção de participante.
- Filtro por fase.
- Filtro por grupo.
- Filtro por pontuação.
- Filtro por situação.
- Pesquisa por jogo ou seleção.
- Cards de resumo recalculados conforme os filtros.
- Tabela detalhada jogo por jogo.
- Exibição do palpite.
- Exibição do resultado oficial.
- Exibição da pontuação obtida.
- Exibição da regra aplicada.
- Exibição da situação da auditoria.
- Botão para limpar filtros.
- Botão para voltar ao Ranking.
- Layout responsivo.
- Acesso pela tela administrativa.

## Acesso administrativo

Foi incluído no arquivo `admin.html` o botão:

`Auditoria de Pontuação`

O botão direciona para:

`auditoria.html`

O acesso não foi incluído nas telas públicas dos participantes.

## Funcionamento do filtro Grupo

Foram criadas opções de Grupo A até Grupo L.

Ao selecionar um grupo:

- A fase muda automaticamente para `Fase de Grupos`.
- São exibidos somente os jogos pertencentes ao grupo selecionado.
- Os cards de resumo são recalculados com base nos jogos filtrados.
- Nas fases eliminatórias o filtro Grupo fica desabilitado.
- Ao selecionar uma fase eliminatória, o filtro Grupo retorna para `Todos os grupos`.

## Testes finais realizados

### Cesar — Todos os jogos

Resultado validado:

- 450 pontos.
- 13 acertos de 10 pontos.
- 30 acertos de 6 pontos.
- 27 acertos de 4 pontos.
- 16 acertos de 2 pontos.
- 18 jogos com 0 ponto.
- 0 jogos sem palpite.
- 0 jogos pendentes.
- 104 de 104 jogos exibidos.

### Cesar — Fase Final

Resultado validado:

- 1 de 104 jogos exibidos.
- Jogo 104.
- Espanha x Argentina.
- Palpite: 1 x 1.
- Resultado oficial: 0 x 0.
- Pontuação: 4 pontos.
- Regra aplicada: `EMPATE_NAO_EXATO`.
- Situação: `Auditado`.

### Cesar — Grupo A

Resultado validado:

- A fase foi alterada automaticamente para `Fase de Grupos`.
- 6 de 104 jogos exibidos.
- Somente jogos do Grupo A.
- Cards de resumo recalculados corretamente.

### Navegação administrativa

Resultado validado:

- A tela `admin.html` continuou carregando os jogos normalmente.
- O botão `Auditoria de Pontuação` apareceu na área administrativa.
- O botão abriu corretamente a página `auditoria.html`.
- O acesso não foi adicionado à área pública dos participantes.

## Problemas corrigidos durante a Sprint

### Conteúdo HTML colado no CSS

Em determinado momento, o conteúdo do arquivo `auditoria.html` foi colado por engano dentro do arquivo `css/style.css`.

O CSS foi restaurado com:

```bash
git restore css/style.css
```

Depois disso, o bloco completo de estilos da auditoria foi inserido novamente no local correto.

### Erro no filtro Grupo

Erro apresentado no Console:

```text
Cannot read properties of null (reading 'addEventListener')
```

Causa:

O arquivo `js/auditoria.js` já procurava pelo elemento `filtro-grupo`, mas o arquivo `auditoria.html` carregado ainda não possuía esse campo.

Correção:

O campo com `id="filtro-grupo"` foi incluído entre os filtros Fase e Pontuação.

Após a correção:

- Os participantes voltaram a carregar.
- O campo Grupo passou a ser exibido.
- O teste do Grupo A foi concluído com sucesso.

## Observação conhecida

O erro abaixo continua aparecendo sem impacto funcional:

```text
favicon.ico 404
```

Esse item poderá ser tratado em uma Sprint futura.

## Segurança

A tela de auditoria ainda não possui proteção administrativa definitiva.

Não devem ser considerados mecanismos de segurança:

- Link escondido.
- Senha escrita no JavaScript.
- Uso de `prompt()`.
- Nome do participante salvo no navegador.
- Apenas ocultar o botão.

A proteção correta deverá ser tratada futuramente com:

- Supabase Auth.
- Conta administrativa.
- Sessão autenticada.
- Autorização no banco.
- Restrição da RPC `auditoria_pontuacao`.
- Retirada de acesso público quando aplicável.
- Políticas de segurança no PostgreSQL/Supabase.

Essa implementação não faz parte da Sprint 5.

## Resultado final

A Sprint 5 foi concluída com sucesso.

A tela visual de auditoria está funcionando localmente, os filtros foram validados, os dados conferem com o ranking oficial e o acesso foi incluído apenas na área administrativa.

O próximo passo é revisar o `git status`, conferir os arquivos da Sprint, realizar o versionamento e somente depois executar commit e push.
