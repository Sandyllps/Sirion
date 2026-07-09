import "./cards.css";

function PainelAlertas({ alertas }) {

    return (

        <section className="cartao-dashboard">

            <h3>Alertas do Sistema</h3>

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