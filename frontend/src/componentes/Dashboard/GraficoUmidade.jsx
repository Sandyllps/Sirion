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

import "./../../telas/TelaPrincipal/dashboard.css";

function GraficoUmidade({ dados }) {

    return (

        <section className="grafico-umidade">

            <h3>Histórico de Umidade</h3>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <LineChart
                    data={dados}
                >

                    <CartesianGrid strokeDasharray="3 3"/>

                    <XAxis dataKey="hora"/>

                    <YAxis
                        domain={[0,100]}
                    />

                    <Tooltip/>

                    <Line

                        type="monotone"

                        dataKey="umidade"

                        stroke="#2FA8E0"

                        strokeWidth={2.5}

                        dot={{ r: 3, fill: "#2FA8E0", stroke: "#121D31" }}

                        activeDot={{ r: 5 }}

                    />

                </LineChart>

            </ResponsiveContainer>

        </section>

    );

}

export default GraficoUmidade;