# Fechamento da Sprint 4: Auditoria Oficial da Pontuação

Data de fechamento: 29/07/2026

## 1. Objetivo da Sprint

A Sprint 4 teve como objetivo criar uma estrutura oficial de auditoria da pontuação do Bolão MODAL Web.

A auditoria precisava permitir:

- identificar a pontuação de cada palpite;
- mostrar qual regra foi aplicada;
- consultar todos os jogos de um participante;
- comparar a auditoria com o ranking oficial;
- encontrar divergências entre pontuação detalhada e pontuação consolidada;
- preparar a base para uma futura tela visual de auditoria.

Nenhuma regra do ranking foi alterada durante esta Sprint.

---

## 2. Estrutura criada

Foram criadas duas funções SQL:

```sql
public.avaliar_palpite_oficial()
public.auditoria_pontuacao()

Os códigos também foram armazenados no repositório:

sql/avaliar_palpite_oficial.sql
sql/auditoria_pontuacao.sql
3. Função avaliar_palpite_oficial()

A função:

public.avaliar_palpite_oficial(
  p_palpite_mandante integer,
  p_palpite_visitante integer,
  p_resultado_mandante integer,
  p_resultado_visitante integer
)

recebe:

placar do palpite;
placar do resultado oficial.

E retorna:

pontos
regra_codigo
regra_descricao

A função foi criada como:

Linguagem: SQL
Volatilidade: IMMUTABLE
Segurança: SECURITY INVOKER
Search path: public

Foi concedida permissão de execução para:

anon
authenticated
4. Regras identificadas pela função
Placar exato
Código: PLACAR_EXATO
Pontuação: 10

Exemplo:

Resultado: 2 x 1
Palpite:   2 x 1
Vencedor e gols exatos de um dos lados
Código: VENCEDOR_E_UM_PLACAR
Pontuação: 6

Exemplos:

Resultado: 2 x 1
Palpite:   2 x 0
Resultado: 2 x 1
Palpite:   3 x 1
Vencedor correto
Código: ACERTOU_VENCEDOR
Pontuação: 4

Exemplo:

Resultado: 2 x 1
Palpite:   3 x 2
Empate não exato
Código: EMPATE_NAO_EXATO
Pontuação: 4

Exemplo:

Resultado: 2 x 2
Palpite:   1 x 1
Gols exatos de um dos lados
Código: ACERTOU_GOLS_DE_UM_LADO
Pontuação: 2

Exemplos:

Resultado: 2 x 1
Palpite:   0 x 1
Resultado: 2 x 1
Palpite:   2 x 2
Nenhum acerto
Código: SEM_ACERTO
Pontuação: 0
Participante sem palpite
Código: SEM_PALPITE
Pontuação: 0
Palpite aguardando resultado
Código: PENDENTE
Pontuação: NULL
Jogo ainda não iniciado
Código: NAO_INICIADO
Pontuação: NULL
5. Teste isolado do avaliador

A função avaliar_palpite_oficial() foi testada com 11 cenários.

Resultados confirmados:

Cenário	Pontos	Código
Placar exato	10	PLACAR_EXATO
Seis pontos pelo placar do mandante	6	VENCEDOR_E_UM_PLACAR
Seis pontos pelo placar do visitante	6	VENCEDOR_E_UM_PLACAR
Somente vencedor	4	ACERTOU_VENCEDOR
Empate não exato	4	EMPATE_NAO_EXATO
Dois pontos pelo visitante	2	ACERTOU_GOLS_DE_UM_LADO
Dois pontos pelo mandante	2	ACERTOU_GOLS_DE_UM_LADO
Zero ponto	0	SEM_ACERTO
Sem palpite	0	SEM_PALPITE
Resultado pendente	NULL	PENDENTE
Jogo não iniciado	NULL	NAO_INICIADO

Resultado final:

Cenários testados: 11
Cenários corretos: 11
Divergências: 0
6. Função auditoria_pontuacao()

A função:

public.auditoria_pontuacao(
  p_participante_id bigint default null
)

utiliza internamente:

public.avaliar_palpite_oficial()

Ela cruza:

participantes
jogos
palpites
resultados

Quando um participante é informado, a função retorna somente os jogos dele.

Quando o parâmetro é NULL, a função retorna a auditoria de todos os participantes.

7. Campos retornados pela auditoria

A função retorna:

participante_id
participante_nome
jogo_id
fase
grupo
rodada
mandante
visitante
palpite_mandante
palpite_visitante
resultado_mandante
resultado_visitante
pontos
regra_codigo
regra_descricao
status_auditoria

Os possíveis valores de status_auditoria são:

AUDITADO
SEM_PALPITE
AGUARDANDO_RESULTADO
8. Validação com o participante Cesar

A auditoria foi executada para o participante Cesar.

Resultado:

Total de jogos:       104
Acertos de 10:         13
Acertos de 6:          30
Acertos de 4:          27
Acertos de 2:          16
Palpites com 0:        18
Jogos sem palpite:      0
Jogos pendentes:        0
Pontuação total:      450

Validação matemática:

13 × 10 = 130
30 ×  6 = 180
27 ×  4 = 108
16 ×  2 =  32
-----------------
Total     = 450

A pontuação retornada pela auditoria foi igual à pontuação do ranking_completo().

9. Comparação com todos os participantes

A auditoria detalhada foi agrupada por participante e comparada com:

public.ranking_completo()

Foram comparados:

pontos totais
acertos de 10
acertos de 6
acertos de 4
acertos de 2
palpites com 0 ponto
jogos sem palpite
jogos pendentes

Resultado final:

Participantes comparados: 19
Participantes corretos:   19
Divergências:              0
Diferença de pontos:       0
10. Ajuste realizado na consulta de validação

Na primeira consulta comparativa, os jogos com código:

SEM_PALPITE

foram incluídos incorretamente na quantidade de palpites com zero ponto.

Isso aconteceu porque a consulta utilizava:

count(*) filter (
  where pontos = 0
)

A função estava correta, pois SEM_PALPITE realmente retorna zero ponto.

O erro estava somente no agrupamento da consulta de validação.

A contagem correta passou a utilizar:

count(*) filter (
  where pontos = 0
    and regra_codigo = 'SEM_ACERTO'
)

Depois dessa correção:

19 participantes ficaram com status OK
0 divergências foram encontradas

Nenhuma alteração foi necessária nas funções SQL.

11. Auditoria detalhada jogo por jogo

Os jogos do Cesar foram consultados individualmente com:

confronto
palpite
resultado
pontos
regra aplicada
status da auditoria

A consulta retornou os jogos em ordem de jogo_id.

O Supabase exibiu inicialmente apenas as primeiras 100 linhas na exportação.

Por isso, os jogos abaixo foram consultados separadamente:

101
102
103
104

Resultados:

Jogo	Confronto	Palpite	Resultado	Pontos	Regra
101	França x Espanha	2 x 1	0 x 2	0	SEM_ACERTO
102	Inglaterra x Argentina	2 x 1	1 x 2	0	SEM_ACERTO
103	França x Inglaterra	2 x 3	4 x 6	4	ACERTOU_VENCEDOR
104	Espanha x Argentina	1 x 1	0 x 0	4	EMPATE_NAO_EXATO

Fechamento:

Jogos 1 a 100:   442 pontos
Jogos 101 a 104:   8 pontos
Total:            450 pontos
12. Situação ao final da Sprint
Avaliador oficial criado: sim
Auditoria por jogo criada: sim
Auditoria por participante criada: sim
Auditoria geral criada: sim
Regras identificadas: sim
Descrições das regras: sim
Comparação com ranking: concluída
Participantes comparados: 19
Divergências encontradas: 0
Arquivos SQL versionados: preparados
Alteração no JavaScript: não
Alteração visual: não
13. Estruturas não alteradas

Durante esta Sprint não foram modificados:

ranking_completo()
VIEW ranking
RPC ranking()
RPC ranking_mata_mata()
js/ranking.js
arquivos HTML
arquivos CSS

A auditoria foi criada paralelamente, sem interferir no sistema publicado.

14. Rollback

Para remover a auditoria detalhada:

drop function if exists public.auditoria_pontuacao(bigint);

Para remover o avaliador oficial:

drop function if exists public.avaliar_palpite_oficial(
  integer,
  integer,
  integer,
  integer
);

A função auditoria_pontuacao() depende de avaliar_palpite_oficial().

Portanto, em caso de remoção, a ordem correta é:

1. remover auditoria_pontuacao()
2. remover avaliar_palpite_oficial()

Nenhuma dessas remoções altera diretamente o ranking atual, pois o ranking_completo() ainda não depende dessas funções.

15. Próximos passos recomendados
criar uma página visual de auditoria;
permitir a seleção de participante;
exibir confronto, palpite, resultado, pontos e regra;
criar filtros por fase e tipo de pontuação;
permitir pesquisa por participante ou jogo;
permitir exportação da auditoria;
avaliar futuramente o uso do avaliador oficial dentro do ranking_completo();
somente alterar o ranking depois de nova comparação controlada.
16. Conclusão

A Sprint 4 criou uma trilha completa entre o palpite e a pontuação final.

Agora é possível verificar exatamente:

quem realizou o palpite
em qual jogo
qual foi o placar informado
qual foi o resultado oficial
quantos pontos foram recebidos
qual regra justificou a pontuação

A auditoria reproduziu corretamente o ranking oficial dos 19 participantes, sem nenhuma divergência.