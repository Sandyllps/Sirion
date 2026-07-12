import "./cards.css";

function CardUmidade() {

    const umidadeAtual = 58;

    return (

        <section className="cartao-dashboard card-azul">

            <div className="cartao-cabecalho">
                <span className="cartao-icone">💧</span>
                <h3>Umidade do Solo</h3>
            </div>

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
