import { useEffect, useState } from "react";
import { atualizarModoIrrigacao } from "../../api";

import "./cards.css";

function CardModoIrrigacao({
    idZona,
    idUsuario,
    modoIrrigacao,
    aoAtualizar
}) {
    const [modoAutomatico, setModoAutomatico] =
        useState(true);

    const [carregando, setCarregando] =
        useState(false);

    useEffect(() => {
        setModoAutomatico(
            modoIrrigacao !== "manual"
        );
    }, [modoIrrigacao, idZona]);

    async function alterarModo() {
        if (!idZona || !idUsuario || carregando) {
            return;
        }

        const novoModo = modoAutomatico
            ? "manual"
            : "automatico";

        try {
            setCarregando(true);

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
                "Não foi possível alterar o modo de irrigação."
            );
        } finally {
            setCarregando(false);
        }
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
                <h2>
                    {modoAutomatico
                        ? "Automático"
                        : "Manual"}
                </h2>

                <button
                    type="button"
                    className="botao-modo"
                    onClick={alterarModo}
                    disabled={
                        !idZona ||
                        !idUsuario ||
                        carregando
                    }
                >
                    {carregando
                        ? "Alterando..."
                        : "Alterar modo"}
                </button>
            </div>
        </section>
    );
}

export default CardModoIrrigacao;