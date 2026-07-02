import "./painelLateral.css";
import CardUmidade from "../Dashboard/CardUmidade";
import CardBomba from "../Dashboard/CardBomba";
import CardVolume from "../Dashboard/CardVolume";
import CardModoIrrigacao from "../Dashboard/CardModoIrrigacao";
import CardUltimaIrrigacao from "../Dashboard/CardUltimaIrrigacao";

function PainelLateral() {

    return (

        <main className="painel-dashboard">

            <h2>Dashboard</h2>

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
        
                <div className="bloco-dashboard">
                    Histórico
                </div>

                <div className="bloco-dashboard">
                    Alertas
                </div>

            </section>

        </main>

    );

}

export default PainelLateral;