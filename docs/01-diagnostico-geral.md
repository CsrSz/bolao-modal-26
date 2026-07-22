# Bolão MODAL Web

## Diagnóstico Geral do Sistema

**Projeto:** Bolão MODAL Web
**Etapa:** Revisão Geral 2030
**Documento:** Diagnóstico oficial do sistema atual
**Data do diagnóstico:** 22 de julho de 2026
**Status:** Sistema funcional, auditado e ainda sem alterações estruturais

---

## 1. Objetivo da revisão

O Bolão MODAL Web foi utilizado durante a Copa e chegou ao final da competição funcionando.

A Revisão Geral 2030 tem como objetivo transformar essa versão funcional em uma base:

* mais segura;
* organizada;
* documentada;
* reaproveitável;
* preparada para futuras competições;
* mais simples de administrar;
* menos dependente de alterações manuais no código.

O princípio central da revisão é:

> Não alterar nem remover recursos que funcionam antes de entender completamente seu funcionamento, suas dependências e seus impactos.

---

## 2. Tecnologias utilizadas

O sistema atual utiliza:

* HTML;
* CSS;
* JavaScript puro;
* Supabase;
* PostgreSQL;
* GitHub;
* Vercel.

O projeto não utiliza framework JavaScript.

---

## 3. Estrutura real do projeto

```text
@Bolao Copa - HTML (web)
│
├── admin.html
├── chaveamento.html
├── chaveamento.ORIGINAL
├── index.html
├── login.html
├── palpites.html
├── ranking.html
├── teste-engine.html
│
├── assets
│   ├── copa-2026.png
│   ├── logo_modal.png
│   ├── new-logo-2026-azul.png
│   └── escudos
│
├── css
│   └── style.css
│
├── dados
│   ├── participantes.json
│   └── resultados.json
│
└── js
    ├── admin.js
    ├── app.js
    ├── calcular.js
    ├── chaveamento-tela.js
    ├── login.js
    ├── palpites.js
    ├── ranking.js
    ├── supabase.js
    │
    └── engine
        ├── chaveamento.js
        ├── classificacao.js
        ├── competicao.js
        └── config.js
```

O arquivo `js/engine/utils.js`, citado em partes antigas do projeto, não existe na estrutura real atual.

---

## 4. Páginas do sistema

### 4.1 `index.html`

Página inicial do Bolão MODAL.

Carrega:

* `js/app.js`;
* `js/login.js`.

O arquivo `app.js` possui apenas uma mensagem de console e não executa uma função essencial no sistema.

---

### 4.2 `login.html`

Responsável pelo login dos participantes.

Carrega:

* biblioteca do Supabase;
* `js/supabase.js`;
* `js/login.js`.

O login atual consulta diretamente a tabela `participantes` e compara a senha no navegador.

---

### 4.3 `palpites.html`

Tela utilizada pelos participantes para registrar e atualizar palpites.

Carrega:

* biblioteca do Supabase;
* `js/supabase.js`;
* `js/palpites.js`.

Funções principais:

* identificar o participante pelo `localStorage`;
* carregar jogos;
* carregar palpites existentes;
* salvar palpites;
* controlar a fase visível do mata-mata;
* bloquear campos conforme data e horário;
* exibir somente jogos com confrontos definidos.

---

### 4.4 `ranking.html`

Exibe o ranking e o resumo de pontos.

Carrega:

* biblioteca do Supabase;
* `js/supabase.js`;
* `js/ranking.js`.

O total de pontos vem de funções SQL do Supabase.

As quantidades de resultados de 10, 6, 4, 2 e 0 pontos são recalculadas no navegador.

---

### 4.5 `admin.html`

Tela utilizada para inserir, atualizar e apagar resultados oficiais.

Carrega:

* biblioteca do Supabase;
* `js/supabase.js`;
* `js/admin.js`.

Funções principais:

* carregar jogos;
* carregar resultados;
* salvar resultados;
* apagar resultados;
* definir o vencedor de jogos empatados no mata-mata;
* chamar a função de reprocessamento do chaveamento.

O acesso é protegido apenas por uma senha escrita no JavaScript.

---

### 4.6 `chaveamento.html`

Exibe visualmente o caminho das fases eliminatórias.

Carrega:

* biblioteca do Supabase;
* `js/supabase.js`;
* `js/chaveamento-tela.js`.

O arquivo HTML contém grande quantidade de CSS interno.

Os placares de pênaltis exibidos no chaveamento estão escritos diretamente no HTML.

---

### 4.7 `teste-engine.html`

Página criada para testar a Engine JavaScript.

Atualmente, ela não carrega corretamente a biblioteca externa do Supabase antes de carregar `js/supabase.js`.

Por esse motivo, a página de teste pode apresentar o erro:

```text
supabase is not defined
```

Essa página não faz parte do funcionamento normal do sistema em produção.

---

## 5. Arquivos JavaScript principais

### `js/supabase.js`

Cria o cliente do Supabase utilizado pelas páginas.

A chave pública do Supabase aparece no código do navegador, o que é normal em aplicações que utilizam o cliente público.

A segurança deveria ser garantida por autenticação, permissões e políticas RLS no banco.

---

### `js/login.js`

Responsável pelo login dos participantes.

Problemas identificados:

* consulta todos os dados da tabela `participantes`;
* recebe também as senhas;
* compara as senhas no navegador;
* armazena o ID e o nome do participante no `localStorage`;
* não utiliza autenticação real do Supabase.

---

### `js/palpites.js`

Responsável pela tela e pelo salvamento dos palpites.

Utiliza o `participanteId` armazenado no navegador.

A fase atual do mata-mata é definida manualmente no código por uma constante semelhante a:

```javascript
const FASES_MATA_ATUAIS = ['TERCEIRO', 'FINAL'];
```

O bloqueio de horário é calculado no computador do participante.

Essas duas proteções existem apenas na interface e podem ser manipuladas no navegador.

---

### `js/ranking.js`

Responsável pela tela do ranking e pelo resumo de pontos.

Os totais recebidos do Supabase estão corretos.

Porém, o JavaScript recalcula os critérios de desempate com uma regra diferente da regra oficial.

Problemas identificados:

* empate não exato pode ser classificado como 0 em vez de 4;
* acerto dos gols de um dos lados, sem acertar o resultado, pode ser classificado como 0 em vez de 2;
* o resumo de pontos pode apresentar contagens incorretas;
* participantes empatados em pontos podem aparecer em ordem incorreta.

---

### `js/admin.js`

Responsável pela tela administrativa.

A senha atual está escrita diretamente no arquivo:

```javascript
const SENHA_ADMIN = 'Modal@2026';
```

Essa senha protege apenas a abertura da tela.

Ela não protege as tabelas nem as funções SQL.

---

### `js/chaveamento-tela.js`

Atualiza os cards do chaveamento com os dados do Supabase.

O arquivo corresponde à estrutura real do chaveamento cadastrada no banco.

---

### `js/calcular.js`

Não é carregado por nenhuma página atual.

Possui uma implementação de cálculo de pontos mais próxima da regra oficial, mas está órfão no sistema.

Não deve ser removido antes da futura análise de limpeza.

---

### `js/app.js`

Possui apenas uma mensagem simples no console.

Não executa uma função essencial.

---

## 6. Engine JavaScript

A pasta `js/engine` contém:

* `config.js`;
* `classificacao.js`;
* `chaveamento.js`;
* `competicao.js`.

Essa Engine foi criada como implementação JavaScript para testes.

Ela não é utilizada pelo `admin.html` em produção.

O chaveamento utilizado pelo sistema atual é atualizado pela função SQL:

```text
reprocessar_chaveamento_mata_mata()
```

A Engine JavaScript possui confrontos de 2026 escritos diretamente no código e não está preparada para reutilização automática em outra competição.

---

## 7. Estrutura real do Supabase

### 7.1 Tabelas

O banco possui quatro tabelas principais:

```text
participantes
jogos
palpites
resultados
```

Também possui uma VIEW chamada:

```text
ranking
```

---

### 7.2 Tabela `participantes`

Campos:

```text
id      bigint  NOT NULL
nome    text    NOT NULL
senha   text    NOT NULL
```

Restrições:

* chave primária em `id`;
* restrição `UNIQUE` em `nome`.

Não existem campos para:

* participante ativo ou inativo;
* perfil administrativo;
* competição;
* edição da Copa;
* autenticação segura.

---

### 7.3 Tabela `jogos`

Campos:

```text
id                  integer  NOT NULL
grupo               text     NOT NULL
rodada              integer  NOT NULL
data                 date     NOT NULL
hora                 text     NOT NULL
local                text
mandante             text     NOT NULL
visitante            text     NOT NULL
escudo_mandante      text
escudo_visitante     text
fase                 text
ordem                integer
origem_mandante      text
origem_visitante     text
```

A tabela possui chave primária em `id`.

O campo `hora` está armazenado como texto.

---

### 7.4 Tabela `palpites`

Campos:

```text
id                 bigint   NOT NULL
participante_id    bigint   NOT NULL
jogo_id            integer  NOT NULL
mandante           integer  NOT NULL
visitante          integer  NOT NULL
```

Restrições:

* chave primária em `id`;
* chave estrangeira de `participante_id` para `participantes.id`;
* chave estrangeira de `jogo_id` para `jogos.id`;
* restrição única em `(participante_id, jogo_id)`.

A restrição composta impede dois palpites do mesmo participante para o mesmo jogo.

---

### 7.5 Tabela `resultados`

Campos:

```text
jogo_id       integer  NOT NULL
mandante      integer  NOT NULL
visitante     integer  NOT NULL
vencedor      text
```

A chave primária é o próprio `jogo_id`.

Não existe chave estrangeira formal entre `resultados.jogo_id` e `jogos.id`.

O campo `vencedor` é utilizado somente quando um jogo de mata-mata termina empatado.

Valores utilizados:

```text
MANDANTE
VISITANTE
NULL
```

O banco ainda não possui uma restrição `CHECK` que limite esses valores.

---

## 8. VIEW e funções SQL

### VIEW `ranking`

Retorna:

```text
id
nome
pontos
```

Calcula o ranking geral.

---

### Função `ranking()`

Calcula o ranking geral.

O resultado é idêntico ao resultado atual da VIEW `ranking`.

A função usa a regra oficial de pontuação.

---

### Função `ranking_mata_mata()`

Calcula somente os pontos dos jogos do mata-mata.

Inclui todos os participantes, mesmo aqueles com zero ponto.

A ordenação atual utiliza:

```text
pontos decrescentes
nome crescente
```

Ela não entrega as quantidades de resultados de 10, 6, 4 e 2 pontos necessárias para o desempate completo.

---

### Função `resolver_origem_mata_mata()`

Interpreta origens como:

```text
V73
P101
```

Onde:

* `V` significa vencedor;
* `P` significa perdedor.

A função utiliza o campo `vencedor` quando um jogo termina empatado.

Ela utiliza `SECURITY DEFINER`.

---

### Função `reprocessar_chaveamento_mata_mata()`

Atualiza automaticamente os confrontos das próximas fases.

Ela utiliza `SECURITY DEFINER`.

Pode alterar:

* mandante;
* visitante;
* escudo do mandante;
* escudo do visitante.

Atualmente, a execução está liberada para:

* `PUBLIC`;
* `anon`;
* `authenticated`.

Essa função não deveria permanecer publicamente executável na versão revisada.

---

## 9. Quantidade de dados

No momento da auditoria, o banco possuía:

```text
19 participantes
104 jogos
1.772 palpites
104 resultados
```

Distribuição dos jogos:

```text
GRUPO       72
16AVOS      16
OITAVAS      8
QUARTAS      4
SEMIFINAL    2
TERCEIRO     1
FINAL        1
```

Total:

```text
104 jogos
```

---

## 10. Estrutura do mata-mata

### 16 avos

Jogos:

```text
73 a 88
```

### Oitavas

```text
89: V73 x V74
90: V75 x V76
91: V77 x V78
92: V79 x V80
93: V81 x V82
94: V83 x V84
95: V85 x V86
96: V87 x V88
```

### Quartas

```text
97: V89 x V90
98: V93 x V94
99: V91 x V92
100: V95 x V96
```

### Semifinais

```text
101: V97 x V99
102: V98 x V100
```

### Terceiro lugar

```text
103: P101 x P102
```

### Final

```text
104: V101 x V102
```

A estrutura real do Supabase deve ser considerada a fonte oficial da verdade.

---

## 11. Regra oficial de pontuação

### 10 pontos

Placar exato.

```text
Palpite:   2 x 1
Resultado: 2 x 1
```

---

### 6 pontos

Acertou o vencedor e os gols de um dos lados.

```text
Palpite:   1 x 3
Resultado: 0 x 3
```

---

### 4 pontos

Acertou somente o vencedor.

```text
Palpite:   3 x 2
Resultado: 2 x 1
```

Também vale 4 pontos para empate não exato:

```text
Palpite:   2 x 2
Resultado: 1 x 1
```

---

### 2 pontos

Acertou os gols de qualquer um dos times, sem acertar o vencedor ou o empate.

```text
Palpite:   2 x 2
Resultado: 0 x 2
```

---

### 0 pontos

Demais casos.

---

## 12. Critérios de desempate

A ordem oficial utilizada na auditoria foi:

```text
1. Total de pontos
2. Quantidade de resultados de 10 pontos
3. Quantidade de resultados de 6 pontos
4. Quantidade de resultados de 4 pontos
5. Quantidade de resultados de 2 pontos
6. Nome
```

Esses critérios ainda não estão consolidados dentro de uma única função SQL utilizada pela tela.

---

## 13. Ranking auditado

Ranking geral final:

```text
1. Cesar         450
2. Rauany        448
3. Cadu          436
4. Márcio        414
5. Gabriela      414
6. Sandra        410
7. Christiana    410
8. Daniel        406
9. Sabrina       404
10. Letícia      404
11. Marcos       388
12. Caio         384
13. Elaine       362
14. Ricardo      346
15. Rissiara     324
16. Grace        324
17. Fátima       302
18. Andrea       102
19. Sirlene       66
```

Maior pontuação na fase de grupos:

```text
Rauany: 316 pontos
```

Maior pontuação no mata-mata:

```text
Cadu: 142 pontos
```

---

## 14. Integridade dos dados

As seguintes verificações retornaram zero problemas:

* resultados sem jogo;
* palpites sem jogo;
* palpites sem participante;
* placares negativos em palpites;
* placares negativos em resultados;
* valores inválidos no campo `vencedor`;
* vencedor preenchido em jogo não empatado;
* empate no mata-mata sem vencedor definido.

Os dados atuais estão íntegros.

---

## 15. Cobertura dos palpites

Existem 204 combinações de participante e jogo sem palpite.

Essas ausências são compatíveis com:

* participantes adicionados depois;
* participantes que deixaram de preencher fases específicas;
* ausências pontuais.

Não foram encontrados sinais de perda de dados em massa ou corrupção.

Participantes com os 104 palpites:

```text
Cadu
Cesar
Daniel
Rauany
Ricardo
Rissiara
Sandra
```

---

## 16. Segurança atual

### Situação do RLS

O Row Level Security está desativado em:

```text
participantes
jogos
palpites
resultados
```

Nenhuma dessas tabelas possui política RLS.

---

### Permissões do perfil anônimo

O perfil `anon` possui permissões amplas sobre as tabelas, incluindo:

```text
SELECT
INSERT
UPDATE
DELETE
```

Isso significa que a proteção atual está apenas na interface.

---

### Senhas dos participantes

As senhas estão:

* armazenadas em texto aberto na tabela `participantes`;
* consultadas pelo navegador;
* presentes também no arquivo antigo `dados/participantes.json`.

O arquivo JSON pode ficar publicamente acessível caso seja publicado junto do projeto.

---

### Identidade manipulável

O ID do participante é armazenado no `localStorage`.

Sem RLS, uma pessoa pode alterar esse valor e tentar salvar palpites utilizando o ID de outro participante.

---

### Administração

A senha do Admin está escrita no JavaScript.

As funções administrativas SQL também estão liberadas para execução pública.

Classificação atual do risco:

```text
CRÍTICO
```

As permissões não devem ser alteradas sem uma estratégia de migração, pois o sistema atual depende desse acesso aberto para funcionar.

---

## 17. Arquivos antigos ou órfãos

Arquivos identificados:

```text
dados/participantes.json
dados/resultados.json
chaveamento.ORIGINAL
js/calcular.js
js/app.js
teste-engine.html
js/engine/*
```

Esses arquivos não devem ser removidos imediatamente.

Primeiro será necessário:

1. confirmar novamente suas dependências;
2. mover backups para local apropriado;
3. retirar dados sensíveis do projeto público;
4. validar o sistema depois da limpeza.

---

## 18. CSS e organização visual

O arquivo `css/style.css` possui:

```text
823 linhas
122 seletores diferentes
29 seletores repetidos
```

Existem diversas regras posteriores sobrescrevendo regras anteriores.

O `chaveamento.html` possui grande quantidade de CSS interno.

A limpeza visual deve ocorrer somente depois das correções de segurança e arquitetura.

---

## 19. Principais riscos identificados

### Risco 1: banco público sem RLS

Impacto:

* leitura de dados;
* alteração de palpites;
* alteração de jogos;
* alteração de resultados;
* exclusão de registros.

---

### Risco 2: senhas em texto aberto

Impacto:

* exposição das senhas;
* acesso indevido a contas;
* vazamento pelo banco ou pelo arquivo JSON.

---

### Risco 3: senha administrativa no JavaScript

Impacto:

* descoberta pelo código-fonte;
* acesso à interface administrativa.

---

### Risco 4: funções administrativas públicas

Impacto:

* reprocessamento indevido do chaveamento;
* alterações em jogos futuros.

---

### Risco 5: regra duplicada de pontuação

Impacto:

* totais corretos no banco;
* resumo incorreto no navegador;
* desempates potencialmente incorretos.

---

### Risco 6: alteração de fases anteriores

A correção do resultado de uma fase anterior pode mudar um confronto futuro.

Resultados e palpites já registrados para o confronto futuro podem permanecer associados ao jogo depois da troca dos times.

Esse cenário precisa de uma validação específica na versão revisada.

---

### Risco 7: fase atual definida no código

Cada mudança de fase exige alteração manual e nova publicação.

---

## 20. Pontos positivos

O sistema possui uma base funcional importante:

* login de participantes;
* salvamento de palpites;
* prevenção de palpites duplicados;
* resultados oficiais;
* ranking geral;
* ranking do mata-mata;
* chaveamento automático;
* tratamento de empate no mata-mata;
* tela de chaveamento;
* deploy funcional;
* dados íntegros;
* pontuação SQL correta.

A revisão não partirá do zero.

---

## 21. Ordem recomendada das próximas Sprints

### Sprint 1

Backup e documentação oficial.

### Sprint 2

Retirada de arquivos sensíveis e organização inicial do repositório.

### Sprint 3

Unificação da regra de pontuação e dos critérios de desempate.

### Sprint 4

Planejamento da autenticação segura.

### Sprint 5

Implantação controlada do RLS e das políticas.

### Sprint 6

Restrição das funções administrativas.

### Sprint 7

Cadastro e gestão de participantes.

### Sprint 8

Controle da competição e da fase atual.

### Sprint 9

Auditoria oficial de pontuação.

### Sprint 10

Limpeza e organização do código.

### Sprint 11

Melhorias visuais.

---

## 22. Regra para futuras alterações

Toda alteração deverá informar:

* objetivo;
* arquivo ou objeto afetado;
* impacto;
* risco;
* procedimento de backup;
* teste necessário;
* resultado esperado.

Cada Sprint deve possuir um único objetivo principal.

Sempre que possível, será alterado um arquivo completo por vez.

---

## 23. Estado final da auditoria

O sistema atual está funcional e os dados estão íntegros.

A pontuação calculada pelo banco está correta.

As principais fragilidades estão relacionadas a:

* segurança;
* duplicação de regras;
* dependência do navegador;
* arquivos antigos publicados;
* ausência de documentação;
* configurações escritas diretamente no código.

Nenhuma mudança estrutural foi aplicada durante a Sprint 0.

Este documento registra oficialmente o estado encontrado antes do início das correções.
