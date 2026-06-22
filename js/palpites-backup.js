let grupoSelecionado = 'A';

async function carregarJogos() {

    const usuario =
        localStorage.getItem(
            'usuarioLogado'
        );

    if (!usuario) {

        window.location.href =
            'login.html';

        return;
    }

    const resposta =
        await fetch('dados/jogos.json');

    const jogos =
        await resposta.json();

    const tbody =
        document.getElementById('jogos-body');

    tbody.innerHTML = '';

    jogos.forEach(jogo => {

        if (jogo.grupo !== grupoSelecionado) {
            return;
        }

        const palpiteSalvo =
            JSON.parse(
                localStorage.getItem(
                    `${usuario}_jogo_${jogo.id}`
                )
            ) || {};

        const dataJogo =
            new Date(
                `${jogo.data}T${jogo.hora}:00`
            );

        const bloqueado =
            new Date() >= dataJogo;

        const [ano, mes, dia] =
            jogo.data.split('-');

        const dataFormatada =
            `${dia}/${mes}/${ano.slice(2)}`;

        tbody.innerHTML += `
            <tr>

                <td>
                    📆 ${dataFormatada}
                </td>

                <td>
                    ⌚ ${jogo.hora.replace(':00', 'h')}
                </td>

                <td>
                    🏟️ ${jogo.local || ''}
                </td>

                <td>
                    ${jogo.mandante}
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

                <td>
                    ${jogo.visitante}
                </td>

            </tr>
        `;
    });

    configurarEventos();
}

function configurarEventos() {

    const inputs =
        document.querySelectorAll('.placar');

    inputs.forEach(input => {

        input.addEventListener(
            'change',
            salvarPalpite
        );

    });

}

function salvarPalpite() {

    const id =
        this.dataset.id;

    const mandante =
        document.querySelector(
            `.mandante[data-id="${id}"]`
        ).value;

    const visitante =
        document.querySelector(
            `.visitante[data-id="${id}"]`
        ).value;

    const usuario =
        localStorage.getItem(
            'usuarioLogado'
        );

    localStorage.setItem(
        `${usuario}_jogo_${id}`,
        JSON.stringify({
            mandante,
            visitante
        })
    );

    console.log(
        `Palpite do jogo ${id} salvo`
    );
}

document
    .querySelectorAll('.aba')
    .forEach(botao => {

        botao.addEventListener('click', () => {

            document
                .querySelectorAll('.aba')
                .forEach(b =>
                    b.classList.remove('ativa')
                );

            botao.classList.add('ativa');

            grupoSelecionado =
                botao.dataset.grupo;

            document.getElementById(
                'tituloGrupo'
            ).textContent =
                `🏆 Grupo ${grupoSelecionado}`;

            carregarJogos();

        });

    });

document.getElementById(
    'tituloGrupo'
).textContent =
    `🏆 Grupo ${grupoSelecionado}`;

carregarJogos();

const usuario =
    localStorage.getItem(
        'usuarioLogado'
    );

if (usuario) {

    document.getElementById(
        'usuario'
    ).innerHTML =
        `Olá, ${usuario} 👋`;

}

function sair() {

    localStorage.removeItem(
        'usuarioLogado'
    );

    window.location.href =
        'login.html';

}