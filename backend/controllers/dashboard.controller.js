async function getDashboard(req, res){

    return res.status(200).json({

        umidade_media: 38,

        bomba_ativa: false,

        volume_litros: 2.35,

        ultima_irrigacao: "14:32",

        modo_automatico: true,

        alertas: [

            {

                horario:"14:10",

                mensagem:"Solo seco. Irrigação iniciada."

            }

        ],

        historico_umidade:[

            {

                hora:"08:00",

                umidade:22

            },

            {

                hora:"09:00",

                umidade:28

            },

            {

                hora:"10:00",

                umidade:35

            }

        ]

    });

}

export { getDashboard };