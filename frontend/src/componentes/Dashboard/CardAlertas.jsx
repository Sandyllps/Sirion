import "./cards.css";

function PainelAlertas({ alertas }) {

    return (

        <section className={`cartao-dashboard ${alertas.length > 0 ? "card-vermelho" : "card-verde"}`}>

            <div className="cartao-cabecalho">
                <span className="cartao-icone">⚠️</span>
                <h3>Alertas do Sistema</h3>

                <span className={`selo ${alertas.length === 0 ? "selo-neutro" : ""}`}>
                    {alertas.length}
                </span>
            </div>

            {
                alertas.length === 0 ? (

                    <p>Nenhum alerta registrado.</p>

                ) : (

                    <ul className="lista-alertas">

                        {alertas.map((alerta, indice) => (

                            <li
                                key={indice}
                                className="item-alerta"
                            >

                                <strong>{alerta.horario}</strong>

                                <br />

                                {alerta.mensagem}

                            </li>

                        ))}

                    </ul>

                )
            }

        </section>

    );

}

export default PainelAlertas;
