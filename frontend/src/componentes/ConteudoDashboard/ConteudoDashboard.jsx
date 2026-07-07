import "./conteudoDashboard.css";
import CardUmidade from "../Dashboard/CardUmidade";
import CardBomba from "../Dashboard/CardBomba";
import CardVolume from "../Dashboard/CardVolume";
import CardModoIrrigacao from "../Dashboard/CardModoIrrigacao";
import CardUltimaIrrigacao from "../Dashboard/CardUltimaIrrigacao";
import PainelAlertas from "../Dashboard/CardAlertas";
import GraficoUmidade from "../Dashboard/GraficoUmidade";

function PainelLateral({ zona, aoEditarZona }) {


    return (

        <main className="painel-dashboard">

            <section className="cabecalho-dashboard">

                <div>
                    <h2 className="titulo-zona">
                        {zona?.nome || "Selecione uma zona"}
                    </h2>
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
                    volume={zona?.volume}
                />

                <CardModoIrrigacao />

                <CardUltimaIrrigacao
                    ultimaIrrigacao={zona?.ultimaIrrigacao}
                />

                <PainelAlertas
                    alertas={zona?.alertas || []}
                />

                <GraficoUmidade
                    dados={zona?.historicoUmidade || []}
                />

            </section>

        </main>

    );

}

export default PainelLateral;