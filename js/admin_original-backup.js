let jogos = [];

let grupoAtual = 'A';

async function carregarJogosAdmin() {

    const resposta =
        await fetch('dados/jogos.json');

    jogos =
        await resposta.json();

    criarAbas();

    renderizarGrupo(grupoAtual);

}

function criarAbas() {

    const grupos =
        [...new Set(
            jogos.map(j => j.grupo)
        )];

    const container =
        document.getElementById(
            'grupo-tabs'
        );

    container.innerHTML = '';

    grupos.forEach(grupo => {

        const botao =
            document.createElement('button');

        botao.className =
            grupo === grupoAtual
                ? 'tab-btn active'
                : 'tab-btn';

        botao.textContent =
            `Grupo ${grupo}`;

        botao.onclick = () => {

            grupoAtual = grupo;

            document
                .querySelectorAll('.tab-btn')
                .forEach(btn =>
                    btn.classList.remove('active')
                );

            botao.classList.add('active');

            renderizarGrupo(grupo);

        };

        container.appendChild(botao);

    });

}

function renderizarGrupo(grupo) {

    const tbody =
        document.getElementById(
            'admin-body'
        );

    tbody.innerHTML = '';

    const jogosGrupo =
        jogos.filter(
            jogo => jogo.grupo === grupo
        );

    jogosGrupo.forEach(jogo => {

        const resultado =
            JSON.parse(
                localStorage.getItem(
                    `resultado_${jogo.id}`
                )
            ) || {};

        const preenchido =
            resultado.mandante !== undefined &&
            resultado.mandante !== '' &&
            resultado.visitante !== undefined &&
            resultado.visitante !== '';

        tbody.innerHTML += `

            <tr>

                <td>

                    ${
                        preenchido
                        ? '<span class="status-ok">✅</span>'
                        : '<span class="status-pendente">🟡</span>'
                    }

                </td>

                <td>

                    <strong>

                        ${jogo.mandante}
                        x
                        ${jogo.visitante}

                    </strong>

                    <br>

                    ${jogo.data}
                    às
                    ${jogo.hora}

                </td>

                <td>

                    <input
                        type="number"
                        min="0"
                        class="placar oficial-m"
                        data-id="${jogo.id}"
                        value="${resultado.mandante ?? ''}"
                    >

                    x

                    <input
                        type="number"
                        min="0"
                        class="placar oficial-v"
                        data-id="${jogo.id}"
                        value="${resultado.visitante ?? ''}"
                    >

                </td>

            </tr>

        `;

    });

    configurarEventos();

}

function configurarEventos() {

    const inputs =
        document.querySelectorAll(
            '.placar'
        );

    inputs.forEach(input => {

        input.addEventListener(
            'change',
            salvarResultado
        );

    });

}

function salvarResultado() {

    const id =
        this.dataset.id;

    const mandante =
        document.querySelector(
            `.oficial-m[data-id="${id}"]`
        ).value;

    const visitante =
        document.querySelector(
            `.oficial-v[data-id="${id}"]`
        ).value;

    localStorage.setItem(

        `resultado_${id}`,

        JSON.stringify({

            mandante,
            visitante

        })

    );

    renderizarGrupo(grupoAtual);

}

carregarJogosAdmin();