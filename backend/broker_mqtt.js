import { Aedes } from 'aedes';
import net from 'net';
import http from 'http';
import ws from 'websocket-stream';

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

    broker.on('publish', (pacote, cliente) => {
    //ignora mensagems internas de sistema do aedes
    if (cliente && !pacote.topic.startsWith('$SYS')) {
        console.log(`[PUBLICAÇÃO] Cliente ${cliente.id} publicou "${pacote.payload.toString()}" no tópico "${pacote.topic}"`);
    }
    });
}

export {iniciarBrokerMQTT}