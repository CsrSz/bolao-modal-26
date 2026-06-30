// =====================================================
// ENGINE - CHAVEAMENTO
// Copa do Mundo FIFA 2026
// Bolão MODAL Web
// =====================================================

const MAPA_16_AVOS = [
    { id: 73, mandante: 'Alemanha', visitante: 'Paraguai' },
    { id: 74, mandante: 'França', visitante: 'Suécia' },
    { id: 75, mandante: 'África do Sul', visitante: 'Canadá' },
    { id: 76, mandante: 'Holanda', visitante: 'Marrocos' },

    { id: 77, mandante: 'Portugal', visitante: 'Croácia' },
    { id: 78, mandante: 'Espanha', visitante: 'Áustria' },
    { id: 79, mandante: 'Estados Unidos', visitante: 'Bósnia' },
    { id: 80, mandante: 'Bélgica', visitante: 'Senegal' },

    { id: 81, mandante: 'Brasil', visitante: 'Japão' },
    { id: 82, mandante: 'Costa do Marfim', visitante: 'Noruega' },
    { id: 83, mandante: 'México', visitante: 'Equador' },
    { id: 84, mandante: 'Inglaterra', visitante: 'República do Congo' },

    { id: 85, mandante: 'Argentina', visitante: 'Cabo Verde' },
    { id: 86, mandante: 'Austrália', visitante: 'Egito' },
    { id: 87, mandante: 'Suíça', visitante: 'Argélia' },
    { id: 88, mandante: 'Colômbia', visitante: 'Gana' }
];

const MAPA_PROXIMAS_FASES = {

    oitavas: [
        { id: 89, origemMandante: 'V73', origemVisitante: 'V74' },
        { id: 90, origemMandante: 'V75', origemVisitante: 'V76' },
        { id: 91, origemMandante: 'V77', origemVisitante: 'V78' },
        { id: 92, origemMandante: 'V79', origemVisitante: 'V80' },

        { id: 93, origemMandante: 'V81', origemVisitante: 'V82' },
        { id: 94, origemMandante: 'V83', origemVisitante: 'V84' },
        { id: 95, origemMandante: 'V85', origemVisitante: 'V86' },
        { id: 96, origemMandante: 'V87', origemVisitante: 'V88' }
    ],

    quartas: [
        { id: 97, origemMandante: 'V89', origemVisitante: 'V90' },
        { id: 98, origemMandante: 'V93', origemVisitante: 'V94' },
        { id: 99, origemMandante: 'V91', origemVisitante: 'V92' },
        { id: 100, origemMandante: 'V95', origemVisitante: 'V96' }
    ],

    semifinal: [
        { id: 101, origemMandante: 'V97', origemVisitante: 'V99' },
        { id: 102, origemMandante: 'V98', origemVisitante: 'V100' }
    ],

    terceiroLugar: [
        { id: 103, origemMandante: 'P101', origemVisitante: 'P102' }
    ],

    final: [
        { id: 104, origemMandante: 'V101', origemVisitante: 'V102' }
    ]

};

export function gerarChaveamento() {

    const dezesseisAvos = MAPA_16_AVOS.map(jogo => {

        return {
            id: jogo.id,
            fase: '16AVOS',
            origemMandante: jogo.origemMandante || null,
            origemVisitante: jogo.origemVisitante || null,
            mandante: jogo.mandante,
            visitante: jogo.visitante,
            pendente: false,
            motivo: null
        };

    });

    return {
        dezesseisAvos,

        oitavas: montarFasePendente(
            MAPA_PROXIMAS_FASES.oitavas,
            'OITAVAS'
        ),

        quartas: montarFasePendente(
            MAPA_PROXIMAS_FASES.quartas,
            'QUARTAS'
        ),

        semifinal: montarFasePendente(
            MAPA_PROXIMAS_FASES.semifinal,
            'SEMIFINAL'
        ),

        terceiroLugar: montarFasePendente(
            MAPA_PROXIMAS_FASES.terceiroLugar,
            'TERCEIRO'
        ),

        final: montarFasePendente(
            MAPA_PROXIMAS_FASES.final,
            'FINAL'
        )
    };

}

function montarFasePendente(jogos, fase) {

    return jogos.map(jogo => {

        return {
            id: jogo.id,
            fase,
            origemMandante: jogo.origemMandante,
            origemVisitante: jogo.origemVisitante,
            mandante: 'A definir',
            visitante: 'A definir',
            pendente: true,
            motivo: `Depende de ${jogo.origemMandante} e ${jogo.origemVisitante}`
        };

    });

}