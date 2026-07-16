import Zone from "../models/zone.model.js";
import HistoricoUmidade from "../models/historico_umidade.model.js";

function criarAlerta(tipo, horario, mensagem) {
    return {
        tipo,
        horario: horario || null,
        mensagem
    };
}

async function getDashboard(req, res) {
    try {
        const chaveEsp = req.query.chave_esp;

        if (!chaveEsp) {
            return res.status(400).json({
                mensagem: "A chave do ESP32 é obrigatória."
            });
        }

        const zona = await Zone.findOne({
            "esp32.chave_esp": chaveEsp
        });

        if (!zona) {
            return res.status(404).json({
                mensagem:
                    "Nenhuma zona encontrada para essa chave ESP32."
            });
        }

        const historicoBanco =
            await HistoricoUmidade.find({
                id_zona: zona._id
            })
                .sort({
                    data_hora: -1
                })
                .limit(20)
                .lean();

        const ultimaLeitura =
            historicoBanco[0] || null;

        const leituraAnterior =
            historicoBanco[1] || null;

        const historicoUmidade =
            [...historicoBanco]
                .reverse()
                .map((registro) => ({
                    id: registro._id,
                    umidade: Number(registro.umidade),
                    data_hora: registro.data_hora
                }));

        const ultimaAtualizacao =
            ultimaLeitura
                ? new Date(ultimaLeitura.data_hora)
                : null;

        let statusConexao = "nunca_conectado";

        if (ultimaAtualizacao) {
            const diferencaSegundos =
                Math.floor(
                    (
                        Date.now() -
                        ultimaAtualizacao.getTime()
                    ) / 1000
                );

            statusConexao =
                diferencaSegundos <= 15
                    ? "conectado"
                    : "desconectado";
        }

        const estadoBombaAtual =
            statusConexao === "conectado" &&
            typeof zona.bomba_ativa === "boolean"
                ? zona.bomba_ativa
                : null;

        const alertas = [];

        if (!ultimaLeitura) {
            alertas.push(
                criarAlerta(
                    "aviso",
                    null,
                    "Nenhuma leitura de umidade foi recebida nesta zona."
                )
            );
        } else {
            const umidadeAtual =
                Number(ultimaLeitura.umidade);

            if (umidadeAtual < zona.min_umidade) {
                alertas.push(
                    criarAlerta(
                        "perigo",
                        ultimaLeitura.data_hora,
                        "Solo seco. A umidade está abaixo do limite configurado."
                    )
                );
            } else if (
                umidadeAtual > zona.max_umidade
            ) {
                alertas.push(
                    criarAlerta(
                        "aviso",
                        ultimaLeitura.data_hora,
                        "A umidade está acima do limite configurado."
                    )
                );
            } else {
                alertas.push(
                    criarAlerta(
                        "sucesso",
                        ultimaLeitura.data_hora,
                        "A umidade do solo está dentro da faixa ideal."
                    )
                );
            }

            if (leituraAnterior) {
                const variacao =
                    umidadeAtual -
                    Number(leituraAnterior.umidade);

                if (variacao >= 10) {
                    alertas.push(
                        criarAlerta(
                            "sucesso",
                            ultimaLeitura.data_hora,
                            `Aumento de ${variacao} pontos de umidade detectado. O solo recebeu água.`
                        )
                    );
                } else if (variacao <= -10) {
                    alertas.push(
                        criarAlerta(
                            "aviso",
                            ultimaLeitura.data_hora,
                            `Queda rápida de ${Math.abs(
                                variacao
                            )} pontos de umidade detectada.`
                        )
                    );
                }
            }
        }

        if (statusConexao === "desconectado") {
            alertas.unshift(
                criarAlerta(
                    "perigo",
                    ultimaAtualizacao,
                    "O ESP32 parou de enviar leituras recentes."
                )
            );
        }

        if (estadoBombaAtual === true) {
            alertas.unshift(
                criarAlerta(
                    "informacao",
                    ultimaAtualizacao,
                    "Bomba ligada. Irrigação em andamento."
                )
            );
        }

        if (zona.ultima_irrigacao) {
            const minutosDesdeIrrigacao =
                Math.floor(
                    (
                        Date.now() -
                        new Date(
                            zona.ultima_irrigacao
                        ).getTime()
                    ) / 60000
                );

            if (
                    estadoBombaAtual === false &&
                    minutosDesdeIrrigacao >= 0 &&
                    minutosDesdeIrrigacao <= 10
                ) {
                alertas.push(
                    criarAlerta(
                        "sucesso",
                        zona.ultima_irrigacao,
                        "Irrigação registrada recentemente."
                    )
                );
            }
        }

        return res.status(200).json({
            id_zona: zona._id,
            nome_zona: zona.nome,
            chave_esp: zona.esp32.chave_esp,

            umidade_media:
                ultimaLeitura
                    ? Number(ultimaLeitura.umidade)
                    : null,

            ultima_atualizacao:
                ultimaAtualizacao,

            status_conexao:
                statusConexao,

            bomba_ativa: estadoBombaAtual,

            ultima_irrigacao:
                zona.ultima_irrigacao || null,

            modo_irrigacao:
                zona.modo_irrigacao ||
                "automatico",

            alertas,
            historico_umidade: historicoUmidade
        });
    } catch (erro) {
        console.error(
            "Erro ao carregar Dashboard:",
            erro
        );

        return res.status(500).json({
            mensagem:
                "Erro interno ao carregar os dados do Dashboard."
        });
    }
}

export { getDashboard };