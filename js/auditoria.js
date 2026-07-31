'use strict';

async function validarAcessoAuditoria() {
    const {
        data: { user },
        error: erroUsuario
    } = await supabaseClient.auth.getUser();

    if (erroUsuario || !user) {
        window.location.replace('login-admin.html');
        return false;
    }

    const {
        data: autorizacao,
        error: erroAutorizacao
    } = await supabaseClient
        .from('admin_usuarios')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

    if (erroAutorizacao) {
        console.error(
            'Erro ao validar autorização da auditoria:',
            erroAutorizacao
        );

        await supabaseClient.auth.signOut();

        window.location.replace(
            'login-admin.html?erro=autorizacao'
        );

        return false;
    }

    if (!autorizacao) {
        await supabaseClient.auth.signOut();

        window.location.replace(
            'login-admin.html?erro=sem-permissao'
        );

        return false;
    }

    return true;
}

const estadoAuditoria = {
    participantes: [],
    jogos: [],
    jogosFiltrados: [],
    participanteAtual: null
};

const elementosAuditoria = {
    participante: document.getElementById('filtro-participante'),
    fase: document.getElementById('filtro-fase'),
    grupo: document.getElementById('filtro-grupo'),
    pontos: document.getElementById('filtro-pontos'),
    status: document.getElementById('filtro-status'),
    pesquisa: document.getElementById('filtro-pesquisa'),

    btnLimpar: document.getElementById('btn-limpar-filtros'),

    mensagem: document.getElementById('auditoria-mensagem'),
    resumo: document.getElementById('auditoria-resumo'),
    tabelaCard: document.getElementById('auditoria-tabela-card'),
    tabelaTitulo: document.getElementById('auditoria-tabela-titulo'),
    totalExibido: document.getElementById('auditoria-total-exibido'),
    tabelaBody: document.getElementById('auditoria-body'),

    resumoPontosTotal: document.getElementById('resumo-pontos-total'),
    resumo10: document.getElementById('resumo-acertos-10'),
    resumo6: document.getElementById('resumo-acertos-6'),
    resumo4: document.getElementById('resumo-acertos-4'),
    resumo2: document.getElementById('resumo-acertos-2'),
    resumo0: document.getElementById('resumo-palpite-0'),
    resumoSemPalpite: document.getElementById('resumo-sem-palpite'),
    resumoPendentes: document.getElementById('resumo-pendentes')
};

function escaparHtml(valor) {
    return String(valor ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function normalizarTexto(valor) {
    return String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function numero(valor) {
    const convertido = Number(valor);
    return Number.isFinite(convertido) ? convertido : 0;
}

function valorAusente(valor) {
    return valor === null || valor === undefined;
}

function normalizarFase(jogo) {
    const faseOriginal = String(jogo.fase ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .trim();

    const faseCompacta = faseOriginal.replace(/[^A-Z0-9]/g, '');

    if (
        faseCompacta === 'GRUPO'
        || faseCompacta === 'GRUPOS'
        || faseCompacta === 'FASEDEGRUPOS'
        || faseCompacta === 'FASEGRUPOS'
    ) {
        return 'GRUPO';
    }

    if (
        faseCompacta === '16AVOS'
        || faseCompacta === 'DEZESSEISAVOS'
    ) {
        return '16AVOS';
    }

    if (faseCompacta === 'OITAVAS') {
        return 'OITAVAS';
    }

    if (faseCompacta === 'QUARTAS') {
        return 'QUARTAS';
    }

    if (
        faseCompacta === 'SEMIFINAL'
        || faseCompacta === 'SEMIFINAIS'
    ) {
        return 'SEMIFINAL';
    }

    if (
        faseCompacta === 'TERCEIRO'
        || faseCompacta === 'TERCEIROLUGAR'
        || faseCompacta === 'DISPUTADETERCEIRO'
    ) {
        return 'TERCEIRO';
    }

    if (faseCompacta === 'FINAL') {
        return 'FINAL';
    }

    const grupo = String(jogo.grupo ?? '')
        .toUpperCase()
        .trim();

    if (grupo && grupo !== 'MATA') {
        return 'GRUPO';
    }

    const jogoId = numero(jogo.jogo_id);

    if (jogoId >= 1 && jogoId <= 72) return 'GRUPO';
    if (jogoId >= 73 && jogoId <= 88) return '16AVOS';
    if (jogoId >= 89 && jogoId <= 96) return 'OITAVAS';
    if (jogoId >= 97 && jogoId <= 100) return 'QUARTAS';
    if (jogoId >= 101 && jogoId <= 102) return 'SEMIFINAL';
    if (jogoId === 103) return 'TERCEIRO';
    if (jogoId === 104) return 'FINAL';

    return faseOriginal || 'NAO_INFORMADA';
}

function obterRotuloFase(jogo) {
    const fase = normalizarFase(jogo);

    const rotulos = {
        GRUPO: jogo.grupo
            ? `Grupo ${jogo.grupo}`
            : 'Fase de Grupos',

        '16AVOS': '16 Avos',
        OITAVAS: 'Oitavas',
        QUARTAS: 'Quartas',
        SEMIFINAL: 'Semifinal',
        TERCEIRO: 'Terceiro Lugar',
        FINAL: 'Final',
        NAO_INFORMADA: 'Não informada'
    };

    return rotulos[fase] ?? fase;
}

function obterRotuloStatus(status) {
    const rotulos = {
        AUDITADO: 'Auditado',
        SEM_PALPITE: 'Sem palpite',
        AGUARDANDO_RESULTADO: 'Aguardando resultado'
    };

    return rotulos[status] ?? status ?? 'Não informado';
}

function obterClasseStatus(status) {
    const classes = {
        AUDITADO: 'auditoria-status-auditado',
        SEM_PALPITE: 'auditoria-status-sem-palpite',
        AGUARDANDO_RESULTADO: 'auditoria-status-pendente'
    };

    return classes[status] ?? '';
}

function obterClassePontos(pontos) {
    if (valorAusente(pontos)) {
        return 'auditoria-pontos-pendente';
    }

    return `auditoria-pontos-${numero(pontos)}`;
}

function formatarPlacar(mandante, visitante, textoAusente) {
    if (valorAusente(mandante) || valorAusente(visitante)) {
        return textoAusente;
    }

    return `${numero(mandante)} x ${numero(visitante)}`;
}

function atualizarDisponibilidadeGrupo() {
    const participanteSelecionado =
        Boolean(elementosAuditoria.participante.value);

    const faseSelecionada = elementosAuditoria.fase.value;

    const grupoPermitido =
        participanteSelecionado
        && (
            faseSelecionada === 'TODAS'
            || faseSelecionada === 'GRUPO'
        );

    elementosAuditoria.grupo.disabled = !grupoPermitido;

    if (!grupoPermitido) {
        elementosAuditoria.grupo.value = 'TODOS';
    }
}

function alterarEstadoFiltros(habilitado) {
    elementosAuditoria.fase.disabled = !habilitado;
    elementosAuditoria.pontos.disabled = !habilitado;
    elementosAuditoria.status.disabled = !habilitado;
    elementosAuditoria.pesquisa.disabled = !habilitado;

    if (!habilitado) {
        elementosAuditoria.grupo.disabled = true;
    } else {
        atualizarDisponibilidadeGrupo();
    }
}

function exibirMensagem(texto, tipo = '') {
    elementosAuditoria.mensagem.hidden = false;
    elementosAuditoria.mensagem.textContent = texto;
    elementosAuditoria.mensagem.className = 'auditoria-mensagem';

    if (tipo) {
        elementosAuditoria.mensagem.classList.add(
            `auditoria-mensagem-${tipo}`
        );
    }
}

function ocultarMensagem() {
    elementosAuditoria.mensagem.hidden = true;
}

function esconderResultados() {
    elementosAuditoria.resumo.hidden = true;
    elementosAuditoria.tabelaCard.hidden = true;
}

function preencherParticipantes(participantes) {
    elementosAuditoria.participante.innerHTML = `
        <option value="">Selecione um participante</option>
    `;

    const participantesOrdenados = [...participantes].sort((a, b) =>
        String(a.nome).localeCompare(
            String(b.nome),
            'pt-BR',
            { sensitivity: 'base' }
        )
    );

    participantesOrdenados.forEach(participante => {
        const option = document.createElement('option');

        option.value = participante.participante_id;
        option.textContent = participante.nome;

        elementosAuditoria.participante.appendChild(option);
    });
}

async function carregarParticipantes() {
    exibirMensagem('Carregando participantes...');

    const { data, error } = await supabaseClient.rpc(
        'ranking_completo'
    );

    if (error) {
        console.error('Erro ao carregar participantes:', error);

        exibirMensagem(
            'Não foi possível carregar os participantes.',
            'erro'
        );

        return;
    }

    estadoAuditoria.participantes = data ?? [];

    preencherParticipantes(estadoAuditoria.participantes);

    exibirMensagem(
        'Selecione um participante para iniciar a auditoria.'
    );

    console.log(
        `Participantes carregados: ${estadoAuditoria.participantes.length}.`
    );
}

async function carregarAuditoria(participanteId) {
    esconderResultados();
    alterarEstadoFiltros(false);

    exibirMensagem('Carregando auditoria do participante...');

    const { data, error } = await supabaseClient.rpc(
        'auditoria_pontuacao',
        {
            p_participante_id: numero(participanteId)
        }
    );

    if (error) {
        console.error('Erro ao carregar auditoria:', error);

        exibirMensagem(
            'Não foi possível carregar a auditoria.',
            'erro'
        );

        return;
    }

    estadoAuditoria.jogos = data ?? [];

    estadoAuditoria.participanteAtual =
        estadoAuditoria.participantes.find(
            participante =>
                numero(participante.participante_id)
                === numero(participanteId)
        ) ?? null;

    redefinirFiltrosSecundarios();
    alterarEstadoFiltros(true);
    aplicarFiltros();

    console.log(
        `Auditoria carregada: ${estadoAuditoria.jogos.length} jogos.`
    );
}

function redefinirFiltrosSecundarios() {
    elementosAuditoria.fase.value = 'TODAS';
    elementosAuditoria.grupo.value = 'TODOS';
    elementosAuditoria.pontos.value = 'TODOS';
    elementosAuditoria.status.value = 'TODOS';
    elementosAuditoria.pesquisa.value = '';
}

function aplicarFiltros() {
    const faseSelecionada = elementosAuditoria.fase.value;
    const grupoSelecionado = elementosAuditoria.grupo.value;
    const pontosSelecionados = elementosAuditoria.pontos.value;
    const statusSelecionado = elementosAuditoria.status.value;
    const pesquisa = normalizarTexto(
        elementosAuditoria.pesquisa.value
    );

    estadoAuditoria.jogosFiltrados =
        estadoAuditoria.jogos.filter(jogo => {
            const faseJogo = normalizarFase(jogo);

            const grupoJogo = String(jogo.grupo ?? '')
                .toUpperCase()
                .trim();

            const faseCorreta =
                faseSelecionada === 'TODAS'
                || faseJogo === faseSelecionada;

            const grupoCorreto =
                grupoSelecionado === 'TODOS'
                || (
                    faseJogo === 'GRUPO'
                    && grupoJogo === grupoSelecionado
                );

            const pontosCorretos =
                pontosSelecionados === 'TODOS'
                || (
                    !valorAusente(jogo.pontos)
                    && String(numero(jogo.pontos))
                        === pontosSelecionados
                );

            const statusCorreto =
                statusSelecionado === 'TODOS'
                || jogo.status_auditoria === statusSelecionado;

            const textoPesquisa = normalizarTexto([
                `jogo ${jogo.jogo_id}`,
                jogo.jogo_id,
                jogo.mandante,
                jogo.visitante,
                jogo.grupo,
                jogo.fase,
                jogo.regra_codigo,
                jogo.regra_descricao
            ].join(' '));

            const pesquisaCorreta =
                !pesquisa
                || textoPesquisa.includes(pesquisa);

            return (
                faseCorreta
                && grupoCorreto
                && pontosCorretos
                && statusCorreto
                && pesquisaCorreta
            );
        });

    renderizarResumo(estadoAuditoria.jogosFiltrados);
    renderizarTabela(estadoAuditoria.jogosFiltrados);

    ocultarMensagem();
    elementosAuditoria.resumo.hidden = false;
    elementosAuditoria.tabelaCard.hidden = false;
}

function renderizarResumo(jogos) {
    const pontosTotal = jogos.reduce(
        (total, jogo) =>
            total + (
                valorAusente(jogo.pontos)
                    ? 0
                    : numero(jogo.pontos)
            ),
        0
    );

    const quantidadePorPontos = pontos =>
        jogos.filter(
            jogo =>
                !valorAusente(jogo.pontos)
                && numero(jogo.pontos) === pontos
        ).length;

    const palpitesZero = jogos.filter(
        jogo => jogo.regra_codigo === 'SEM_ACERTO'
    ).length;

    const semPalpite = jogos.filter(
        jogo => jogo.regra_codigo === 'SEM_PALPITE'
    ).length;

    const pendentes = jogos.filter(
        jogo =>
            jogo.regra_codigo === 'PENDENTE'
            || jogo.regra_codigo === 'NAO_INICIADO'
    ).length;

    elementosAuditoria.resumoPontosTotal.textContent = pontosTotal;
    elementosAuditoria.resumo10.textContent = quantidadePorPontos(10);
    elementosAuditoria.resumo6.textContent = quantidadePorPontos(6);
    elementosAuditoria.resumo4.textContent = quantidadePorPontos(4);
    elementosAuditoria.resumo2.textContent = quantidadePorPontos(2);
    elementosAuditoria.resumo0.textContent = palpitesZero;
    elementosAuditoria.resumoSemPalpite.textContent = semPalpite;
    elementosAuditoria.resumoPendentes.textContent = pendentes;
}

function renderizarTabela(jogos) {
    const nomeParticipante =
        estadoAuditoria.participanteAtual?.nome
        ?? 'Participante';

    elementosAuditoria.tabelaTitulo.textContent =
        `Jogos auditados: ${nomeParticipante}`;

    elementosAuditoria.totalExibido.textContent =
        `${jogos.length} de ${estadoAuditoria.jogos.length} jogos exibidos`;

    if (!jogos.length) {
        elementosAuditoria.tabelaBody.innerHTML = `
            <tr>
                <td colspan="8" class="auditoria-sem-resultados">
                    Nenhum jogo encontrado com os filtros selecionados.
                </td>
            </tr>
        `;

        return;
    }

    elementosAuditoria.tabelaBody.innerHTML = jogos
        .map(jogo => {
            const confronto = `
                ${escaparHtml(jogo.mandante)}
                <span class="auditoria-versus">x</span>
                ${escaparHtml(jogo.visitante)}
            `;

            const palpite = formatarPlacar(
                jogo.palpite_mandante,
                jogo.palpite_visitante,
                'Sem palpite'
            );

            const resultado = formatarPlacar(
                jogo.resultado_mandante,
                jogo.resultado_visitante,
                'Aguardando'
            );

            const pontos = valorAusente(jogo.pontos)
                ? '—'
                : numero(jogo.pontos);

            const regraCodigo =
                escaparHtml(jogo.regra_codigo ?? '');

            const regraDescricao =
                escaparHtml(jogo.regra_descricao ?? '');

            const status =
                escaparHtml(
                    obterRotuloStatus(jogo.status_auditoria)
                );

            return `
                <tr>
                    <td>
                        <strong>Jogo ${numero(jogo.jogo_id)}</strong>
                    </td>

                    <td>
                        ${escaparHtml(obterRotuloFase(jogo))}
                    </td>

                    <td class="auditoria-confronto">
                        ${confronto}
                    </td>

                    <td>
                        ${escaparHtml(palpite)}
                    </td>

                    <td>
                        ${escaparHtml(resultado)}
                    </td>

                    <td>
                        <span class="
                            auditoria-pontos
                            ${obterClassePontos(jogo.pontos)}
                        ">
                            ${pontos}
                        </span>
                    </td>

                    <td class="auditoria-regra">
                        <strong>${regraCodigo}</strong>
                        <small>${regraDescricao}</small>
                    </td>

                    <td>
                        <span class="
                            auditoria-status
                            ${obterClasseStatus(jogo.status_auditoria)}
                        ">
                            ${status}
                        </span>
                    </td>
                </tr>
            `;
        })
        .join('');
}

function limparTudo() {
    estadoAuditoria.jogos = [];
    estadoAuditoria.jogosFiltrados = [];
    estadoAuditoria.participanteAtual = null;

    elementosAuditoria.participante.value = '';

    redefinirFiltrosSecundarios();
    alterarEstadoFiltros(false);
    esconderResultados();

    exibirMensagem(
        'Selecione um participante para iniciar a auditoria.'
    );
}

function configurarEventos() {
    elementosAuditoria.participante.addEventListener(
        'change',
        async event => {
            const participanteId = event.target.value;

            if (!participanteId) {
                limparTudo();
                return;
            }

            await carregarAuditoria(participanteId);
        }
    );

    elementosAuditoria.fase.addEventListener(
        'change',
        () => {
            atualizarDisponibilidadeGrupo();
            aplicarFiltros();
        }
    );

    elementosAuditoria.grupo.addEventListener(
        'change',
        () => {
            if (elementosAuditoria.grupo.value !== 'TODOS') {
                elementosAuditoria.fase.value = 'GRUPO';
            }

            atualizarDisponibilidadeGrupo();
            aplicarFiltros();
        }
    );

    elementosAuditoria.pontos.addEventListener(
        'change',
        aplicarFiltros
    );

    elementosAuditoria.status.addEventListener(
        'change',
        aplicarFiltros
    );

    elementosAuditoria.pesquisa.addEventListener(
        'input',
        aplicarFiltros
    );

    elementosAuditoria.btnLimpar.addEventListener(
        'click',
        limparTudo
    );
}

async function iniciarAuditoria() {
    const acessoValido = await validarAcessoAuditoria();

    if (!acessoValido) {
        return;
    }

    configurarEventos();
    alterarEstadoFiltros(false);
    esconderResultados();

    await carregarParticipantes();
}

document.addEventListener(
    'DOMContentLoaded',
    iniciarAuditoria
);