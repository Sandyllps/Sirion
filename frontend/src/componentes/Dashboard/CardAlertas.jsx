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
            minute: "2-digit",
            second: "2-digit"
        });
    }

    const possuiPerigo =
        alertas.some(
            (alerta) =>
                alerta.tipo === "perigo"
        );

    const possuiAviso =
        alertas.some(
            (alerta) =>
                alerta.tipo === "aviso"
        );

    const classeCard =
        possuiPerigo
            ? "card-vermelho"
            : possuiAviso
            ? "card-ambar"
            : "card-verde";

    return (
        <section
            className={`cartao-dashboard ${classeCard}`}
        >
            <div className="cartao-cabecalho">
                <span className="cartao-icone">
                    ⚠️
                </span>

                <h3>Alertas do Sistema</h3>

                <span
                    className={`selo ${
                        alertas.length === 0
                            ? "selo-neutro"
                            : ""
                    }`}
                >
                    {alertas.length}
                </span>
            </div>

            {alertas.length === 0 ? (
                <p>
                    Nenhum evento ou alerta registrado.
                </p>
            ) : (
                <ul className="lista-alertas">
                    {alertas.map(
                        (alerta, indice) => (
                            <li
                                key={`${alerta.mensagem}-${indice}`}
                                className={`item-alerta alerta-${
                                    alerta.tipo ||
                                    "aviso"
                                }`}
                            >
                                <strong>
                                    {formatarHorario(
                                        alerta.horario
                                    )}
                                </strong>

                                <br />

                                {alerta.mensagem}
                            </li>
                        )
                    )}
                </ul>
            )}
        </section>
    );
}

export default PainelAlertas;