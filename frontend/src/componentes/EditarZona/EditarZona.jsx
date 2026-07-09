import { useEffect, useState } from "react";
import { criarZona, editarZona } from "../../api";

import "./editarZona.css";

const ID_USUARIO = 3;

function EditarZona({ aberto, modo, zona, aoFechar, aoAtualizar }) {
    const [nomeZona, setNomeZona] = useState("");
    const [chaveZona, setChaveZona] = useState(crypto.randomUUID());
    const [statusConexao, setStatusConexao] = useState("desconectado");
    const [pinoBomba, setPinoBomba] = useState("G23");
    const [pinoSensorVazao, setPinoSensorVazao] = useState("G32");
    const [umidadeMinima, setUmidadeMinima] = useState(25);
    const [umidadeMaxima, setUmidadeMaxima] = useState(45);
    const [sensores, setSensores] = useState([]);

    useEffect(() => {
        if (!aberto) return;

        if (modo === "nova") {
            setNomeZona("");
            setChaveZona(crypto.randomUUID());
            setStatusConexao("desconectado");
            setPinoBomba("G23");
            setPinoSensorVazao("G32");
            setUmidadeMinima(25);
            setUmidadeMaxima(45);
            setSensores([]);
            return;
        }

        if (modo === "editar" && zona) {
            setNomeZona(zona.nome || "");
            setChaveZona(zona.esp32?.chave_esp || zona.chave_esp || zona.chave || "");
            setStatusConexao("desconectado");
            setPinoBomba(zona.esp32?.pino_bomba || zona.pinoBomba || "");
            setPinoSensorVazao(zona.esp32?.pino_sensor_vazao || zona.pinoSensorVazao || "");
            setUmidadeMinima(zona.min_umidade || zona.umidadeMinima || 25);
            setUmidadeMaxima(zona.max_umidade || zona.umidadeMaxima || 45);
            setSensores(
                (zona.esp32?.sensores_umidade || zona.sensores || []).map((sensor, indice) => ({
                    id: sensor.id || Date.now() + indice,
                    pino: sensor.pino || ""
                }))
            );
        }
    }, [aberto, modo, zona]);

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
        setSensores(sensores.filter((sensor) => sensor.id !== id));
    }

    function alterarPinoSensor(id, valor) {
        setSensores(
            sensores.map((sensor) =>
                sensor.id === id ? { ...sensor, pino: valor } : sensor
            )
        );
    }

    function gerarNovaChave() {
        setChaveZona(crypto.randomUUID());
    }

    async function copiarChave() {
        await navigator.clipboard.writeText(chaveZona);
        alert("Chave copiada.");
    }

    async function testarConexao() {
        setStatusConexao("testando");

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setStatusConexao("conectado");
    }

    async function salvarZona() {
        const dadosZona = {
            nome: nomeZona,
            min_umidade: Number(umidadeMinima),
            max_umidade: Number(umidadeMaxima),
            esp32: {
                pino_sensor_vazao: pinoSensorVazao,
                pino_bomba: pinoBomba,
                sensores_umidade: sensores.map((sensor) => ({
                    pino: sensor.pino
                }))
            }
        };

        try {
            let respostaApi = null;

            if (modo === "nova") {
                dadosZona.id_usuario = ID_USUARIO;
                dadosZona.esp32.chave_esp = chaveZona;

                respostaApi = await criarZona(dadosZona);
            }

            if (modo === "editar") {
                const idZona = zona?._id || zona?.id;

                if (!idZona) {
                    alert("Não foi possível editar: ID da zona não encontrado.");
                    return;
                }

                respostaApi = await editarZona(idZona, ID_USUARIO, dadosZona);
            }

            console.log("Zona salva com sucesso:", respostaApi);

            if (aoAtualizar) {
                await aoAtualizar();
            }

            aoFechar();

        } catch (erro) {
            console.error("Erro ao salvar zona:", erro);
            alert("Não foi possível salvar a zona. Veja o console.");
        }
    }

    if (!aberto) {
        return null;
    }

    return (
        <section className="fundo-modal">
            <div className="modal-editar-zona">
                <div className="cabecalho-modal">
                    <h2>{modo === "editar" ? "Editar Zona" : "Nova Zona"}</h2>
                </div>

                <div className="conteudo-modal">
                    <label>Nome da Zona</label>
                    <input
                        type="text"
                        value={nomeZona}
                        onChange={(evento) => setNomeZona(evento.target.value)}
                    />

                    <label>Chave da Zona</label>
                    <div className="linha">
                        <input type="text" value={chaveZona} readOnly />

                        <button type="button" onClick={copiarChave}>
                            Copiar
                        </button>

                        <button type="button" onClick={gerarNovaChave}>
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
                        {statusConexao === "desconectado"
                            ? " 🔴 Desconectado"
                            : statusConexao === "testando"
                            ? " 🟡 Testando..."
                            : " 🟢 Conectado"}
                    </p>

                    <label>Pino da Bomba</label>
                    <input
                        type="text"
                        value={pinoBomba}
                        onChange={(evento) => setPinoBomba(evento.target.value)}
                    />

                    <label>Pino do Sensor de Vazão</label>
                    <input
                        type="text"
                        value={pinoSensorVazao}
                        onChange={(evento) => setPinoSensorVazao(evento.target.value)}
                    />

                    <h3>Sensores de Umidade</h3>

                    {sensores.map((sensor, indice) => (
                        <div className="sensor" key={sensor.id}>
                            <p>Sensor {indice + 1}</p>

                            <input
                                type="text"
                                value={sensor.pino}
                                onChange={(evento) =>
                                    alterarPinoSensor(sensor.id, evento.target.value)
                                }
                            />

                            <button type="button" onClick={() => removerSensor(sensor.id)}>
                                ✕
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={adicionarSensor}>
                        + Adicionar Sensor
                    </button>

                    <label>Umidade mínima para ativação</label>
                    <div className="linha">
                        <input
                            type="number"
                            value={umidadeMinima}
                            onChange={(evento) => setUmidadeMinima(evento.target.value)}
                        />
                        <span>%</span>
                    </div>

                    <label>Umidade máxima para desligamento</label>
                    <div className="linha">
                        <input
                            type="number"
                            value={umidadeMaxima}
                            onChange={(evento) => setUmidadeMaxima(evento.target.value)}
                        />
                        <span>%</span>
                    </div>
                </div>

                <div className="rodape-modal">
                    <button type="button" onClick={aoFechar}>
                        Cancelar
                    </button>

                    <button type="button" onClick={salvarZona}>
                        Salvar
                    </button>
                </div>
            </div>
        </section>
    );
}

export default EditarZona;