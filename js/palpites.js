let grupoSelecionado = 'A';

const FASE_MATA_ATUAL = 'QUARTAS';

async function carregarJogos() {

    const usuario = localStorage.getItem('usuarioLogado');

    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }

    const { data: jogos, error } = await supabaseClient
        .from('jogos')
        .select('*')
        .order('id');

    if (error) {
        console.error(error);
        alert('Erro ao carregar jogos');
        return;
    }

    const participanteId = Number(localStorage.getItem('usuarioId'));

    const { data: palpites } = await supabaseClient
        .from('palpites')
        .select('*')
        .eq('participante_id', participanteId);

    const tbody = document.getElementById('jogos-body');
    tbody.innerHTML = '';

    const jogosFiltrados = jogos
        .filter(jogo => jogo.grupo === grupoSelecionado)
        .filter(jogo => jogoDisponivelParaPalpite(jogo))
        .sort((a, b) => {

            const ordemA = a.ordem ?? a.id;
            const ordemB = b.ordem ?? b.id;

            return ordemA - ordemB;

        });

    if (jogosFiltrados.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    Nenhum jogo disponível para esta fase.
                </td>
            </tr>
        `;

        configurarEventos();
        return;
    }

    jogosFiltrados.forEach(jogo => {

        const palpiteSalvo =
            palpites?.find(p => Number(p.jogo_id) === Number(jogo.id)) || {};

        const dataJogo =
            new Date(`${jogo.data}T${jogo.hora}:00`);

        const bloqueado =
            new Date() >= dataJogo;

        const [ano, mes, dia] =
            jogo.data.split('-');

        const dataFormatada =
            `${dia}/${mes}/${ano.slice(2)}`;

        tbody.innerHTML += `
            <tr>
                <td>📆 ${dataFormatada}</td>

                <td>⌚ ${formatarHora(jogo.hora)}</td>

                <td>
                    🏟️ ${jogo.local || ''}
                    ${
                        grupoSelecionado === 'MATA'
                            ? `<br><small>${formatarFase(jogo.fase)}</small>`
                            : ''
                    }
                </td>

                <td class="time-mandante">
                    <img
                        src="assets/escudos/${formatarNomeTime(jogo.mandante)}.png"
                        class="escudo"
                        alt="Escudo ${jogo.mandante}"
                        onerror="this.style.display='none'"
                    >
                    <span>${jogo.mandante}</span>
                </td>

                <td>
                    <input
                        type="number"
                        min="0"
                        class="placar mandante"
                        data-id="${jogo.id}"
                        value="${palpiteSalvo.mandante ?? ''}"
                        ${bloqueado ? 'disabled' : ''}
                    >
                </td>

                <td>x</td>

                <td>
                    <input
                        type="number"
                        min="0"
                        class="placar visitante"
                        data-id="${jogo.id}"
                        value="${palpiteSalvo.visitante ?? ''}"
                        ${bloqueado ? 'disabled' : ''}
                    >
                </td>

                <td class="time-visitante">
                    <span>${jogo.visitante}</span>
                    <img
                        src="assets/escudos/${formatarNomeTime(jogo.visitante)}.png"
                        class="escudo"
                        alt="Escudo ${jogo.visitante}"
                        onerror="this.style.display='none'"
                    >
                </td>
            </tr>
        `;
    });

    configurarEventos();
}

function jogoDisponivelParaPalpite(jogo) {

    if (jogo.grupo !== 'MATA') {
        return true;
    }

    if (jogo.fase !== FASE_MATA_ATUAL) {
        return false;
    }

    return (
        timeDefinido(jogo.mandante) &&
        timeDefinido(jogo.visitante)
    );

}

function timeDefinido(nome) {

    if (!nome) {
        return false;
    }

    if (nome === 'A definir') {
        return false;
    }

    if (nome.includes('º')) {
        return false;
    }

    if (nome.includes('/')) {
        return false;
    }

    return true;
}

function configurarEventos() {

    const inputs = document.querySelectorAll('.placar');

    inputs.forEach(input => {
        input.addEventListener('change', salvarPalpite);
    });

}

async function salvarPalpite() {

    const jogoId = Number(this.dataset.id);

    const mandante = document.querySelector(
        `.mandante[data-id="${jogoId}"]`
    ).value;

    const visitante = document.querySelector(
        `.visitante[data-id="${jogoId}"]`
    ).value;

    if (mandante === '' || visitante === '') {
        return;
    }

    const participanteId =
        Number(localStorage.getItem('usuarioId'));

    const { error } = await supabaseClient
        .from('palpites')
        .upsert(
            {
                participante_id: participanteId,
                jogo_id: jogoId,
                mandante: Number(mandante),
                visitante: Number(visitante)
            },
            {
                onConflict: 'participante_id,jogo_id'
            }
        );

    if (error) {
        console.error(error);
        alert('Erro ao salvar palpite');
        return;
    }

    console.log(`Palpite do jogo ${jogoId} salvo no Supabase`);

}

function configurarAbas() {

    garantirAbaMataMata();

    document.querySelectorAll('.aba').forEach(botao => {

        botao.onclick = () => {

            document.querySelectorAll('.aba')
                .forEach(b => b.classList.remove('ativa'));

            botao.classList.add('ativa');

            grupoSelecionado = botao.dataset.grupo;

            atualizarTituloGrupo();

            carregarJogos();

        };

    });

}

function garantirAbaMataMata() {

    const abaExistente =
        document.querySelector('.aba[data-grupo="MATA"]');

    if (abaExistente) {
        return;
    }

    const primeiraAba =
        document.querySelector('.aba');

    if (!primeiraAba || !primeiraAba.parentElement) {
        return;
    }

    const botao = document.createElement('button');

    botao.className = 'aba';
    botao.dataset.grupo = 'MATA';
    botao.textContent = 'Mata-Mata';

    primeiraAba.parentElement.appendChild(botao);

}

function atualizarTituloGrupo() {

    const titulo =
        document.getElementById('tituloGrupo');

    if (!titulo) {
        return;
    }

    titulo.textContent =
        grupoSelecionado === 'MATA'
            ? `🏆 Mata-Mata - ${formatarFase(FASE_MATA_ATUAL)}`
            : `🏆 Grupo ${grupoSelecionado}`;

}

function formatarHora(hora) {

    if (!hora) {
        return '';
    }

    const partes = hora.split(':');

    const horas = partes[0];
    const minutos = partes[1] ?? '00';

    return minutos === '00'
        ? `${horas}h`
        : `${horas}h${minutos}`;

}

function formatarFase(fase) {

    const fases = {

        '16AVOS': 'Segunda Fase',

        'OITAVAS': 'Oitavas de Final',

        'QUARTAS': 'Quartas de Final',

        'SEMIFINAL': 'Semifinal',

        'TERCEIRO': 'Disputa do 3º Lugar',

        'FINAL': 'Final'

    };

    return fases[fase] || fase || '';

}

function formatarNomeTime(nome) {

    if (!nome) {
        return '';
    }

    return nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');

}

function sair() {

    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';

}

configurarAbas();
atualizarTituloGrupo();
carregarJogos();

const usuario = localStorage.getItem('usuarioLogado');

if (usuario) {

    document.getElementById('usuario').innerHTML =
        `Olá, ${usuario} 👋`;

}