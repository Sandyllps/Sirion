import "./cards.css";

function CardBomba() {

    const bombaLigada = false;

    return (

        <section className="cartao-dashboard">

            <h3>Estado da Bomba</h3>

            <h2>

                {bombaLigada ? "Ligada" : "Desligada"}

            </h2>

            <p>

                Controle automático

            </p>

        </section>

    );

}

export default CardBomba;