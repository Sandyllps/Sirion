import "./cards.css";

function CardUltimaIrrigacao({
    ultimaIrrigacao
}) {
    function formatarData(dataIrrigacao) {
        if (!dataIrrigacao) {
            return "Sem registro";
        }

        const data = new Date(dataIrrigacao);

        if (Number.isNaN(data.getTime())) {
            return "Sem registro";
        }

        return data.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    return (
        <section className="cartao-dashboard card-ambar">
            <div className="cartao-cabecalho">
                <span className="cartao-icone">
                    🕒
                </span>

                <h3>Última Irrigação</h3>
            </div>

            <h2>
                {formatarData(ultimaIrrigacao)}
            </h2>

            <p>
                Último acionamento real da bomba
            </p>
        </section>
    );
}

export default CardUltimaIrrigacao;