import "./cards.css";
import "./graficoUmidade.css";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function TooltipUmidade({ active, payload }) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const registro = payload[0].payload;

    return (
        <div className="tooltip-umidade">
            <strong>{registro.dataCompleta}</strong>

            <span>
                Umidade: {registro.umidade}%
            </span>
        </div>
    );
}

function GraficoUmidade({ dados = [] }) {
    const dadosFormatados = dados
        .map((registro) => {
            const umidade = Number(registro.umidade);

            const data = registro.data_hora
                ? new Date(registro.data_hora)
                : null;

            if (
                !Number.isFinite(umidade) ||
                !data ||
                Number.isNaN(data.getTime())
            ) {
                return null;
            }

            return {
                ...registro,

                umidade,

                hora: data.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }),

                dataCompleta: data.toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                })
            };
        })
        .filter(Boolean);

    return (
        <section className="grafico-umidade">
            <h3>Histórico de Umidade</h3>

            {dadosFormatados.length === 0 ? (
                <p>Nenhuma leitura de umidade registrada.</p>
            ) : (
                <ResponsiveContainer
                    width="100%"
                    height={300}
                >
                    <LineChart data={dadosFormatados}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="hora"
                            minTickGap={28}
                            interval="preserveStartEnd"
                        />

                        <YAxis domain={[0, 100]} />

                        <Tooltip
                            content={<TooltipUmidade />}
                        />

                        <Line
                            type="linear"
                            dataKey="umidade"
                            stroke="#2FA8E0"
                            strokeWidth={2.5}
                            dot={{
                                r: 3,
                                fill: "#2FA8E0",
                                stroke: "#121D31"
                            }}
                            activeDot={{ r: 5 }}
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </section>
    );
}

export default GraficoUmidade;