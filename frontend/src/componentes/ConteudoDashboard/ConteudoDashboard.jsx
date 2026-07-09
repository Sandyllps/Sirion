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

            <section className="linha-superior">

                <CardUmidade />

                <CardBomba />

                <CardUltimaIrrigacao
                    ultimaIrrigacao={zona?.ultimaIrrigacao}
                />

                <CardModoIrrigacao />
            </section>

            <section className="linha-inferior">

                <div className="coluna-esquerda">
                    <GraficoUmidade
                        dados={zona?.historicoUmidade || []}
                    />
                </div>

                <div className="coluna-direita">

                    <div className="painel-alertas">

                        <PainelAlertas
                            alertas={zona?.alertas || []}
                        />
                    </div>

                    <div className="painel-volume">
                        <CardVolume
                            volume={zona?.volume}
                        />
                    </div>
                    
                </div>
               

            </section>

        </main>

    );

}

export default PainelLateral;