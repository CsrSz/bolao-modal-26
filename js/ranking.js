async function carregarRanking() {
    try {
        const dados = await carregarDadosPontuacao();

        renderizarRankingPrincipal(dados.rankingOrdenado);
        renderizarResumoPontuacao(dados.resumoPorId);

    } catch (erro) {
        console.error('Erro ao carregar ranking:', erro);

        document.getElementById('ranking-body').innerHTML = `
            <tr><td colspan="3">Erro ao carregar ranking.</td></tr>
        `;

        document.getElementById('ranking-resumo-body').innerHTML = `
            <tr><td colspan="6">Erro ao carregar resumo.</td></tr>
        `;
    }
}

async function carregarDadosPontuacao() {
    const [rankingResp, participantesResp, palpitesResp, resultadosResp] =
        await Promise.all([
            supabaseClient.rpc('ranking_mata_mata'),

            supabaseClient
                .from('participantes')
                .select('id, nome')
                .order('id'),

            supabaseClient
                .from('palpites')
                .select('participante_id, jogo_id, mandante, visitante')
                .gte('jogo_id', 73)
                .lte('jogo_id', 104),

            supabaseClient
                .from('resultados')
                .select('jogo_id, mandante, visitante')
                .gte('jogo_id', 73)
                .lte('jogo_id', 104)
        ]);

    if (rankingResp.error) throw rankingResp.error;
    if (participantesResp.error) throw participantesResp.error;
    if (palpitesResp.error) throw palpitesResp.error;
    if (resultadosResp.error) throw resultadosResp.error;

    const participantes = participantesResp.data || [];
    const palpites = palpitesResp.data || [];
    const resultados = resultadosResp.data || [];
    const ranking = rankingResp.data || [];

    const resultadosPorJogo = new Map(
        resultados.map(resultado => [
            Number(resultado.jogo_id),
            resultado
        ])
    );

    const resumoPorId = new Map();
    const participantePorNome = new Map();

    participantes.forEach(participante => {
        const item = {
            id: Number(participante.id),
            nome: participante.nome,
            pontos_10: 0,
            pontos_6: 0,
            pontos_4: 0,
            pontos_2: 0,
            pontos_0: 0,
            total: 0
        };

        resumoPorId.set(Number(participante.id), item);
        participantePorNome.set(participante.nome, item);
    });

    palpites.forEach(palpite => {
        const resultado = resultadosPorJogo.get(Number(palpite.jogo_id));
        if (!resultado) return;

        const pontos = calcularPontos(
            palpite.mandante,
            palpite.visitante,
            resultado.mandante,
            resultado.visitante
        );

        const item = resumoPorId.get(Number(palpite.participante_id));
        if (!item) return;

        if (pontos === 10) item.pontos_10++;
        if (pontos === 6) item.pontos_6++;
        if (pontos === 4) item.pontos_4++;
        if (pontos === 2) item.pontos_2++;
        if (pontos === 0) item.pontos_0++;

        item.total += pontos;
    });

    const rankingOrdenado = ranking
        .map(item => {
            const resumo = participantePorNome.get(item.nome) || {};

            return {
                nome: item.nome,
                pontos: Number(item.pontos || 0),
                pontos_10: resumo.pontos_10 || 0,
                pontos_6: resumo.pontos_6 || 0,
                pontos_4: resumo.pontos_4 || 0,
                pontos_2: resumo.pontos_2 || 0,
                pontos_0: resumo.pontos_0 || 0
            };
        })
        .sort(ordenarRankingComDesempate);

    return {
        rankingOrdenado,
        resumoPorId: Array.from(resumoPorId.values())
    };
}

function ordenarRankingComDesempate(a, b) {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.pontos_10 !== a.pontos_10) return b.pontos_10 - a.pontos_10;
    if (b.pontos_6 !== a.pontos_6) return b.pontos_6 - a.pontos_6;
    if (b.pontos_4 !== a.pontos_4) return b.pontos_4 - a.pontos_4;
    if (b.pontos_2 !== a.pontos_2) return b.pontos_2 - a.pontos_2;

    return a.nome.localeCompare(b.nome);
}

function renderizarRankingPrincipal(lista) {
    const tbody = document.getElementById('ranking-body');
    tbody.innerHTML = '';

    if (!lista || lista.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="3">Nenhum participante encontrado.</td></tr>
        `;
        return;
    }

    const quantidadePorPontuacao = lista.reduce((mapa, item) => {
        mapa[item.pontos] = (mapa[item.pontos] || 0) + 1;
        return mapa;
    }, {});

    lista.forEach((item, indice) => {
        const classeLinha =
            (indice <= 3 || indice === lista.length - 1)
                ? 'class="top-ranking"'
                : '';

        const estaEmpatado =
            quantidadePorPontuacao[item.pontos] > 1;

        const nomeHtml = estaEmpatado
            ? `
                <span class="ranking-nome-tooltip" data-tooltip="${montarTooltip(item)}">
                    ${item.nome}
                </span>
            `
            : item.nome;

        tbody.innerHTML += `
            <tr ${classeLinha}>
                <td>${indice + 1}º</td>
                <td>${nomeHtml}</td>
                <td>${item.pontos}</td>
            </tr>
        `;
    });
}

function renderizarResumoPontuacao(lista) {
    const tbody = document.getElementById('ranking-resumo-body');
    tbody.innerHTML = '';

    lista.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>${item.pontos_10}x</td>
                <td>${item.pontos_6}x</td>
                <td>${item.pontos_4}x</td>
                <td>${item.pontos_2}x</td>
                <td>${item.pontos_0}x</td>
            </tr>
        `;
    });
}

function montarTooltip(item) {
    return `10 pts: ${item.pontos_10}x | 6 pts: ${item.pontos_6}x | 4 pts: ${item.pontos_4}x | 2 pts: ${item.pontos_2}x | 0 pts: ${item.pontos_0}x`;
}

function calcularPontos(
    palpiteMandante,
    palpiteVisitante,
    resultadoMandante,
    resultadoVisitante
) {
    if (
        palpiteMandante === null ||
        palpiteVisitante === null ||
        resultadoMandante === null ||
        resultadoVisitante === null ||
        palpiteMandante === undefined ||
        palpiteVisitante === undefined ||
        resultadoMandante === undefined ||
        resultadoVisitante === undefined
    ) {
        return 0;
    }

    const pm = Number(palpiteMandante);
    const pv = Number(palpiteVisitante);
    const rm = Number(resultadoMandante);
    const rv = Number(resultadoVisitante);

    if ([pm, pv, rm, rv].some(Number.isNaN)) {
        return 0;
    }

    if (pm === rm && pv === rv) {
        return 10;
    }

    if (rm === rv) {
        return 0;
    }

    const acertouVencedor =
        (pm > pv && rm > rv) ||
        (pm < pv && rm < rv);

    if (
        acertouVencedor &&
        (pm === rm || pv === rv)
    ) {
        return 6;
    }

    if (acertouVencedor) {
        return 4;
    }

    if (rm > rv && pv === rv) {
        return 2;
    }

    if (rv > rm && pm === rm) {
        return 2;
    }

    return 0;
}

document.addEventListener('DOMContentLoaded', carregarRanking);