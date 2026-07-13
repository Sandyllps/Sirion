import { useEffect, useState } from "react";
import "./cards.css";

function CardUltimaIrrigacao({ idZona }) {
    const [ultimaIrrigacao, setUltimaIrrigacao] =
        useState(null);

    const chaveArmazenamento = idZona
        ? `ultima_irrigacao_${idZona}`
        : null;

    useEffect(() => {
        if (!chaveArmazenamento) {
            setUltimaIrrigacao(null);
            return;
        }

        const irrigacaoSalva = localStorage.getItem(
            chaveArmazenamento
        );

        setUltimaIrrigacao(irrigacaoSalva);
    }, [chaveArmazenamento]);

    function registrarIrrigacao() {
        if (!chaveArmazenamento) {
            return;
        }

        const dataAtual = new Date().toISOString();

        localStorage.setItem(
            chaveArmazenamento,
            dataAtual
        );

        setUltimaIrrigacao(dataAtual);
    }

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
            minute: "2-digit"
        });
    }

    return (
        <section className="cartao-dashboard card-ambar">
            <div className="cartao-cabecalho">
                <span className="cartao-icone">🕒</span>
                <h3>Última Irrigação</h3>
            </div>

            <h2>
                {formatarData(ultimaIrrigacao)}
            </h2>

            <p>Registro manual da irrigação</p>

            <button
                type="button"
                className="botao-modo"
                onClick={registrarIrrigacao}
                disabled={!idZona}
            >
                Registrar agora
            </button>
        </section>
    );
}

export default CardUltimaIrrigacao;