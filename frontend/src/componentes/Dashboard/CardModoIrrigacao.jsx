import { useState } from "react";
import "./../../telas/TelaPrincipal/dashboard.css";

function CardModoIrrigacao() {

    const [modoAutomatico, setModoAutomatico] = useState(true);

    function alterarModo() {

        setModoAutomatico(!modoAutomatico);

    }

    return (

        <section className="cartao-dashboard">

            <h3>Modo de Irrigação</h3>

            <h2>

                {modoAutomatico ? "Automático" : "Manual"}

            </h2>

            <button
                className="botao-modo"
                onClick={alterarModo}
            >

                Alterar modo

            </button>

        </section>

    );

}

export default CardModoIrrigacao;