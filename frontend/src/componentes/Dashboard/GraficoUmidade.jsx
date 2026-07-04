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

                    />

                </LineChart>

            </ResponsiveContainer>

        </section>

    );

}

export default GraficoUmidade;