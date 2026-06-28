let jogos = [];
let grupoAtual = 'A';

async function carregarJogosAdmin() {

    const { data, error } = await supabase
        .from('jogos')
        .select('*')
        .order('id');

    if (error) {
        console.error('Erro ao carregar jogos:', error);
        return;
    }

    jogos = data;

    criarAbas();
    renderizarGrupo(grupoAtual);
}

function criarAbas() {

    const grupos = [...new Set(jogos.map(j => j.grupo))];
    const container = document.getElementById('grupo-tabs');

    container.innerHTML = '';

    grupos.forEach(grupo => {

        const botao = document.createElement('button');

        // AJUSTE: Usando as classes 'aba' e 'ativa' do novo CSS
        botao.className =
            grupo === grupoAtual
                ? 'aba ativa'
                : 'aba';

        botao.textContent = `Grupo ${grupo}`;

        botao.onclick = () => {

            grupoAtual = grupo;

            // AJUSTE: Buscando os botões pela classe 'aba' e removendo a 'ativa'
            document.querySelectorAll('.aba')
                .forEach(btn => btn.classList.remove('ativa'));

            botao.classList.add('ativa');

            renderizarGrupo(grupo);
        };

        container.appendChild(botao);
    });
}

async function buscarResultado(jogoId) {

    const { data, error } = await supabase
        .from('resultados')
        .select('*')
        .eq('jogo_id', jogoId)
        .maybeSingle();

    if (error) {
        console.error('Erro ao buscar resultado:', error);
        return null;
    }

    return data;
}

async function renderizarGrupo(grupo) {

    const tbody = document.getElementById('admin-body');
    tbody.innerHTML = '';

    const jogosGrupo = jogos.filter(jogo => jogo.grupo === grupo);

    for (const jogo of jogosGrupo) {

        const resultado = await buscarResultado(jogo.id) || {};

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
                        ${jogo.mandante} x ${jogo.visitante}
                    </strong>
                    <br>
                    ${jogo.data} às ${jogo.hora}
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
    }

    configurarEventos();
}

function configurarEventos() {

    const inputs = document.querySelectorAll('.placar');

    inputs.forEach(input => {
        input.addEventListener('change', salvarResultado);
    });
}

async function salvarResultado() {

    const id = this.dataset.id;

    const mandante = document.querySelector(
        `.oficial-m[data-id="${id}"]`
    ).value;

    const visitante = document.querySelector(
        `.oficial-v[data-id="${id}"]`
    ).value;

    const { error } = await supabase
        .from('resultados')
        .upsert({
            jogo_id: id,
            mandante: mandante === '' ? null : Number(mandante),
            visitante: visitante === '' ? null : Number(visitante)
        }, {
            onConflict: 'jogo_id'
        });

    if (error) {
        console.error('Erro ao salvar resultado:', error);
        alert('Erro ao salvar resultado');
        return;
    }

    renderizarGrupo(grupoAtual);
}

carregarJogosAdmin();