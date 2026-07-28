# Fechamento da Sprint 3 — Unificação da Pontuação e Desempate

Data de fechamento: 28/07/2026

## 1. Objetivo da Sprint

A Sprint 3 teve como objetivo eliminar divergências entre as diferentes formas de cálculo do ranking do Bolão MODAL Web.

Antes desta Sprint, a pontuação poderia ser obtida por diferentes caminhos:

- VIEW `ranking`;
- RPC `ranking()`;
- RPC `ranking_mata_mata()`;
- recálculo realizado pelo arquivo `js/ranking.js`;
- consultas SQL manuais de auditoria.

O principal risco era existir mais de uma implementação das regras de pontuação e desempate.

A solução adotada foi criar uma função SQL completa e centralizada, mantendo temporariamente as estruturas antigas para comparação e rollback.

---

## 2. Nova fonte oficial

A função criada foi:

```sql
public.ranking_completo()

Ela passou a ser a fonte oficial para:

pontuação total;
pontuação da fase de grupos;
pontuação do mata-mata;
pontuação por fase eliminatória;
quantidade de acertos de 10 pontos;
quantidade de acertos de 6 pontos;
quantidade de acertos de 4 pontos;
quantidade de acertos de 2 pontos;
quantidade de palpites com 0 ponto;
jogos com palpite;
jogos sem palpite;
jogos pendentes;
critérios de desempate;
posição final do participante.

A função entrega o ranking já calculado e ordenado.

O navegador não precisa mais recalcular os pontos.

3. Regras oficiais de pontuação

A função ranking_completo() implementa as seguintes regras:

10 pontos

Placar exato.

Exemplo:

Resultado: 2 x 1
Palpite:   2 x 1
Pontos:    10
6 pontos

Vencedor correto e quantidade exata de gols de um dos lados.

Exemplos:

Resultado: 2 x 1
Palpite:   2 x 0
Pontos:    6
Resultado: 2 x 1
Palpite:   3 x 1
Pontos:    6
4 pontos por vencedor

Acerto somente do vencedor, sem acertar os gols de nenhum dos lados.

Exemplo:

Resultado: 2 x 1
Palpite:   3 x 2
Pontos:    4
4 pontos por empate

Palpite de empate não exato quando o resultado oficial também for empate.

Exemplo:

Resultado: 2 x 2
Palpite:   1 x 1
Pontos:    4
2 pontos

Quantidade exata de gols de qualquer um dos lados, sem enquadramento nas regras superiores.

Exemplos:

Resultado: 2 x 1
Palpite:   0 x 1
Pontos:    2
Resultado: 2 x 1
Palpite:   2 x 2
Pontos:    2
0 ponto

Demais situações.

As categorias não são acumuladas.

Cada palpite recebe somente a maior categoria aplicável, seguindo a ordem oficial das regras.

4. Critérios oficiais de desempate

A classificação é ordenada pelos seguintes critérios:

maior pontuação total;
maior quantidade de acertos de 10 pontos;
maior quantidade de acertos de 6 pontos;
maior quantidade de acertos de 4 pontos;
maior quantidade de acertos de 2 pontos;
nome do participante em ordem alfabética;
ID do participante como segurança final.

O desempate é realizado diretamente no PostgreSQL.

O JavaScript não executa nenhum sort() para alterar a classificação recebida.

5. Resultado auditado

A função foi validada com os 19 participantes cadastrados.

Ranking final confirmado:

Posição	Participante	Pontos
1	Cesar	450
2	Rauany	448
3	Cadu	436
4	Márcio	414
5	Gabriela	414
6	Sandra	410
7	Christiana	410
8	Daniel	406
9	Sabrina	404
10	Letícia	404
11	Marcos	388
12	Caio	384
13	Elaine	362
14	Ricardo	346
15	Rissiara	324
16	Grace	324
17	Fátima	302
18	Andrea	102
19	Sirlene	66

Desempates confirmados:

Márcio antes de Gabriela;
Sandra antes de Christiana;
Sabrina antes de Letícia;
Rissiara antes de Grace.
6. Validações matemáticas

Para todos os participantes foi confirmada a igualdade:

pontos =
    acertos_10 × 10
  + acertos_6  × 6
  + acertos_4  × 4
  + acertos_2  × 2

Também foi confirmada:

pontos = pontos_grupos + pontos_mata_mata

A contabilização dos jogos respeitou:

jogos pontuados
+ jogos sem palpite
+ jogos pendentes
= total de jogos

Foram considerados 104 jogos.

Ao final da auditoria:

Participantes analisados: 19
Jogos cadastrados: 104
Jogos pendentes: 0
Divergências encontradas: 0
7. Comparação com as estruturas anteriores

A nova função foi comparada com:

VIEW ranking;
RPC ranking();
RPC ranking_mata_mata().

Resultados obtidos:

ranking_completo().pontos
= VIEW ranking.pontos
= RPC ranking().pontos

Para o mata-mata:

ranking_completo().pontos_mata_mata
= RPC ranking_mata_mata().pontos

Resultado geral:

19 participantes comparados
19 resultados corretos
0 divergências
8. Alteração no JavaScript

O arquivo alterado foi:

js/ranking.js

Antes da Sprint 3, o arquivo:

consultava diretamente participantes;
consultava diretamente palpites;
consultava diretamente resultados;
recalculava a pontuação no navegador;
ordenava o ranking localmente;
poderia aplicar regras diferentes das regras do banco.

Depois da Sprint 3, o arquivo:

chama somente a RPC ranking_completo();
recebe a classificação já ordenada;
renderiza o ranking principal;
renderiza o Resumo de Pontos;
exibe os dados de desempate nos tooltips;
não calcula pontuação;
não ordena participantes;
não consulta diretamente palpites ou resultados.

A chamada foi confirmada no navegador:

RPC: ranking_completo
Método: fetch
Status HTTP: 200
9. Estruturas antigas preservadas

As seguintes estruturas ainda não foram removidas:

VIEW ranking
RPC ranking()
RPC ranking_mata_mata()

Elas foram mantidas temporariamente por segurança.

A remoção só poderá acontecer depois de uma auditoria completa de uso, verificando se algum outro arquivo, página ou processo ainda depende delas.

Não remover essas estruturas sem pesquisa no repositório e teste em ambiente controlado.

10. Rollback
Rollback do JavaScript

Para restaurar a versão anterior do arquivo:

git log --oneline

Identificar o commit anterior e executar um git revert do commit da Sprint 3.3.

Alternativamente, antes de um novo commit local:

git restore js/ranking.js
Rollback do banco

A função nova pode ser removida com:

DROP FUNCTION IF EXISTS public.ranking_completo();

Essa remoção somente poderá ser executada depois de restaurar o JavaScript para uma versão que utilize uma das estruturas anteriores.

Nunca remover primeiro a função enquanto o sistema publicado estiver utilizando ranking_completo().

11. Situação ao final da Sprint
Fonte oficial: public.ranking_completo()
Pontuação centralizada: sim
Desempate centralizado: sim
Resumo centralizado: sim
Cálculo no navegador: removido
Ordenação no navegador: removida
Ranking validado: sim
Produção validada: sim
Rollback disponível: sim
Estruturas antigas preservadas: sim
12. Próximos passos recomendados
pesquisar todas as referências a ranking, ranking() e ranking_mata_mata() no repositório;
identificar páginas que ainda utilizam as funções antigas;
migrar essas páginas para ranking_completo(), quando aplicável;
criar uma função oficial de auditoria detalhada por participante e jogo;
documentar a futura remoção das estruturas antigas;
somente depois disso, avaliar a exclusão das funções e VIEWs legadas.
13. Conclusão

A Sprint 3 eliminou a duplicidade de lógica entre banco de dados e navegador.

A pontuação, os resumos e os critérios de desempate passaram a ter uma única origem oficial.

Com isso, qualquer tela futura poderá consultar a mesma função e receber resultados consistentes, auditáveis e já ordenados.