// =====================================================
// ENGINE - COMPETIÇÃO
// Copa do Mundo FIFA 2026
// =====================================================

import { gerarClassificacao } from './classificacao.js';
import { gerarChaveamento } from './chaveamento.js';

/**
 * Gera toda a estrutura da competição.
 *
 * @param {Array} jogos
 * @param {Array} resultados
 * @returns {Object}
 */
export function gerarCompeticao(jogos, resultados) {

    const classificacao =
        gerarClassificacao(
            jogos,
            resultados
        );

    const chaveamento =
        gerarChaveamento(
            classificacao
        );

    const atualizacoesJogos =
        gerarAtualizacoesJogos(
            jogos,
            resultados,
            chaveamento
        );

    return {

        classificacao,

        chaveamento,

        atualizacoesJogos

    };

}

/**
 * Gera a lista de jogos que precisam ser atualizados no banco.
 */
function gerarAtualizacoesJogos(jogos, resultados, chaveamento) {

    const atualizacoes = [];

    const jogosPorId = criarMapaPorId(jogos);
    const resultadosPorJogo = criarMapaResultados(resultados);

    const fases = [

        chaveamento.dezesseisAvos,

        chaveamento.oitavas,

        chaveamento.quartas,

        chaveamento.semifinal,

        chaveamento.terceiroLugar,

        chaveamento.final

    ];

    fases.forEach(fase => {

        fase.forEach(confronto => {

            const jogoAtual =
                jogosPorId.get(
                    Number(confronto.id)
                );

            if (!jogoAtual) {
                return;
            }

            const novoJogo =
                montarNovoJogo(
                    confronto,
                    jogosPorId,
                    resultadosPorJogo
                );

            if (jogoMudou(jogoAtual, novoJogo)) {

                atualizacoes.push(novoJogo);

            }

        });

    });

    return atualizacoes;

}

/**
 * Monta o novo estado de um jogo.
 */
function montarNovoJogo(confronto, jogosPorId, resultadosPorJogo) {

    const mandante =
        resolverParticipante(
            confronto.mandante,
            confronto.origemMandante,
            jogosPorId,
            resultadosPorJogo
        );

    const visitante =
        resolverParticipante(
            confronto.visitante,
            confronto.origemVisitante,
            jogosPorId,
            resultadosPorJogo
        );

    return {

        id: confronto.id,

        mandante,

        visitante,

        origem_mandante: confronto.origemMandante ?? null,

        origem_visitante: confronto.origemVisitante ?? null

    };

}

/**
 * Resolve participante fixo ou origem V/P.
 */
function resolverParticipante(
    nomeAtual,
    origem,
    jogosPorId,
    resultadosPorJogo
) {

    if (nomeAtual && nomeAtual !== 'A definir') {
        return nomeAtual;
    }

    if (!origem) {
        return 'A definir';
    }

    if (
        !origem.startsWith('V') &&
        !origem.startsWith('P')
    ) {
        return 'A definir';
    }

    const tipo = origem.substring(0, 1);
    const jogoId = Number(origem.substring(1));

    const jogoOrigem =
        jogosPorId.get(jogoId);

    const resultadoOrigem =
        resultadosPorJogo.get(jogoId);

    if (!jogoOrigem || !resultadoOrigem) {
        return 'A definir';
    }

    return resolverVencedorOuPerdedor(
        tipo,
        jogoOrigem,
        resultadoOrigem
    );

}

/**
 * Resolve V ou P de um jogo.
 */
function resolverVencedorOuPerdedor(tipo, jogo, resultado) {

    const golsMandante =
        resultado.mandante;

    const golsVisitante =
        resultado.visitante;

    if (
        golsMandante === null ||
        golsMandante === undefined ||
        golsVisitante === null ||
        golsVisitante === undefined
    ) {
        return 'A definir';
    }

    let vencedor = null;
    let perdedor = null;

    if (Number(golsMandante) > Number(golsVisitante)) {

        vencedor = jogo.mandante;
        perdedor = jogo.visitante;

    }
    else if (Number(golsMandante) < Number(golsVisitante)) {

        vencedor = jogo.visitante;
        perdedor = jogo.mandante;

    }
    else {

        if (resultado.vencedor === 'MANDANTE') {

            vencedor = jogo.mandante;
            perdedor = jogo.visitante;

        }
        else if (resultado.vencedor === 'VISITANTE') {

            vencedor = jogo.visitante;
            perdedor = jogo.mandante;

        }
        else {

            return 'A definir';

        }

    }

    return tipo === 'V'
        ? vencedor
        : perdedor;

}

/**
 * Cria mapa de jogos por ID.
 */
function criarMapaPorId(jogos) {

    return new Map(
        jogos.map(jogo => [
            Number(jogo.id),
            jogo
        ])
    );

}

/**
 * Cria mapa de resultados por jogo_id.
 */
function criarMapaResultados(resultados) {

    return new Map(
        resultados.map(resultado => [
            Number(resultado.jogo_id),
            resultado
        ])
    );

}

/**
 * Verifica se algum campo importante mudou.
 */
function jogoMudou(jogoAtual, novoJogo) {

    return (
        normalizar(jogoAtual.mandante) !== normalizar(novoJogo.mandante) ||

        normalizar(jogoAtual.visitante) !== normalizar(novoJogo.visitante) ||

        normalizar(jogoAtual.origem_mandante) !== normalizar(novoJogo.origem_mandante) ||

        normalizar(jogoAtual.origem_visitante) !== normalizar(novoJogo.origem_visitante)
    );

}

/**
 * Normaliza valores para comparação.
 */
function normalizar(valor) {

    return valor === undefined || valor === null
        ? null
        : String(valor);

}