import "./cards.css";

function PainelAlertas({ alertas = [] }) {
    function formatarHorario(horario) {
        if (!horario) {
            return "Sem horário";
        }

        const data = new Date(horario);

        if (Number.isNaN(data.getTime())) {
            return "Sem horário";
        }

        return data.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    const possuiAlertas = alertas.length > 0;

    return (
        <section
            className={`cartao-dashboard ${
                possuiAlertas
                    ? "card-vermelho"
                    : "card-verde"
            }`}
        >
            <div className="cartao-cabecalho">
                <span className="cartao-icone">⚠️</span>

                <h3>Alertas do Sistema</h3>

                <span
                    className={`selo ${
                        !possuiAlertas
                            ? "selo-neutro"
                            : ""
                    }`}
                >
                    {alertas.length}
                </span>
            </div>

            {!possuiAlertas ? (
                <p>
                    Umidade dentro da faixa configurada.
                </p>
            ) : (
                <ul className="lista-alertas">
                    {alertas.map((alerta, indice) => (
                        <li
                            key={`${alerta.mensagem}-${indice}`}
                            className="item-alerta"
                        >
                            <strong>
                                {formatarHorario(alerta.horario)}
                            </strong>

                            <br />

                            {alerta.mensagem}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default PainelAlertas;