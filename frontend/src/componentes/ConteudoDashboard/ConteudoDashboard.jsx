import "./conteudoDashboard.css";

import CardUmidade from "../Dashboard/CardUmidade";
import CardBomba from "../Dashboard/CardBomba";
import CardModoIrrigacao from "../Dashboard/CardModoIrrigacao";
import CardUltimaIrrigacao from "../Dashboard/CardUltimaIrrigacao";
import PainelAlertas from "../Dashboard/CardAlertas";
import GraficoUmidade from "../Dashboard/GraficoUmidade";

function PainelLateral({
    zona,
    dadosZona,
    aoEditarZona
}) {
    function obterTextoConexao() {
        if (!zona) {
            return "Nenhuma zona selecionada";
        }

        if (!dadosZona) {
            return "Carregando dados...";
        }

        if (dadosZona.status_conexao === "conectado") {
            return "ESP32 conectado";
        }

        if (dadosZona.status_conexao === "desconectado") {
            return "ESP32 desconectado";
        }

        return "ESP32 nunca conectado";
    }

    function obterClasseConexao() {
        if (!dadosZona) {
            return "status-carregando";
        }

        if (dadosZona.status_conexao === "conectado") {
            return "status-conectado";
        }

        if (dadosZona.status_conexao === "desconectado") {
            return "status-desconectado";
        }

        return "status-nunca-conectado";
    }

    function formatarUltimaAtualizacao() {
        if (!dadosZona?.ultima_atualizacao) {
            return "Nenhuma leitura recebida";
        }

        const data = new Date(
            dadosZona.ultima_atualizacao
        );

        if (Number.isNaN(data.getTime())) {
            return "Data indisponível";
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
        <main className="painel-dashboard">
            <section className="cabecalho-dashboard">
                <div>
                    <h2 className="titulo-zona">
                        {zona?.nome || "Selecione uma zona"}
                    </h2>

                    <div className="informacoes-conexao">
                        <span
                            className={`indicador-conexao ${obterClasseConexao()}`}
                        />

                        <span className="texto-conexao">
                            {obterTextoConexao()}
                        </span>

                        {zona && (
                            <span className="ultima-atualizacao">
                                Última leitura: {formatarUltimaAtualizacao()}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    className="botao-editar"
                    onClick={aoEditarZona}
                    disabled={!zona}
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
                    idZona={zona?._id || zona?.id}
                />

                <CardModoIrrigacao
                    idZona={zona?._id || zona?.id}
                />
            </section>

            <section className="linha-inferior">
                <div className="coluna-esquerda">
                    <GraficoUmidade
                        dados={
                            dadosZona?.historico_umidade || []
                        }
                    />
                </div>

                <div className="coluna-direita">
                    <div className="painel-alertas">
                        <PainelAlertas
                            alertas={
                                dadosZona?.alertas || []
                            }
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default PainelLateral;