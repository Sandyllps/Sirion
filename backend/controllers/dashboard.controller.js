import Zone from "../models/zone.model.js";
import HistoricoUmidade from "../models/historico_umidade.model.js";

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
                mensagem: "Nenhuma zona encontrada para essa chave ESP32."
            });
        }

        const historicoBanco = await HistoricoUmidade.find({
            id_zona: zona._id
        })
            .sort({
                data_hora: -1
            })
            .limit(20)
            .lean();

        const ultimaLeitura =
            historicoBanco.length > 0
                ? historicoBanco[0]
                : null;

        const historicoUmidade = [...historicoBanco]
            .reverse()
            .map((registro) => ({
                id: registro._id,
                umidade: registro.umidade,
                data_hora: registro.data_hora
            }));

        const ultimaAtualizacao = ultimaLeitura
            ? new Date(ultimaLeitura.data_hora)
            : null;

        let statusConexao = "nunca_conectado";

        if (ultimaAtualizacao) {
            const agora = new Date();

            const diferencaSegundos = Math.floor(
                (agora.getTime() - ultimaAtualizacao.getTime()) / 1000
            );

            statusConexao =
                diferencaSegundos <= 15
                    ? "conectado"
                    : "desconectado";
        }

        const alertas = [];

        if (!ultimaLeitura) {
            alertas.push({
                tipo: "aviso",
                horario: null,
                mensagem:
                    "Nenhuma leitura de umidade foi recebida nesta zona."
            });
        } else if (ultimaLeitura.umidade < zona.min_umidade) {
            alertas.push({
                tipo: "perigo",
                horario: ultimaLeitura.data_hora,
                mensagem:
                    "Solo seco. A umidade está abaixo do limite configurado."
            });
        } else if (ultimaLeitura.umidade > zona.max_umidade) {
            alertas.push({
                tipo: "aviso",
                horario: ultimaLeitura.data_hora,
                mensagem:
                    "A umidade está acima do limite configurado."
            });
        }

        return res.status(200).json({
            id_zona: zona._id,
            nome_zona: zona.nome,
            chave_esp: zona.esp32.chave_esp,

            umidade_media: ultimaLeitura
                ? ultimaLeitura.umidade
                : null,

            ultima_atualizacao: ultimaAtualizacao,
            status_conexao: statusConexao,

            bomba_ativa: null,
            ultima_irrigacao: null,
            modo_irrigacao: "automatico",

            alertas,
            historico_umidade: historicoUmidade
        });
    } catch (erro) {
        console.error("Erro ao carregar Dashboard:", erro);

        return res.status(500).json({
            mensagem:
                "Erro interno ao carregar os dados do Dashboard."
        });
    }
}

export { getDashboard };