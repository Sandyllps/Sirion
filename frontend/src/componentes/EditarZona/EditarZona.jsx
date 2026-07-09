import { useEffect, useState } from "react";
import "./editarZona.css";

function EditarZona({ aberto, modo, zona, aoFechar }) {

    const [nomeZona, setNomeZona] = useState("Jardim Principal");
    const [chaveZona, setChaveZona] = useState(crypto.randomUUID());
    const [statusConexao, setStatusConexao] = useState("desconectado");
    const [pinoBomba, setPinoBomba] = useState("G23");
    const [pinoSensorVazao, setPinoSensorVazao] = useState("G32");
    const [umidadeMinima, setUmidadeMinima] = useState(25);
    const [umidadeMaxima, setUmidadeMaxima] = useState(45);
    const [sensores, setSensores] = useState([
        {
            id: 1,
            pino: "G34"
        },
        {
            id: 2,
            pino: "G35"
        }
    ]);

    useEffect(()=>{

        if(!aberto){

            return;

        }

        if(modo==="editar" && zona){

            setNomeZona(zona.nome || "");

            setChaveZona(zona.chave || crypto.randomUUID());

            setPinoBomba(zona.pinoBomba || 23);

            setPinoSensorVazao(zona.pinoSensorVazao || 32);

            setUmidadeMinima(zona.umidadeMinima || 25);

            setUmidadeMaxima(zona.umidadeMaxima || 45);

            setSensores(
                zona.sensores || []
            );
        }

        if(modo==="nova"){

            setNomeZona("");

            setChaveZona(crypto.randomUUID());

            setStatusConexao("desconectado");

            setPinoBomba(23);

            setPinoSensorVazao(32);

            setUmidadeMinima(25);

            setUmidadeMaxima(45);

            setSensores([]);

        }

    },[aberto,modo,zona]);

    function adicionarSensor() {
        setSensores([
            ...sensores,
            {
                id: Date.now(),
                pino: ""
            }
        ]);
    }

    function removerSensor(id) {
        setSensores(
            sensores.filter(
                sensor => sensor.id !== id
            )
        );
    }

    function alterarPinoSensor(id, valor) {
        setSensores(
            sensores.map(sensor =>
                sensor.id === id ? { ...sensor, pino: valor } : sensor)
        );
    }

    function gerarNovaChave() {
        setChaveZona(
            crypto.randomUUID()
        );
    }

    async function copiarChave() {
        await navigator.clipboard.writeText(chaveZona);
    }

    async function testarConexao() {
        setStatusConexao("testando");
        await new Promise(
            resolve => setTimeout(resolve, 1500)
        );
        setStatusConexao("conectado");
    }

    function salvarZona() {

        const idUsuario = 3;

        const dadosZona = {
            id_usuario: idUsuario,
            nome: nomeZona,
            min_umidade: umidadeMinima,
            max_umidade: umidadeMaxima,
            esp32: {
                chave_esp: chaveZona,
                pino_sensor_vazao: pinoSensorVazao,
                pino_bomba: pinoBomba,
                sensores_umidade: sensores.map((sensor) => ({
                    pino: sensor.pino
                }))
            }
        };

        console.log("Dados prontos para API:", dadosZona);

        aoFechar();
    }

    if (!aberto) {
        return null;
    }

    return (

        <section className="fundo-modal">

            <div className="modal-editar-zona">

                <div className="cabecalho-modal">
                    <h2>
                        {
                            modo === "editar" ? "Editar Zona" : "Nova Zona"
                        }
                    </h2>
                </div>

                <div className="conteudo-modal">

                    <label>
                        Nome da Zona
                    </label>

                    <input
                        type="text"
                        value={nomeZona}
                        onChange={(evento) =>
                            setNomeZona(evento.target.value)
                        }
                    />

                    <label>
                        Chave da Zona
                    </label>

                    <div className="linha">
                        <input
                            type="text"
                            value={chaveZona}
                            readOnly
                        />

                        <button
                            type="button"
                            onClick={copiarChave}
                        >
                            Copiar
                        </button>

                        <button
                            type="button"
                            onClick={gerarNovaChave}
                        >
                            Nova
                        </button>
                    </div>

                    <button
                        className="botao-conexao"
                        type="button"
                        onClick={testarConexao}
                    >
                        Testar conexão
                    </button>

                    <p className="status-conexao">
                        Status:
                        {
                            statusConexao === "desconectado"
                                ? " 🔴 Desconectado"
                                : statusConexao === "testando"
                                ? " 🟡 Testando..."
                                : " 🟢 Conectado"
                        }

                    </p>

                    <label>
                        Pino da Bomba
                    </label>

                    <input
                        type="text"
                        value={pinoBomba}
                        onChange={(evento) =>
                            setPinoBomba(evento.target.value)
                        }
                    />

                    <label>
                        Pino do Sensor de Vazão
                    </label>

                    <input
                        type="text"
                        value={pinoSensorVazao}
                        onChange={(evento) =>
                            setPinoSensorVazao(Number(evento.target.value))
                        }
                    />

                    <h3>
                        Sensores de Umidade
                    </h3>

                    {
                        sensores.map((sensor, indice) => (
                            <div
                                className="sensor"
                                key={sensor.id}
                            >
                                <p>
                                    Sensor {indice + 1}
                                </p>

                                <input
                                    type="text"
                                    value={sensor.pino}
                                    onChange={(evento) =>
                                        alterarPinoSensor(
                                            sensor.id,
                                            evento.target.value
                                        )
                                    }
                                />

                                <button

                                    type="button"
                                    
                                    onClick={() =>
                                        removerSensor(sensor.id)
                                    }
                                >
                                    ✕

                                </button>

                            </div>

                        ))

                    }

                    <button

                        type="button"
                        onClick={adicionarSensor}
                    >
                        + Adicionar Sensor

                    </button>

                    <label>
                        Umidade mínima para ativação
                    </label>

                    <div className="linha">

                        <input
                            type="number"
                            value={umidadeMinima}
                            onChange={(evento) =>
                                setUmidadeMinima(
                                    Number(evento.target.value)
                                )
                            }
                        />

                        <span>%</span>

                    </div>

                    <label>
                        Umidade máxima para desligamento
                    </label>

                    <div className="linha">

                        <input
                            type="number"
                            value={umidadeMaxima}
                            onChange={(evento) =>
                                setUmidadeMaxima(
                                    Number(evento.target.value)
                                )
                            }
                        />

                        <span>%</span>

                    </div>

                </div>

                <div className="rodape-modal">
                    <button
                        onClick={aoFechar}
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={salvarZona}
                    >
                        Salvar
                    </button>

                </div>

            </div>

        </section>

    );

}

export default EditarZona;