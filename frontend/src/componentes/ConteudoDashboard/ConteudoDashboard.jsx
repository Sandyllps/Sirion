import "./conteudoDashboard.css";
import CardUmidade from "../Dashboard/CardUmidade";
import CardBomba from "../Dashboard/CardBomba";
import CardVolume from "../Dashboard/CardVolume";
import CardModoIrrigacao from "../Dashboard/CardModoIrrigacao";
import CardUltimaIrrigacao from "../Dashboard/CardUltimaIrrigacao";
import PainelAlertas from "../Dashboard/CardAlertas";
import GraficoUmidade from "../Dashboard/GraficoUmidade";

function PainelLateral({ dados, aoEditarZona }) {

    return (

        <main className="painel-dashboard">

            <section className="cabecalho-dashboard">

                <div>
                    <h2>
                        Dashboard
                    </h2>

                    <h3>
                        Jardim Principal
                    </h3>
                </div>

                <button
                    className="botao-editar"
                    onClick={aoEditarZona}
                >
                    Editar
                </button>
            </section>

            <section className="conteudo-dashboard">

                <CardUmidade />

                <CardBomba />

                <CardVolume
                    volume={2.35}
                />

                <CardModoIrrigacao />

                <CardUltimaIrrigacao
                    ultimaIrrigacao="14:32"
                />

                <PainelAlertas

                    alertas={[

                        {
                            horario: "14:32",
                            mensagem: "Solo seco. Irrigação iniciada automaticamente."
                        },

                        {
                            horario: "14:38",
                            mensagem: "Proteção Dry-Run ativada."
                        }
                    ]}
                />

                <GraficoUmidade
                    dados={[
                        {hora:"08:00", umidade:20},
                        {hora:"09:00", umidade:24},
                        {hora:"10:00", umidade:28},
                        {hora:"11:00", umidade:35},
                        {hora:"12:00", umidade:41},
                        {hora:"13:00", umidade:38}
                    ]}

                />

            </section>

        </main>

    );

}

export default PainelLateral;