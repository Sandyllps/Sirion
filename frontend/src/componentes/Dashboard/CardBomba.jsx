import "./cards.css";

function CardBomba() {

    const bombaLigada = false;

    return (

        <section className={`cartao-dashboard ${bombaLigada ? "card-verde" : "card-vermelho"}`}>

            <div className="cartao-cabecalho">
                <span className="cartao-icone">⚡</span>
                <h3>Estado da Bomba</h3>
            </div>

            <div className="status-linha">

                <span className={`status-ponto ${bombaLigada ? "ligado" : "desligado"}`} />

                <h2>

                    {bombaLigada ? "Ligada" : "Desligada"}

                </h2>

            </div>

            <p>

                Controle automático

            </p>

        </section>

    );

}

export default CardBomba;
