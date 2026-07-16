import { useEffect, useState } from "react";

import {
    atualizarModoIrrigacao,
    controlarBombaManual
} from "../../api";

import "./cards.css";

function CardModoIrrigacao({
    idZona,
    idUsuario,
    modoIrrigacao,
    bombaLigada,
    aoAtualizar
}) {
    const [modoAutomatico, setModoAutomatico] =
        useState(true);

    const [carregandoModo, setCarregandoModo] =
        useState(false);

    const [carregandoBomba, setCarregandoBomba] =
        useState(false);

    useEffect(() => {
        setModoAutomatico(
            modoIrrigacao !== "manual"
        );
    }, [modoIrrigacao, idZona]);

    async function alterarModo() {
        if (
            !idZona ||
            !idUsuario ||
            carregandoModo ||
            carregandoBomba
        ) {
            return;
        }

        const novoModo =
            modoAutomatico
                ? "manual"
                : "automatico";

        try {
            setCarregandoModo(true);

            await atualizarModoIrrigacao(
                idZona,
                idUsuario,
                novoModo
            );

            setModoAutomatico(
                novoModo === "automatico"
            );

            if (aoAtualizar) {
                await aoAtualizar();
            }
        } catch (erro) {
            console.error(
                "Erro ao alterar modo de irrigação:",
                erro
            );

            alert(
                erro.message ||
                "Não foi possível alterar o modo de irrigação."
            );
        } finally {
            setCarregandoModo(false);
        }
    }

    async function alterarEstadoBomba() {
        if (
            modoAutomatico ||
            !idZona ||
            !idUsuario ||
            carregandoModo ||
            carregandoBomba
        ) {
            return;
        }

        const acao =
            bombaLigada === true
                ? "desligar"
                : "ligar";

        try {
            setCarregandoBomba(true);

            await controlarBombaManual(
                idZona,
                idUsuario,
                acao
            );

            /*
             * O ESP32 publica seu estado a cada
             * cinco segundos. Aguardamos a confirmação
             * real do dispositivo antes de atualizar.
             */
            await new Promise((resolve) => {
                setTimeout(resolve, 5500);
            });

            if (aoAtualizar) {
                await aoAtualizar();
            }
        } catch (erro) {
            console.error(
                "Erro ao controlar a bomba:",
                erro
            );

            alert(
                erro.message ||
                "Não foi possível controlar a bomba."
            );
        } finally {
            setCarregandoBomba(false);
        }
    }

    function obterEstadoBomba() {
        if (bombaLigada === true) {
            return "Bomba ligada";
        }

        if (bombaLigada === false) {
            return "Bomba desligada";
        }

        return "Aguardando estado do ESP32";
    }

    return (
        <section className="cartao-dashboard card-roxo">
            <div className="cartao-cabecalho">
                <span className="cartao-icone">
                    🎛️
                </span>

                <h3>Modo de Irrigação</h3>
            </div>

            <div className="modo-container">
                <div className="modo-informacoes">
                    <h2>
                        {modoAutomatico
                            ? "Automático"
                            : "Manual"}
                    </h2>

                    {!modoAutomatico && (
                        <small>
                            {obterEstadoBomba()}
                        </small>
                    )}
                </div>

                <div className="acoes-modo">
                    <button
                        type="button"
                        className="botao-modo"
                        onClick={alterarModo}
                        disabled={
                            !idZona ||
                            !idUsuario ||
                            carregandoModo ||
                            carregandoBomba
                        }
                    >
                        {carregandoModo
                            ? "Alterando..."
                            : "Alterar modo"}
                    </button>

                    {!modoAutomatico && (
                        <button
                            type="button"
                            className={`botao-bomba-manual ${
                                bombaLigada === true
                                    ? "desligar"
                                    : "ligar"
                            }`}
                            onClick={alterarEstadoBomba}
                            disabled={
                                !idZona ||
                                !idUsuario ||
                                carregandoModo ||
                                carregandoBomba
                            }
                        >
                            {carregandoBomba
                                ? "Aguardando ESP32..."
                                : bombaLigada === true
                                ? "Desligar bomba"
                                : "Ligar bomba"}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

export default CardModoIrrigacao;