import "./conteudoDashboard.css";
import CardUmidade from "../Dashboard/CardUmidade";
import CardBomba from "../Dashboard/CardBomba";
import CardModoIrrigacao from "../Dashboard/CardModoIrrigacao";
import CardUltimaIrrigacao from "../Dashboard/CardUltimaIrrigacao";
import PainelAlertas from "../Dashboard/CardAlertas";
import GraficoUmidade from "../Dashboard/GraficoUmidade";

function PainelLateral({ zona, dadosZona, aoEditarZona }) {


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

                <CardUmidade
                    umidade={dadosZona?.umidade_media}
                    umidadeMinima={zona?.min_umidade}
                    umidadeMaxima={zona?.max_umidade}
                />

                <CardBomba
                    bombaLigada={dadosZona?.bomba_ativa}
                />

                <CardUltimaIrrigacao
                    ultimaIrrigacao={zona?.ultimaIrrigacao}
                />

                <CardModoIrrigacao />
            </section>

            <section className="linha-inferior">

                <div className="coluna-esquerda">
                    <GraficoUmidade
                        dados={dadosZona?.historico_umidade || []}
                    />
                </div>

                <div className="coluna-direita">

                    <div className="painel-alertas">

                        <PainelAlertas
                            alertas={zona?.alertas || []}
                        />
                    </div>
                    
                </div>
            

            </section>

        </main>

    );

}

export default PainelLateral;