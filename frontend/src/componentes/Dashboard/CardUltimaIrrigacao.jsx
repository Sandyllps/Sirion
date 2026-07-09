import "./cards.css";


function CardUltimaIrrigacao({ ultimaIrrigacao }) {

    return (

        <section className="cartao-dashboard">

            <h3>Última Irrigação</h3>

            <h2>{ultimaIrrigacao}</h2>

            <p>Último acionamento da bomba</p>

        </section>

    );

}

export default CardUltimaIrrigacao;