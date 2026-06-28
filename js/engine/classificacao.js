// =====================================================
// ENGINE - CLASSIFICAÇÃO
// Copa do Mundo FIFA 2026
// =====================================================

import { CONFIG } from './config.js';

export function gerarClassificacao(jogos, resultados) {

    const partidas = montarPartidas(jogos, resultados);

    const grupos = criarGrupos();

    partidas.forEach(partida => {

        adicionarTime(grupos[partida.grupo], partida.mandante);
        adicionarTime(grupos[partida.grupo], partida.visitante);

    });

    partidas.forEach(partida => {

        if (
            partida.golsMandante === null ||
            partida.golsVisitante === null
        ) {
            return;
        }

        calcularPartida(grupos, partida);

    });

    ordenarGrupos(grupos);

    const classificados = gerarClassificados(grupos);

    return {

        partidas,

        grupos,

        classificados

    };

}

function criarGrupos() {

    const grupos = {};

    CONFIG.GRUPOS.forEach(grupo => {

        grupos[grupo] = [];

    });

    return grupos;

}

function montarPartidas(jogos, resultados) {

    return jogos
        .filter(jogo => jogo.fase === CONFIG.FASES.GRUPO)
        .map(jogo => {

            const resultado = resultados.find(
                r => Number(r.jogo_id) === Number(jogo.id)
            );

            return {

                id: jogo.id,

                grupo: jogo.grupo,

                rodada: jogo.rodada,

                mandante: jogo.mandante,

                visitante: jogo.visitante,

                golsMandante: resultado ? resultado.mandante : null,

                golsVisitante: resultado ? resultado.visitante : null

            };

        });

}

function adicionarTime(grupo, nome) {

    const existe = grupo.find(time => time.nome === nome);

    if (existe) {
        return;
    }

    grupo.push({

        nome,

        pontos: 0,

        jogos: 0,

        vitorias: 0,

        empates: 0,

        derrotas: 0,

        golsPro: 0,

        golsContra: 0,

        saldo: 0

    });

}

function calcularPartida(grupos, partida) {

    const grupo = grupos[partida.grupo];

    const mandante = grupo.find(
        time => time.nome === partida.mandante
    );

    const visitante = grupo.find(
        time => time.nome === partida.visitante
    );

    mandante.jogos++;
    visitante.jogos++;

    mandante.golsPro += partida.golsMandante;
    visitante.golsPro += partida.golsVisitante;

    mandante.golsContra += partida.golsVisitante;
    visitante.golsContra += partida.golsMandante;

    mandante.saldo = mandante.golsPro - mandante.golsContra;
    visitante.saldo = visitante.golsPro - visitante.golsContra;

    if (partida.golsMandante > partida.golsVisitante) {

        mandante.vitorias++;
        mandante.pontos += 3;

        visitante.derrotas++;

    }
    else if (partida.golsMandante < partida.golsVisitante) {

        visitante.vitorias++;
        visitante.pontos += 3;

        mandante.derrotas++;

    }
    else {

        mandante.empates++;
        visitante.empates++;

        mandante.pontos++;
        visitante.pontos++;

    }

}

function ordenarGrupos(grupos) {

    Object.keys(grupos).forEach(grupo => {

        grupos[grupo].sort((a, b) => {

            if (b.pontos !== a.pontos) {
                return b.pontos - a.pontos;
            }

            if (b.saldo !== a.saldo) {
                return b.saldo - a.saldo;
            }

            if (b.golsPro !== a.golsPro) {
                return b.golsPro - a.golsPro;
            }

            return a.nome.localeCompare(b.nome);

        });

    });

}

function gerarClassificados(grupos) {

    const primeiros = [];
    const segundos = [];
    const terceiros = [];

    CONFIG.GRUPOS.forEach(grupo => {

        if (grupos[grupo][0]) {

            primeiros.push({
                ...grupos[grupo][0],
                grupo,
                posicao: 1,
                origem: `1${grupo}`
            });

        }

        if (grupos[grupo][1]) {

            segundos.push({
                ...grupos[grupo][1],
                grupo,
                posicao: 2,
                origem: `2${grupo}`
            });

        }

        if (grupos[grupo][2]) {

            terceiros.push({
                ...grupos[grupo][2],
                grupo,
                posicao: 3,
                origem: `3${grupo}`
            });

        }

    });

    terceiros.sort((a, b) => {

        if (b.pontos !== a.pontos) {
            return b.pontos - a.pontos;
        }

        if (b.saldo !== a.saldo) {
            return b.saldo - a.saldo;
        }

        if (b.golsPro !== a.golsPro) {
            return b.golsPro - a.golsPro;
        }

        return a.nome.localeCompare(b.nome);

    });

    return {

        primeiros,

        segundos,

        terceiros: terceiros.slice(
            0,
            CONFIG.MELHORES_TERCEIROS
        )

    };

}