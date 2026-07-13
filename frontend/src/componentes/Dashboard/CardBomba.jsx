import "./cards.css";

function CardBomba({ bombaLigada }) {
    const possuiEstado =
        bombaLigada !== null &&
        bombaLigada !== undefined;

    return (
        <section
            className={`cartao-dashboard ${
                !possuiEstado
                    ? "card-vermelho"
                    : bombaLigada
                    ? "card-verde"
                    : "card-vermelho"
            }`}
        >
            <div className="cartao-cabecalho">
                <span className="cartao-icone">⚡</span>
                <h3>Estado da Bomba</h3>
            </div>

            <div className="status-linha">
                <span
                    className={`status-ponto ${
                        possuiEstado && bombaLigada
                            ? "ligado"
                            : "desligado"
                    }`}
                />

                <h2>
                    {!possuiEstado
                        ? "Sem leitura"
                        : bombaLigada
                        ? "Ligada"
                        : "Desligada"}
                </h2>
            </div>

            <p>Controle automático</p>
        </section>
    );
}

export default CardBomba;