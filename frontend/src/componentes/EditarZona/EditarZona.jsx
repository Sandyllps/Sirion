import { useEffect, useState } from "react";
import { criarZona, editarZona, excluirZona } from "../../api";

import "./editarZona.css";


function EditarZona({ aberto, modo, zona, idUsuario, aoFechar, aoAtualizar }) {
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
        if (modo === "editar") {
            const confirmou = window.confirm(
                "Ao gerar uma nova chave, o firmware precisará usar exatamente essa nova chave. Deseja continuar?"
            );

            if (!confirmou) {
                return;
            }
        }

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
        if (!chaveZona.trim()) {
            alert("A chave ESP é obrigatória.");
            return;
        }

        const dadosZona = {
            nome: nomeZona.trim(),
            min_umidade: Number(umidadeMinima),
            max_umidade: Number(umidadeMaxima),

            esp32: {
                chave_esp: chaveZona.trim(),

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
                dadosZona.id_usuario = idUsuario;

                respostaApi = await criarZona(dadosZona);
            }

            if (modo === "editar") {
                const idZona = zona?._id || zona?.id;

                if (!idZona) {
                    alert(
                        "Não foi possível editar: ID da zona não encontrado."
                    );
                    return;
                }

                respostaApi = await editarZona(
                    idZona,
                    idUsuario,
                    dadosZona
                );
            }

            console.log(
                "Zona salva com sucesso:",
                respostaApi
            );

            if (aoAtualizar) {
                await aoAtualizar();
            }

            aoFechar();

        } catch (erro) {
            console.error(
                "Erro ao salvar zona:",
                erro
            );

            alert(
                erro.message ||
                "Não foi possível salvar a zona."
            );
        }
    }

    async function removerZona() {
        const idZona = zona?._id || zona?.id;

        if (!idZona) {
            alert("Não foi possível excluir: ID da zona não encontrado.");
            return;
        }

        const desejaExcluir = window.confirm(
            `Deseja realmente excluir a zona "${zona.nome}"?`
        );

        if (!desejaExcluir) {
            return;
        }

        try {
            await excluirZona(idZona);

            if (aoAtualizar) {
                await aoAtualizar();
            }

            aoFechar();

        } catch (erro) {
            console.error("Erro ao excluir zona:", erro);
            alert(erro.message);
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

                    <button
                        type="button"
                        className="botao-fechar-modal"
                        onClick={aoFechar}
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                <div className="conteudo-modal">

                    <div className="campo">
                        <label>Nome da Zona</label>
                        <input
                            className="input-zona"
                            type="text"
                            placeholder="Ex: Horta, Jardim, Estufa 1"
                            value={nomeZona}
                            onChange={(evento) => setNomeZona(evento.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Chave da Zona</label>
                        <div className="linha">
                            <input className="input-zona" type="text" value={chaveZona} readOnly />

                            <button type="button" className="btn-secundario" onClick={copiarChave}>
                                Copiar
                            </button>

                            <button type="button" className="btn-secundario" onClick={gerarNovaChave}>
                                Nova
                            </button>
                        </div>
                    </div>

                    <div className="campo campo-conexao">
                        <button
                            className="botao-conexao"
                            type="button"
                            onClick={testarConexao}
                        >
                            Testar conexão
                        </button>

                        <p className={`status-conexao status-${statusConexao}`}>
                            {statusConexao === "desconectado"
                                ? "🔴 Desconectado"
                                : statusConexao === "testando"
                                ? "🟡 Testando..."
                                : "🟢 Conectado"}
                        </p>
                    </div>

                    <div className="linha-dupla">
                        <div className="campo">
                            <label>Pino da Bomba</label>
                            <input
                                className="input-zona"
                                type="text"
                                value={pinoBomba}
                                onChange={(evento) => setPinoBomba(evento.target.value)}
                            />
                        </div>

                        <div className="campo">
                            <label>Pino do Sensor de Vazão</label>
                            <input
                                className="input-zona"
                                type="text"
                                value={pinoSensorVazao}
                                onChange={(evento) => setPinoSensorVazao(evento.target.value)}
                            />
                        </div>
                    </div>

                    <div className="secao-sensores">
                        <h3 className="titulo-secao">Sensores de Umidade</h3>

                        {sensores.length === 0 && (
                            <p className="texto-vazio">Nenhum sensor adicionado ainda.</p>
                        )}

                        {sensores.map((sensor, indice) => (
                            <div className="sensor" key={sensor.id}>
                                <span className="sensor-rotulo">Sensor {indice + 1}</span>

                                <input
                                    className="input-zona"
                                    type="text"
                                    placeholder="Pino"
                                    value={sensor.pino}
                                    onChange={(evento) =>
                                        alterarPinoSensor(sensor.id, evento.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    className="botao-remover-sensor"
                                    onClick={() => removerSensor(sensor.id)}
                                    aria-label={`Remover sensor ${indice + 1}`}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <button type="button" className="btn-secundario btn-adicionar-sensor" onClick={adicionarSensor}>
                            + Adicionar Sensor
                        </button>
                    </div>

                    <div className="linha-dupla">
                        <div className="campo">
                            <label>Umidade mínima para ativação</label>
                            <div className="linha campo-percentual">
                                <input
                                    className="input-zona"
                                    type="number"
                                    value={umidadeMinima}
                                    onChange={(evento) => setUmidadeMinima(evento.target.value)}
                                />
                                <span className="sufixo-percentual">%</span>
                            </div>
                        </div>

                        <div className="campo">
                            <label>Umidade máxima para desligamento</label>
                            <div className="linha campo-percentual">
                                <input
                                    className="input-zona"
                                    type="number"
                                    value={umidadeMaxima}
                                    onChange={(evento) => setUmidadeMaxima(evento.target.value)}
                                />
                                <span className="sufixo-percentual">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rodape-modal">
                    {modo === "editar" && (
                        <button
                            type="button"
                            className="btn-perigo"
                            onClick={removerZona}
                        >
                            Excluir
                        </button>
                    )}

                    <div className="rodape-modal-direita">
                        <button type="button" className="btn-secundario" onClick={aoFechar}>
                            Cancelar
                        </button>

                        <button type="button" className="btn-primario" onClick={salvarZona}>
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EditarZona;
