import "./cards.css";

function CardUmidade({
    umidade,
    umidadeMinima,
    umidadeMaxima
}) {
    const possuiLeitura =
        umidade !== null &&
        umidade !== undefined;

    return (
        <section className="cartao-dashboard card-azul">
            <div className="cartao-cabecalho">
                <span className="cartao-icone">💧</span>
                <h3>Umidade do Solo</h3>
            </div>

            <div className="linha-umidade">
                <h1>
                    {possuiLeitura
                        ? `${umidade}%`
                        : "--"}
                </h1>
            </div>

            <div className="faixa-ideal">
                <span>Faixa ideal</span>

                <strong>
                    {umidadeMinima ?? "--"}% - {umidadeMaxima ?? "--"}%
                </strong>
            </div>
        </section>
    );
}

export default CardUmidade;