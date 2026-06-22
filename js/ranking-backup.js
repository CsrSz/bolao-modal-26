async function carregarRanking() {

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

            const pontos =
                calcularPontos(

                    palpite.mandante,
                    palpite.visitante,

                    resultado.mandante,
                    resultado.visitante

                );

            totalPontos += pontos;

        });

        ranking.push({

            nome:
                participante.nome,

            pontos:
                totalPontos

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

    tbody.innerHTML = '';

    ranking.forEach((p, index) => {

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${p.nome}</td>
                <td>${p.pontos}</td>
            </tr>
        `;

    });

}