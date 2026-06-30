function obterClienteSupabase() {
    if (window.supabaseClient && typeof window.supabaseClient.from === 'function') {
        return window.supabaseClient;
    }

    if (window.supabase && typeof window.supabase.from === 'function') {
        return window.supabase;
    }

    console.error('Cliente Supabase não encontrado. Confira js/supabase.js');
    return null;
}

async function carregarChaveamentoVisual() {
    const db = obterClienteSupabase();

    if (!db) {
        return;
    }

    const cards = document.querySelectorAll('[data-jogo]');
    const ids = Array.from(cards).map(card => Number(card.dataset.jogo));

    const { data: jogos, error: erroJogos } = await db
        .from('jogos')
        .select('id, fase, mandante, visitante, origem_mandante, origem_visitante, escudo_mandante, escudo_visitante')
        .in('id', ids);

    if (erroJogos) {
        console.error('Erro ao carregar jogos do chaveamento:', erroJogos);
        return;
    }

    const { data: resultados, error: erroResultados } = await db
        .from('resultados')
        .select('jogo_id, mandante, visitante, vencedor')
        .in('jogo_id', ids);

    if (erroResultados) {
        console.error('Erro ao carregar resultados do chaveamento:', erroResultados);
        return;
    }

    const jogosPorId = new Map(jogos.map(jogo => [Number(jogo.id), jogo]));
    const resultadosPorJogo = new Map(
        resultados.map(resultado => [Number(resultado.jogo_id), resultado])
    );

    cards.forEach(card => {
        const jogoId = Number(card.dataset.jogo);
        const jogo = jogosPorId.get(jogoId);

        if (!jogo) {
            return;
        }

        const resultado = resultadosPorJogo.get(jogoId);

        const penaltisExistentes = Array.from(
            card.querySelectorAll('.penaltis')
        ).map(campo => campo.textContent.trim());

        const linhas = card.querySelectorAll('.time');

        if (linhas.length < 2) {
            return;
        }

        linhas[0].outerHTML = montarLinhaTime({
            nome: jogo.mandante,
            origem: jogo.origem_mandante,
            escudo: jogo.escudo_mandante,
            placar: resultado?.mandante,
            penaltis: penaltisExistentes[0] || ''
        });

        linhas[1].outerHTML = montarLinhaTime({
            nome: jogo.visitante,
            origem: jogo.origem_visitante,
            escudo: jogo.escudo_visitante,
            placar: resultado?.visitante,
            penaltis: penaltisExistentes[1] || ''
        });

        const pendente =
            !jogo.mandante ||
            !jogo.visitante ||
            jogo.mandante === 'A definir' ||
            jogo.visitante === 'A definir';

        card.classList.toggle('placeholder', pendente);
    });

    console.log(`Chaveamento visual atualizado: ${jogos.length} jogos carregados.`);
}

function montarLinhaTime({ nome, origem, escudo, placar, penaltis }) {
    const definido = nome && nome !== 'A definir';

    if (!definido) {
        return `
            <div class="time">
                <span class="flag">${origem || '--'}</span>
                <span>${textoOrigem(origem)}</span>
            </div>
        `;
    }

    const caminhoEscudo = escudo || `./assets/escudos/${slugTime(nome)}.png`;

    return `
        <div class="time tem-placar">
            <img class="escudo-time" src="${caminhoEscudo}" alt="${nome}" onerror="this.style.visibility='hidden'">
            <span>${nome}</span>
            <span class="placar">${placar ?? ''}</span>
            <span class="penaltis">${penaltis ?? ''}</span>
        </div>
    `;
}

function textoOrigem(origem) {
    if (!origem) {
        return 'A definir';
    }

    if (origem.startsWith('P')) {
        return `Perdedor J${origem.replace('P', '')}`;
    }

    return `Vencedor J${origem.replace('V', '')}`;
}

function slugTime(nome) {
    return nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\./g, '')
        .replace(/\s+/g, '-');
}

document.addEventListener('DOMContentLoaded', carregarChaveamentoVisual);