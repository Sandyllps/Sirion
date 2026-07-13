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

function GraficoUmidade({ dados = [] }) {
    const dadosFormatados = dados.map((registro) => ({
        ...registro,
        hora: registro.data_hora
            ? new Date(registro.data_hora).toLocaleTimeString(
                "pt-BR",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )
            : "--"
    }));

    return (
        <section className="grafico-umidade">
            <h3>Histórico de Umidade</h3>

            {dadosFormatados.length === 0 ? (
                <p>
                    Nenhuma leitura de umidade registrada.
                </p>
            ) : (
                <ResponsiveContainer
                    width="100%"
                    height={300}
                >
                    <LineChart data={dadosFormatados}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="hora" />

                        <YAxis domain={[0, 100]} />

                        <Tooltip
                            formatter={(valor) => [
                                `${valor}%`,
                                "Umidade"
                            ]}
                        />

                        <Line
                            type="monotone"
                            dataKey="umidade"
                            stroke="#2FA8E0"
                            strokeWidth={2.5}
                            dot={{
                                r: 3,
                                fill: "#2FA8E0",
                                stroke: "#121D31"
                            }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </section>
    );
}

export default GraficoUmidade;