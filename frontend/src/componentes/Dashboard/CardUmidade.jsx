import "./cards.css";

function CardUmidade() {

    const umidadeAtual = 58;

    return (

        <section className="cartao-dashboard">

            <div className="linha-umidade">

                <h1>{umidadeAtual}%</h1>

            </div>

            <div className="faixa-ideal">

                <span>Faixa ideal</span>

                <strong>25% - 45%</strong>

            </div>


        </section>

    );

}

export default CardUmidade;