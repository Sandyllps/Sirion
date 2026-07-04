import "./../../telas/TelaPrincipal/dashboard.css";

function CardVolume({ volume }) {

    return (

        <section className="cartao-dashboard">

            <h3>Consumo da Irrigação</h3>

            <h1>{volume} L</h1>

            <p>Total consumido na irrigação atual</p>

        </section>

    );

}

export default CardVolume;