function CardUmidade() {

    const umidadeAtual = 58;

    return (

        <section className="cartao-dashboard">

            <h3>Umidade Atual</h3>

            <h1>{umidadeAtual}%</h1>

            <p>Faixa ideal: 25% - 45%</p>

            <small>Atualizado agora</small>

        </section>

    );

}

export default CardUmidade;