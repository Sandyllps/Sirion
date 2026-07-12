import "./cards.css";


function CardUltimaIrrigacao({ ultimaIrrigacao }) {

    return (

        <section className="cartao-dashboard card-ambar">

            <div className="cartao-cabecalho">
                <span className="cartao-icone">🕒</span>
                <h3>Última Irrigação</h3>
            </div>

            <h2>{ultimaIrrigacao || "—"}</h2>

            <p>Último acionamento da bomba</p>

        </section>

    );

}

export default CardUltimaIrrigacao;
