async function carregarRanking() {

    try {

        const { data, error } = await supabaseClient
            .rpc('ranking');

        if (error) throw error;

        const tbody = document.getElementById('ranking-body');
        tbody.innerHTML = '';

        data.forEach((item, indice) => {

            const classeLinha =
                (indice <= 3 || indice === data.length - 1)
                    ? 'class="top-ranking"'
                    : '';

            tbody.innerHTML += `
                <tr ${classeLinha}>
                    <td>${indice + 1}º</td>
                    <td>${item.nome}</td>
                    <td>${item.pontos}</td>
                </tr>
            `;

        });

    } catch (erro) {

        console.error('Erro ao carregar ranking:', erro);

    }

}

document.addEventListener('DOMContentLoaded', carregarRanking);