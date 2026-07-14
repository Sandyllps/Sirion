import { useState } from "react";
import { registrarIrrigacaoManual } from "../../api";

import "./cards.css";

function CardUltimaIrrigacao({
    idZona,
    idUsuario,
    ultimaIrrigacao,
    aoAtualizar
}) {
    const [carregando, setCarregando] =
        useState(false);

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

    async function registrarAgora() {
        if (!idZona || !idUsuario || carregando) {
            return;
        }

        try {
            setCarregando(true);

            await registrarIrrigacaoManual(
                idZona,
                idUsuario
            );

            if (aoAtualizar) {
                await aoAtualizar();
            }
        } catch (erro) {
            console.error(
                "Erro ao registrar irrigação:",
                erro
            );

            alert(
                "Não foi possível registrar a irrigação."
            );
        } finally {
            setCarregando(false);
        }
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

            <p>Registro manual da irrigação</p>

            <button
                type="button"
                className="botao-modo"
                onClick={registrarAgora}
                disabled={
                    !idZona ||
                    !idUsuario ||
                    carregando
                }
            >
                {carregando
                    ? "Registrando..."
                    : "Registrar agora"}
            </button>
        </section>
    );
}

export default CardUltimaIrrigacao;