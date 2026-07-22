# Bolão MODAL Web

## Regras Oficiais de Pontuação e Desempate

**Projeto:** Bolão MODAL Web
**Etapa:** Revisão Geral 2030
**Documento:** Regras oficiais de pontuação
**Versão:** 1.0
**Data:** 22 de julho de 2026
**Status:** Regra oficial validada pela auditoria do sistema de 2026

---

## 1. Objetivo

Este documento define a regra oficial de pontuação do Bolão MODAL Web.

Ele deve ser utilizado como referência única para:

* funções SQL;
* arquivos JavaScript;
* ranking geral;
* ranking da fase de grupos;
* ranking do mata-mata;
* auditoria de pontuação;
* critérios de desempate;
* página pública de regras;
* futuras edições da competição.

Nenhum arquivo ou função deve implementar uma regra diferente da descrita neste documento.

---

## 2. Valores possíveis

Cada palpite pode receber:

```text
10 pontos
6 pontos
4 pontos
2 pontos
0 pontos
```

Um jogo sem palpite não deve ser contabilizado como um palpite de zero ponto.

O sistema deve diferenciar:

```text
Palpite incorreto: 0 pontos
Sem palpite: ausência de registro
```

---

## 3. Ordem obrigatória de avaliação

A regra deve ser verificada nesta ordem:

```text
1. Placar exato
2. Empate não exato
3. Vencedor e gols de um dos times
4. Apenas vencedor
5. Gols de qualquer um dos times
6. Demais casos
```

Essa ordem é obrigatória.

Caso a avaliação seja realizada em outra sequência, um palpite que deveria receber 6 pontos pode acabar sendo classificado como 2 pontos.

---

## 4. Placar exato: 10 pontos

O participante recebe 10 pontos quando acerta exatamente:

* os gols do mandante;
* os gols do visitante.

### Exemplo

```text
Palpite:   Brasil 2 x 1 Argentina
Resultado: Brasil 2 x 1 Argentina
Pontuação: 10 pontos
```

### Condição lógica

```text
palpite_mandante = resultado_mandante

E

palpite_visitante = resultado_visitante
```

---

## 5. Empate não exato: 4 pontos

O participante recebe 4 pontos quando:

* apostou em empate;
* o jogo terminou empatado;
* o placar não foi exato.

### Exemplo

```text
Palpite:   Brasil 2 x 2 Argentina
Resultado: Brasil 1 x 1 Argentina
Pontuação: 4 pontos
```

O participante acertou o resultado esportivo do jogo, que foi empate, mas não acertou o placar exato.

### Condição lógica

```text
palpite_mandante = palpite_visitante

E

resultado_mandante = resultado_visitante
```

Essa verificação deve ocorrer depois do placar exato.

---

## 6. Vencedor e gols de um dos times: 6 pontos

O participante recebe 6 pontos quando:

* acerta quem venceu;
* acerta os gols do mandante ou do visitante;
* não acerta o placar completo.

### Exemplo 1

```text
Palpite:   Brasil 1 x 3 Argentina
Resultado: Brasil 0 x 3 Argentina
Pontuação: 6 pontos
```

O participante acertou:

* vitória da Argentina;
* três gols da Argentina.

### Exemplo 2

```text
Palpite:   Brasil 2 x 0 Argentina
Resultado: Brasil 2 x 1 Argentina
Pontuação: 6 pontos
```

O participante acertou:

* vitória do Brasil;
* dois gols do Brasil.

### Condição lógica

Primeiro, deve existir coincidência no vencedor:

```text
palpite_mandante > palpite_visitante
E
resultado_mandante > resultado_visitante
```

ou:

```text
palpite_mandante < palpite_visitante
E
resultado_mandante < resultado_visitante
```

Além disso, pelo menos um dos placares deve coincidir:

```text
palpite_mandante = resultado_mandante
```

ou:

```text
palpite_visitante = resultado_visitante
```

---

## 7. Apenas vencedor: 4 pontos

O participante recebe 4 pontos quando:

* acerta quem venceu;
* não acerta os gols de nenhum dos times;
* não acerta o placar exato.

### Exemplo

```text
Palpite:   Brasil 3 x 2 Argentina
Resultado: Brasil 2 x 1 Argentina
Pontuação: 4 pontos
```

O participante acertou somente que o Brasil venceria.

### Condição lógica

```text
palpite_mandante > palpite_visitante
E
resultado_mandante > resultado_visitante
```

ou:

```text
palpite_mandante < palpite_visitante
E
resultado_mandante < resultado_visitante
```

Essa verificação deve ocorrer depois da regra de 6 pontos.

---

## 8. Gols de qualquer um dos times: 2 pontos

O participante recebe 2 pontos quando:

* não acerta o vencedor ou o empate;
* acerta os gols do mandante ou do visitante.

### Exemplo 1

```text
Palpite:   Brasil 2 x 2 Argentina
Resultado: Brasil 0 x 2 Argentina
Pontuação: 2 pontos
```

O participante acertou os dois gols da Argentina, mas errou o resultado do jogo.

### Exemplo 2

```text
Palpite:   Brasil 1 x 3 Argentina
Resultado: Brasil 1 x 0 Argentina
Pontuação: 2 pontos
```

O participante acertou um gol do Brasil, mas apostou na vitória da Argentina.

### Condição lógica

```text
palpite_mandante = resultado_mandante
```

ou:

```text
palpite_visitante = resultado_visitante
```

Essa verificação deve ocorrer somente depois das regras de 10, 6 e 4 pontos.

---

## 9. Demais casos: 0 pontos

O participante recebe zero ponto quando não se enquadra em nenhuma das regras anteriores.

### Exemplo

```text
Palpite:   Brasil 3 x 1 Argentina
Resultado: Brasil 0 x 2 Argentina
Pontuação: 0 pontos
```

O participante não acertou:

* o placar;
* o vencedor;
* o empate;
* os gols do mandante;
* os gols do visitante.

---

## 10. Fluxo oficial de cálculo

O cálculo deve seguir esta lógica:

```text
Se não existir palpite:
    classificar como sem palpite

Senão, se o placar for exato:
    10 pontos

Senão, se o palpite e o resultado forem empates:
    4 pontos

Senão, se acertou o vencedor e os gols de um dos lados:
    6 pontos

Senão, se acertou somente o vencedor:
    4 pontos

Senão, se acertou os gols de qualquer um dos lados:
    2 pontos

Senão:
    0 pontos
```

---

## 11. Referência SQL

A estrutura oficial de cálculo deve seguir este modelo:

```sql
CASE
    WHEN palpite_id IS NULL
        THEN NULL

    WHEN palpite_mandante = resultado_mandante
     AND palpite_visitante = resultado_visitante
        THEN 10

    WHEN palpite_mandante = palpite_visitante
     AND resultado_mandante = resultado_visitante
        THEN 4

    WHEN (
        (
            palpite_mandante > palpite_visitante
            AND resultado_mandante > resultado_visitante
        )
        OR
        (
            palpite_mandante < palpite_visitante
            AND resultado_mandante < resultado_visitante
        )
    )
    AND (
        palpite_mandante = resultado_mandante
        OR palpite_visitante = resultado_visitante
    )
        THEN 6

    WHEN (
        (
            palpite_mandante > palpite_visitante
            AND resultado_mandante > resultado_visitante
        )
        OR
        (
            palpite_mandante < palpite_visitante
            AND resultado_mandante < resultado_visitante
        )
    )
        THEN 4

    WHEN palpite_mandante = resultado_mandante
      OR palpite_visitante = resultado_visitante
        THEN 2

    ELSE 0
END
```

O valor `NULL` para ausência de palpite é recomendado para impedir que jogos não preenchidos sejam confundidos com palpites incorretos.

---

## 12. Referência JavaScript

A implementação JavaScript deve seguir esta estrutura:

```javascript
function calcularPontos(
    palpiteMandante,
    palpiteVisitante,
    resultadoMandante,
    resultadoVisitante
) {
    const semPalpite =
        palpiteMandante === null ||
        palpiteMandante === undefined ||
        palpiteVisitante === null ||
        palpiteVisitante === undefined;

    const semResultado =
        resultadoMandante === null ||
        resultadoMandante === undefined ||
        resultadoVisitante === null ||
        resultadoVisitante === undefined;

    if (semPalpite || semResultado) {
        return null;
    }

    if (
        palpiteMandante === resultadoMandante &&
        palpiteVisitante === resultadoVisitante
    ) {
        return 10;
    }

    const palpiteEmpate =
        palpiteMandante === palpiteVisitante;

    const resultadoEmpate =
        resultadoMandante === resultadoVisitante;

    if (palpiteEmpate && resultadoEmpate) {
        return 4;
    }

    const acertouVencedor =
        (
            palpiteMandante > palpiteVisitante &&
            resultadoMandante > resultadoVisitante
        )
        ||
        (
            palpiteMandante < palpiteVisitante &&
            resultadoMandante < resultadoVisitante
        );

    const acertouGolsMandante =
        palpiteMandante === resultadoMandante;

    const acertouGolsVisitante =
        palpiteVisitante === resultadoVisitante;

    if (
        acertouVencedor &&
        (acertouGolsMandante || acertouGolsVisitante)
    ) {
        return 6;
    }

    if (acertouVencedor) {
        return 4;
    }

    if (acertouGolsMandante || acertouGolsVisitante) {
        return 2;
    }

    return 0;
}
```

A regra deve existir preferencialmente em um único local oficial.

Outros arquivos devem consumir o resultado pronto, sem recriar versões paralelas da lógica.

---

## 13. Mata-mata e disputa por pênaltis

A pontuação considera apenas o placar oficial armazenado nos campos:

```text
mandante
visitante
```

O campo:

```text
vencedor
```

serve somente para definir qual seleção avança no chaveamento quando o placar termina empatado.

### Exemplo

```text
Resultado no tempo considerado pelo bolão:
Brasil 1 x 1 Argentina

Vencedor da disputa:
Brasil
```

Para a pontuação, o resultado continua sendo:

```text
1 x 1
```

O participante não recebe pontos adicionais por acertar quem avançou nos pênaltis, pois o sistema atual não possui palpite específico para classificação ou disputa de pênaltis.

---

## 14. Jogos sem resultado

Um jogo sem resultado oficial não deve gerar pontuação.

O sistema deve retornar:

```text
Pendente
```

ou:

```text
NULL
```

Ele não deve ser contabilizado como zero ponto.

---

## 15. Jogos sem palpite

Um jogo sem palpite deve ser apresentado como:

```text
Sem palpite
```

Ele não deve ser misturado com:

```text
Palpite feito e pontuação igual a zero
```

Na auditoria e no resumo do participante, devem existir contagens separadas:

```text
Acertos de 10 pontos
Acertos de 6 pontos
Acertos de 4 pontos
Acertos de 2 pontos
Palpites de 0 ponto
Jogos sem palpite
Jogos pendentes
```

---

## 16. Pontuação total

A pontuação total do participante corresponde à soma dos pontos obtidos em todos os jogos válidos.

```text
Pontuação total =
soma de todos os resultados de 10, 6, 4, 2 e 0 pontos
```

Jogos sem palpite e jogos sem resultado não alteram a soma.

---

## 17. Rankings por fase

A mesma regra de pontuação deve ser utilizada em todos os rankings.

### Ranking geral

Considera todos os jogos da competição.

### Ranking da fase de grupos

Considera apenas:

```text
fase = GRUPO
```

### Ranking do mata-mata

Considera:

```text
16AVOS
OITAVAS
QUARTAS
SEMIFINAL
TERCEIRO
FINAL
```

### Ranking por fase específica

Pode considerar apenas uma fase, por exemplo:

```text
fase = QUARTAS
```

Nenhum ranking deve possuir uma regra própria de pontuação.

---

## 18. Critérios oficiais de desempate

Quando dois ou mais participantes possuem a mesma pontuação, a classificação deve obedecer à seguinte ordem:

```text
1. Maior total de pontos
2. Maior quantidade de placares de 10 pontos
3. Maior quantidade de resultados de 6 pontos
4. Maior quantidade de resultados de 4 pontos
5. Maior quantidade de resultados de 2 pontos
6. Ordem alfabética do nome
```

### Exemplo

```text
Participante A:
414 pontos
17 resultados de 10 pontos

Participante B:
414 pontos
15 resultados de 10 pontos
```

O Participante A fica à frente.

---

## 19. Valor de zero ponto no desempate

A quantidade de palpites de zero ponto não deve beneficiar um participante no desempate.

Também não deve ser utilizada como critério para colocar alguém à frente.

O desempate termina após:

```text
10 pontos
6 pontos
4 pontos
2 pontos
nome
```

---

## 20. Ordem oficial do ranking

A consulta SQL deve utilizar uma ordenação equivalente a:

```sql
ORDER BY
    pontos_total DESC,
    acertos_10 DESC,
    acertos_6 DESC,
    acertos_4 DESC,
    acertos_2 DESC,
    nome ASC
```

Essa ordenação deve ser aplicada no banco ou sobre dados já calculados por uma única função oficial.

---

## 21. Auditoria por jogo

A futura auditoria oficial deve mostrar:

```text
Participante
Jogo
Seleção mandante
Seleção visitante
Palpite do participante
Resultado oficial
Pontuação recebida
Regra aplicada
```

Exemplo:

```text
Participante: Cesar
Jogo: Brasil x Argentina
Palpite: 2 x 1
Resultado: 2 x 0
Pontuação: 6
Regra: vencedor e gols do mandante
```

---

## 22. Cenários mínimos de teste

Toda alteração na regra de pontuação deve passar pelos testes abaixo.

| Palpite     | Resultado     | Pontos | Regra                        |
| ----------- | ------------- | -----: | ---------------------------- |
| 2 x 1       | 2 x 1         |     10 | Placar exato                 |
| 1 x 3       | 0 x 3         |      6 | Vencedor e gols do visitante |
| 2 x 0       | 2 x 1         |      6 | Vencedor e gols do mandante  |
| 3 x 2       | 2 x 1         |      4 | Apenas vencedor              |
| 2 x 2       | 1 x 1         |      4 | Empate não exato             |
| 2 x 2       | 0 x 2         |      2 | Gols do visitante            |
| 1 x 3       | 1 x 0         |      2 | Gols do mandante             |
| 3 x 1       | 0 x 2         |      0 | Demais casos                 |
| Sem palpite | 2 x 1         |   NULL | Sem palpite                  |
| 2 x 1       | Sem resultado |   NULL | Jogo pendente                |

---

## 23. Casos que não podem ser confundidos

### Empate não exato

```text
Palpite: 2 x 2
Resultado: 1 x 1
```

Resultado correto:

```text
4 pontos
```

Nunca zero ponto.

---

### Acerto de gols sem acertar o vencedor

```text
Palpite: 2 x 2
Resultado: 0 x 2
```

Resultado correto:

```text
2 pontos
```

Nunca zero ponto.

---

### Vencedor e gols de um lado

```text
Palpite: 2 x 0
Resultado: 2 x 1
```

Resultado correto:

```text
6 pontos
```

Nunca 2 pontos.

---

### Ausência de palpite

```text
Nenhum palpite registrado
```

Resultado correto:

```text
Sem palpite
```

Não deve aparecer como erro de zero ponto.

---

## 24. Regra de manutenção

Qualquer mudança futura na pontuação deverá:

1. atualizar este documento;
2. atualizar a função SQL oficial;
3. atualizar os testes;
4. atualizar a página pública de regras;
5. validar os rankings;
6. comparar os resultados antes e depois;
7. registrar a decisão em documentação.

Nenhuma regra deve ser alterada somente no JavaScript ou somente no SQL.

---

## 25. Fonte oficial

A partir da Revisão Geral 2030, este documento passa a ser a referência oficial das regras de pontuação e desempate do Bolão MODAL Web.

Em caso de divergência entre:

* documentos antigos;
* arquivos JavaScript;
* funções SQL;
* planilhas;
* mensagens anteriores;
* comportamento visual;

deve prevalecer a regra descrita neste documento, após validação formal do responsável pelo Bolão.
