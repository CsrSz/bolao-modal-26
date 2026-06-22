async function carregarRanking() {

    try {

        const [
            participantesResp,
            palpitesResp,
            resultadosResp
        ] = await Promise.all([

            supabaseClient
                .from('participantes')
                .select('*'),

            supabaseClient
                .from('palpites')
                .select('*'),

            supabaseClient
                .from('resultados')
                .select('*')

        ]);

        if (participantesResp.error) {
            throw participantesResp.error;
        }

        if (palpitesResp.error) {
            throw palpitesResp.error;
        }

        if (resultadosResp.error) {
            throw resultadosResp.error;
        }

        const participantes =
            participantesResp.data || [];

        const palpites =
            palpitesResp.data || [];

        const resultados =
            resultadosResp.data || [];

        const ranking = [];

        participantes.forEach(participante => {

            let totalPontos = 0;

            const palpitesParticipante =
                palpites.filter(
                    p =>
                        p.participante_id ===
                        participante.id
                );

            palpitesParticipante.forEach(palpite => {

                const resultado =
                    resultados.find(
                        r =>
                            r.jogo_id ===
                            palpite.jogo_id
                    );

                if (!resultado) {
                    return;
                }

                totalPontos += calcularPontos(

                    palpite.mandante,
                    palpite.visitante,

                    resultado.mandante,
                    resultado.visitante

                );

            });

            ranking.push({

                nome: participante.nome,
                pontos: totalPontos

            });

        });

        ranking.sort((a, b) => {

            if (b.pontos !== a.pontos) {
                return b.pontos - a.pontos;
            }

            return a.nome.localeCompare(
                b.nome
            );

        });

        const tbody =
            document.getElementById(
                'ranking-body'
            );

        if (!tbody) {
            console.error(
                'Elemento ranking-body não encontrado.'
            );
            return;
        }

        tbody.innerHTML = '';

        ranking.forEach((item, indice) => {

            // Aplica a classe para os 4 primeiros (índices de 0 a 3) OU para o 18º colocado (índice 17)
            const classeLinha = (indice <= 3 || indice === 17) ? 'class="top-ranking"' : '';

            tbody.innerHTML += `
                <tr ${classeLinha}>
                    <td>${indice + 1}º</td>
                    <td>${item.nome}</td>
                    <td>${item.pontos}</td>
                </tr>
            `;

        });

    }
    catch (erro) {

        console.error(
            'Erro ao carregar ranking:',
            erro
        );

    }

}

document.addEventListener(
    'DOMContentLoaded',
    carregarRanking
);