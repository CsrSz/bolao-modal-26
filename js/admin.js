const SENHA_ADMIN = 'Modal@2026';

let jogos = [];
let resultados = [];
let grupoAtual = 'A';
let gerarCompeticao = null;

function validarAcessoAdmin() {

    const acessoLiberado =
        sessionStorage.getItem('adminLiberado') === 'SIM';

    if (acessoLiberado) {
        return true;
    }

    const senha = prompt('Informe a senha do Admin:');

    if (senha === SENHA_ADMIN) {

        sessionStorage.setItem('adminLiberado', 'SIM');

        return true;

    }

    alert('Acesso negado');

    window.location.href = 'index.html';

    return false;

}

async function carregarEngine() {

    const modulo = await import('./engine/competicao.js');

    gerarCompeticao = modulo.gerarCompeticao;

}

async function carregarJogosAdmin() {

    await carregarEngine();

    const { data, error } = await supabase
        .from('jogos')
        .select('*')
        .order('id');

    if (error) {
        console.error('Erro ao carregar jogos:', error);
        return;
    }

    jogos = data;

    await carregarResultados();

    await processarCompeticao();

    criarAbas();
    renderizarGrupo(grupoAtual);
}

async function carregarResultados() {

    const { data, error } = await supabase
        .from('resultados')
        .select('*');

    if (error) {
        console.error('Erro ao carregar resultados:', error);
        resultados = [];
        return;
    }

    resultados = data;

}

async function processarCompeticao() {

    if (!gerarCompeticao) {
        return;
    }

    const competicao = gerarCompeticao(jogos, resultados);

    if (
        !competicao.atualizacoesJogos ||
        competicao.atualizacoesJogos.length === 0
    ) {
        return;
    }

    await aplicarAtualizacoesJogos(
        competicao.atualizacoesJogos
    );

}

async function aplicarAtualizacoesJogos(atualizacoes) {

    for (const jogo of atualizacoes) {

        const { error } = await supabase
            .from('jogos')
            .update({
                mandante: jogo.mandante,
                visitante: jogo.visitante,
                origem_mandante: jogo.origem_mandante,
                origem_visitante: jogo.origem_visitante
            })
            .eq('id', jogo.id);

        if (error) {
            console.error(
                `Erro ao atualizar jogo ${jogo.id}:`,
                error
            );
            continue;
        }

        console.log(
            `Jogo ${jogo.id} atualizado: ${jogo.mandante} x ${jogo.visitante}`
        );

    }

    const { data, error } = await supabase
        .from('jogos')
        .select('*')
        .order('id');

    if (error) {
        console.error('Erro ao recarregar jogos:', error);
        return;
    }

    jogos = data;

}

function criarAbas() {

    const grupos = [...new Set(jogos.map(j => j.grupo))];
    const container = document.getElementById('grupo-tabs');

    container.innerHTML = '';

    grupos.forEach(grupo => {

        const botao = document.createElement('button');

        botao.className =
            grupo === grupoAtual
                ? 'aba ativa'
                : 'aba';

        botao.textContent =
            grupo === 'MATA'
                ? 'Mata-mata'
                : `Grupo ${grupo}`;

        botao.onclick = () => {

            grupoAtual = grupo;

            document.querySelectorAll('.aba')
                .forEach(btn => btn.classList.remove('ativa'));

            botao.classList.add('ativa');

            renderizarGrupo(grupo);
        };

        container.appendChild(botao);
    });
}

async function buscarResultado(jogoId) {

    const resultado = resultados.find(
        r => Number(r.jogo_id) === Number(jogoId)
    );

    return resultado || null;

}

async function renderizarGrupo(grupo) {

    const tbody = document.getElementById('admin-body');
    tbody.innerHTML = '';

    const jogosGrupo = jogos
        .filter(jogo => jogo.grupo === grupo)
        .sort((a, b) => {

            const ordemA = a.ordem ?? a.id;
            const ordemB = b.ordem ?? b.id;

            return ordemA - ordemB;

        });

    for (const jogo of jogosGrupo) {

        const resultado = await buscarResultado(jogo.id) || {};

        const preenchido =
            resultado.mandante !== undefined &&
            resultado.mandante !== null &&
            resultado.visitante !== undefined &&
            resultado.visitante !== null;

        const empate =
            preenchido &&
            Number(resultado.mandante) === Number(resultado.visitante);

        const jogoMataMata =
            jogo.grupo === 'MATA';

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
                    <br>
                    <small>${jogo.local ?? ''}</small>
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

                    ${
                        jogoMataMata && empate
                            ? montarSelectVencedor(jogo, resultado)
                            : ''
                    }

                </td>

            </tr>
        `;
    }

    configurarEventos();
}

function montarSelectVencedor(jogo, resultado) {

    return `
        <br>
        <select
            class="vencedor"
            data-id="${jogo.id}"
        >
            <option value="">Definir vencedor</option>

            <option
                value="MANDANTE"
                ${resultado.vencedor === 'MANDANTE' ? 'selected' : ''}
            >
                ${jogo.mandante}
            </option>

            <option
                value="VISITANTE"
                ${resultado.vencedor === 'VISITANTE' ? 'selected' : ''}
            >
                ${jogo.visitante}
            </option>
        </select>
    `;

}

function configurarEventos() {

    const inputs = document.querySelectorAll('.placar');

    inputs.forEach(input => {
        input.addEventListener('change', salvarResultado);
    });

    const selects = document.querySelectorAll('.vencedor');

    selects.forEach(select => {
        select.addEventListener('change', salvarResultado);
    });
}

async function salvarResultado() {

    const id = this.dataset.id;

    const jogo = jogos.find(
        j => Number(j.id) === Number(id)
    );

    const campoMandante = document.querySelector(
        `.oficial-m[data-id="${id}"]`
    );

    const campoVisitante = document.querySelector(
        `.oficial-v[data-id="${id}"]`
    );

    const mandante = campoMandante.value;
    const visitante = campoVisitante.value;

    const mandanteVazio = mandante === '';
    const visitanteVazio = visitante === '';

    if (mandanteVazio && visitanteVazio) {

        await apagarResultado(id);

        await carregarResultados();

        await processarCompeticao();

        renderizarGrupo(grupoAtual);

        return;

    }

    if (mandanteVazio || visitanteVazio) {
        return;
    }

    const placarMandante = Number(mandante);
    const placarVisitante = Number(visitante);

    let vencedor = null;

    const jogoMataMata =
        jogo && jogo.grupo === 'MATA';

    const empate =
        placarMandante === placarVisitante;

    if (jogoMataMata && empate) {

        const selectVencedor = document.querySelector(
            `.vencedor[data-id="${id}"]`
        );

        vencedor = selectVencedor
            ? selectVencedor.value || null
            : null;

    }

    const { error } = await supabase
        .from('resultados')
        .upsert({
            jogo_id: id,
            mandante: placarMandante,
            visitante: placarVisitante,
            vencedor
        }, {
            onConflict: 'jogo_id'
        });

    if (error) {
        console.error('Erro ao salvar resultado:', error);
        alert('Erro ao salvar resultado');
        return;
    }

    await carregarResultados();

    await processarCompeticao();

    renderizarGrupo(grupoAtual);
}

async function apagarResultado(jogoId) {

    const { error } = await supabase
        .from('resultados')
        .delete()
        .eq('jogo_id', jogoId);

    if (error) {
        console.error('Erro ao apagar resultado:', error);
        alert('Erro ao apagar resultado');
        return;
    }

    console.log(`Resultado do jogo ${jogoId} apagado`);

}

document.addEventListener('DOMContentLoaded', () => {

    if (!validarAcessoAdmin()) {
        return;
    }

    carregarJogosAdmin();

});