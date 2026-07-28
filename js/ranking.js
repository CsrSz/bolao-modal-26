const RPC_RANKING_OFICIAL = 'ranking_completo';

/**
 * Converte valores retornados pelo PostgreSQL/Supabase para número.
 * Campos bigint podem chegar ao navegador como texto.
 */
function numero(valor) {
    const convertido = Number(valor);

    return Number.isFinite(convertido)
        ? convertido
        : 0;
}

/**
 * Protege textos inseridos no HTML.
 */
function escaparHtml(valor) {
    const texto = String(valor ?? '');

    const caracteres = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return texto.replace(
        /[&<>"']/g,
        caractere => caracteres[caractere]
    );
}

/**
 * Localiza o corpo da tabela principal.
 *
 * O primeiro seletor mantém compatibilidade com o HTML atual.
 * O segundo funciona como segurança caso o tbody não tenha ID.
 */
function obterCorpoRanking() {
    return (
        document.getElementById('ranking-body') ||
        document.querySelector('.ranking-principal tbody')
    );
}

/**
 * Localiza o corpo da tabela Resumo de Pontos.
 *
 * Os seletores alternativos evitam dependência desnecessária
 * de um único ID no HTML.
 */
function obterCorpoResumo() {
    return (
        document.getElementById('ranking-resumo-body') ||
        document.getElementById('resumo-body') ||
        document.querySelector('.ranking-resumo tbody')
    );
}

/**
 * Monta o texto exibido no balão ao passar o mouse
 * sobre o nome do participante.
 */
function criarTooltip(item) {
    return [
        `10 pontos: ${numero(item.acertos_10)}`,
        `6 pontos: ${numero(item.acertos_6)}`,
        `4 pontos: ${numero(item.acertos_4)}`,
        `2 pontos: ${numero(item.acertos_2)}`,
        `0 pontos: ${numero(item.palpites_0)}`,
        `Sem palpite: ${numero(item.jogos_sem_palpite)}`,
        `Pendentes: ${numero(item.jogos_pendentes)}`
    ].join(' | ');
}

/**
 * Exibe uma mensagem dentro de uma tabela.
 */
function exibirMensagemTabela(
    corpoTabela,
    quantidadeColunas,
    mensagem
) {
    if (!corpoTabela) {
        return;
    }

    corpoTabela.innerHTML = `
        <tr>
            <td
                colspan="${quantidadeColunas}"
                style="text-align: center;"
            >
                ${escaparHtml(mensagem)}
            </td>
        </tr>
    `;
}

/**
 * Renderiza a classificação oficial.
 *
 * A posição e a ordem já vêm prontas da função SQL.
 * Nenhum desempate é calculado no navegador.
 */
function renderizarClassificacao(ranking) {
    const corpoRanking = obterCorpoRanking();

    if (!corpoRanking) {
        throw new Error(
            'Corpo da tabela de classificação não encontrado.'
        );
    }

    corpoRanking.innerHTML = '';

    ranking.forEach((item, indice) => {
        const posicao =
            numero(item.posicao) || indice + 1;

        const destacarLinha =
            posicao <= 4 ||
            posicao === ranking.length;

        const atributoClasse = destacarLinha
            ? ' class="top-ranking"'
            : '';

        const nome = escaparHtml(item.nome);
        const tooltip = escaparHtml(
            criarTooltip(item)
        );

        corpoRanking.innerHTML += `
            <tr${atributoClasse}>
                <td>${posicao}º</td>

                <td>
                    <span
                        class="ranking-nome-tooltip"
                        data-tooltip="${tooltip}"
                    >
                        ${nome}
                    </span>
                </td>

                <td>${numero(item.pontos)}</td>
            </tr>
        `;
    });
}

/**
 * Renderiza o card Resumo de Pontos.
 *
 * As quantidades vêm diretamente da função ranking_completo().
 */
function renderizarResumo(ranking) {
    const corpoResumo = obterCorpoResumo();

    if (!corpoResumo) {
        console.warn(
            'Corpo da tabela Resumo de Pontos não encontrado.'
        );

        return;
    }

    corpoResumo.innerHTML = '';

    ranking.forEach(item => {
        corpoResumo.innerHTML += `
            <tr>
                <td>${escaparHtml(item.nome)}</td>
                <td>${numero(item.acertos_10)}</td>
                <td>${numero(item.acertos_6)}</td>
                <td>${numero(item.acertos_4)}</td>
                <td>${numero(item.acertos_2)}</td>
                <td>${numero(item.palpites_0)}</td>
            </tr>
        `;
    });
}

/**
 * Carrega o ranking oficial.
 *
 * Esta é a única consulta necessária para classificação,
 * pontuação, resumo e desempates.
 */
async function carregarRanking() {
    const corpoRanking = obterCorpoRanking();
    const corpoResumo = obterCorpoResumo();

    try {
        const { data, error } = await supabaseClient
            .rpc(RPC_RANKING_OFICIAL);

        if (error) {
            throw error;
        }

        const ranking = Array.isArray(data)
            ? data
            : [];

        if (ranking.length === 0) {
            exibirMensagemTabela(
                corpoRanking,
                3,
                'Nenhum participante encontrado.'
            );

            exibirMensagemTabela(
                corpoResumo,
                6,
                'Nenhum participante encontrado.'
            );

            return;
        }

        /*
         * Não existe sort() aqui.
         *
         * A função SQL já entrega:
         * 1. pontos;
         * 2. acertos de 10;
         * 3. acertos de 6;
         * 4. acertos de 4;
         * 5. acertos de 2;
         * 6. nome.
         */

        renderizarClassificacao(ranking);
        renderizarResumo(ranking);

        console.info(
            `Ranking oficial carregado: ${ranking.length} participantes.`
        );
    } catch (erro) {
        console.error(
            'Erro ao carregar ranking oficial:',
            erro
        );

        exibirMensagemTabela(
            corpoRanking,
            3,
            'Erro ao carregar o ranking.'
        );

        exibirMensagemTabela(
            corpoResumo,
            6,
            'Erro ao carregar o resumo.'
        );
    }
}

document.addEventListener(
    'DOMContentLoaded',
    carregarRanking
);