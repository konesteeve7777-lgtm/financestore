import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function Chart({ data }) {

    if (!data) return <p>Chargement...</p>;

    const chartData = [
        { name: "Revenus", value: data.total_income },
        { name: "Dépenses", value: data.total_expense },
        { name: "Bénéfice", value: data.balance }
    ];

    const COLORS = ["#00C49F", "#FF4C4C", "#0088FE"];

    return (
        <div>
            <h2>📊 Statistiques</h2>

            <PieChart width={400} height={300}>
                <Pie data={chartData} dataKey="value" outerRadius={100}>
                    {chartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}

export default Chart;