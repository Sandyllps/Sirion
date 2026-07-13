import { useEffect, useState } from "react";
import "./cards.css";

function CardModoIrrigacao({ idZona }) {
    const [modoAutomatico, setModoAutomatico] =
        useState(true);

    const chaveArmazenamento = idZona
        ? `modo_irrigacao_${idZona}`
        : null;

    useEffect(() => {
        if (!chaveArmazenamento) {
            setModoAutomatico(true);
            return;
        }

        const modoSalvo = localStorage.getItem(
            chaveArmazenamento
        );

        setModoAutomatico(modoSalvo !== "manual");
    }, [chaveArmazenamento]);

    function alterarModo() {
        const novoModoAutomatico = !modoAutomatico;

        setModoAutomatico(novoModoAutomatico);

        if (chaveArmazenamento) {
            localStorage.setItem(
                chaveArmazenamento,
                novoModoAutomatico
                    ? "automatico"
                    : "manual"
            );
        }
    }

    return (
        <section className="cartao-dashboard card-roxo">
            <div className="cartao-cabecalho">
                <span className="cartao-icone">🎛️</span>
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
                    disabled={!idZona}
                >
                    Alterar modo
                </button>
            </div>
        </section>
    );
}

export default CardModoIrrigacao;