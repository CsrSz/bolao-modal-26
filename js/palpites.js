let grupoSelecionado = 'A';

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

    jogos.forEach(jogo => {

        if (jogo.grupo !== grupoSelecionado) {
            return;
        }

        const palpiteSalvo = palpites?.find(p => p.jogo_id === jogo.id) || {};
        const dataJogo = new Date(`${jogo.data}T${jogo.hora}:00`);
        const bloqueado = new Date() >= dataJogo;
        const [ano, mes, dia] = jogo.data.split('-');
        const dataFormatada = `${dia}/${mes}/${ano.slice(2)}`;

        // AQUI ESTÁ A MÁGICA DO ESPELHAMENTO DE TV!
        tbody.innerHTML += `
            <tr>
                <td>📆 ${dataFormatada}</td>
                <td>⌚ ${jogo.hora.replace(':00', 'h')}</td>
                <td>🏟️ ${jogo.local || ''}</td>

                <td class="time-mandante">
                    <img src="assets/escudos/${formatarNomeTime(jogo.mandante)}.png" class="escudo" alt="Escudo ${jogo.mandante}" onerror="this.style.display='none'">
                    <span>${jogo.mandante}</span>
                </td>

                <td>
                    <input
                        type="number"
                        min="0"
                        class="placar mandante"
                        data-id="${jogo.id}"
                        value="${palpiteSalvo.mandante ?? ''}"
                        ${bloqueado ? 'disabled' : ''}>
                </td>

                <td>x</td>

                <td>
                    <input
                        type="number"
                        min="0"
                        class="placar visitante"
                        data-id="${jogo.id}"
                        value="${palpiteSalvo.visitante ?? ''}"
                        ${bloqueado ? 'disabled' : ''}>
                </td>

                <td class="time-visitante">
                    <span>${jogo.visitante}</span>
                    <img src="assets/escudos/${formatarNomeTime(jogo.visitante)}.png" class="escudo" alt="Escudo ${jogo.visitante}" onerror="this.style.display='none'">
                </td>
            </tr>
        `;
    });

    configurarEventos();
}

function configurarEventos() {
    const inputs = document.querySelectorAll('.placar');
    inputs.forEach(input => {
        input.addEventListener('change', salvarPalpite);
    });
}

async function salvarPalpite() {
    const jogoId = Number(this.dataset.id);
    const mandante = document.querySelector(`.mandante[data-id="${jogoId}"]`).value;
    const visitante = document.querySelector(`.visitante[data-id="${jogoId}"]`).value;

    if (mandante === '' || visitante === '') {
        return;
    }

    const participanteId = Number(localStorage.getItem('usuarioId'));

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

document.querySelectorAll('.aba').forEach(botao => {
    botao.addEventListener('click', () => {
        document.querySelectorAll('.aba').forEach(b => b.classList.remove('ativa'));
        botao.classList.add('ativa');
        grupoSelecionado = botao.dataset.grupo;
        document.getElementById('tituloGrupo').textContent = `🏆 Grupo ${grupoSelecionado}`;
        carregarJogos();
    });
});

document.getElementById('tituloGrupo').textContent = `🏆 Grupo ${grupoSelecionado}`;
carregarJogos();

const usuario = localStorage.getItem('usuarioLogado');
if (usuario) {
    document.getElementById('usuario').innerHTML = `Olá, ${usuario} 👋`;
}

function sair() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
}

// Função para gerar o nome do arquivo da imagem automaticamente
function formatarNomeTime(nome) {
    return nome.toLowerCase()
               .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove os acentos
               .replace(/\s+/g, '-'); // Troca os espaços por traços
}