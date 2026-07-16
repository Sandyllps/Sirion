import { Aedes } from 'aedes';
import net from 'net';
import http from 'http';
import ws from 'websocket-stream';
import Zone from './models/zone.model.js';
import HistoricoUmidade from './models/historico_umidade.model.js';

const broker = await Aedes.createBroker();

//criando os servidores com os módulos importados
const servidorTCP = net.createServer(broker.handle);
const servidorHTTP = http.createServer();

function iniciarBrokerMQTT(){
    //Configurando o servidor webSocket para o front
    ws.createServer({ server: servidorHTTP }, broker.handle);

    const PORTA_TCP = 1883; // Porta padrão MQTT
    const PORTA_WS = 9001;  // Porta para o WebSocket

    //Iniciando a escuta na porta TCP (para o futuro ESP32)
    servidorTCP.listen(PORTA_TCP, () => {
    console.log(`🔌 Broker MQTT rodando na porta ${PORTA_TCP} (TCP Puro - Para Hardware)`);
    });

    //Iniciando a escuta na porta webSocket (para a página Web)
    servidorHTTP.listen(PORTA_WS, () => {
    console.log(`🌐 Broker MQTT/WS rodando na porta ${PORTA_WS} (WebSockets - Para Frontend)`);
    });

    //eventos de log apenas para vermos o que está acontecendo por trás
    broker.on('client', (cliente) => {
    console.log(`[NOVO CLIENTE] Cliente conectado: ${cliente.id}`);
    });

    broker.on('publish', async (pacote, cliente) => {
    //ignora mensagems internas de sistema do aedes
    if (cliente && !pacote.topic.startsWith('$SYS')) {
        const payloadTexto = pacote.payload.toString();

        console.log(`[PUBLICAÇÃO] Cliente ${cliente.id} publicou "${payloadTexto}" no tópico "${pacote.topic}"`);

        //quando o ESP publicar a umidade, vamos salvar no histórico da zona correspondente
        if (pacote.topic === "sirion/jardim/umidade") {
            try {
                const dados = JSON.parse(payloadTexto);

                const chaveESP = dados.chave_esp;
                const umidade = Number(dados.umidade);
                const bombaAtiva =
                    typeof dados.bomba_ativa === "boolean"
                        ? dados.bomba_ativa
                        : null;

                if (!chaveESP || Number.isNaN(umidade)) {
                    console.log("[MQTT] Payload de umidade inválido. Esperado: { chave_esp, umidade }");
                    return;
                }

                const zona = await Zone.findOne({ "esp32.chave_esp": chaveESP });

                if (!zona) {
                    console.log(`[MQTT] Nenhuma zona encontrada para a chave ESP: ${chaveESP}`);
                    return;
                }

                const novoHistorico = await HistoricoUmidade.create({
                    umidade: umidade,
                    data_hora: new Date(),
                    id_zona: zona._id,
                });

                if (bombaAtiva !== null) {
                    const atualizacaoZona = {
                        bomba_ativa: bombaAtiva
                    };

                    const bombaAcabouDeLigar =
                        bombaAtiva === true &&
                        zona.bomba_ativa !== true;

                    if (bombaAcabouDeLigar) {
                        atualizacaoZona.ultima_irrigacao =
                            new Date();
                    }

                    await Zone.findByIdAndUpdate(
                        zona._id,
                        {
                            $set: atualizacaoZona
                        }
                    );
                }

                console.log(`[MQTT] Histórico de umidade salvo com sucesso para a zona "${zona.nome}".`);
                console.log("[MQTT] Registro salvo:", novoHistorico);
                
                if (bombaAtiva !== null) {
                    console.log(
                        `[MQTT] Estado da bomba: ${
                            bombaAtiva ? "Ligada" : "Desligada"
                        }`
                    );
                }
                
            } catch (erro) {
                console.error("[MQTT] Erro ao processar o histórico de umidade:", erro);
            }
        }
    }
    });
}

function solicitarRecarregamentoConfiguracoes() {
    broker.publish(
        {
            cmd: "publish",
            qos: 0,
            topic: "sirion/jardim/recarregar",
            payload: Buffer.from("recarregar"),
            retain: false
        },
        (erro) => {
            if (erro) {
                console.error(
                    "[MQTT] Erro ao solicitar recarregamento:",
                    erro
                );

                return;
            }

            console.log(
                "[MQTT] Recarregamento das configurações solicitado."
            );
        }
    );
}

function enviarComandoBombaManual(
    chaveESP,
    acao
) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            chave_esp: chaveESP,
            acao
        });

        broker.publish(
            {
                cmd: "publish",
                qos: 0,
                topic: "sirion/jardim/switch",
                payload: Buffer.from(payload),
                retain: false
            },
            (erro) => {
                if (erro) {
                    console.error(
                        "[MQTT] Erro ao enviar comando manual da bomba:",
                        erro
                    );

                    reject(erro);
                    return;
                }

                console.log(
                    `[MQTT] Comando manual enviado: ${acao} | ESP: ${chaveESP}`
                );

                resolve();
            }
        );
    });
}

export {
    iniciarBrokerMQTT,
    solicitarRecarregamentoConfiguracoes,
    enviarComandoBombaManual
};