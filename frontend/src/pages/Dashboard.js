import React, { useEffect, useState } from "react";
import axios from "axios";
import AddTransaction from "../AddTransaction";
import TransactionList from "../TransactionList";
import Chart from "../Chart";
import DebtList from "../DebtList";

function Dashboard() {
    const [data, setData] = useState(null);

    const fetchDashboard = () => {

        // 🔐 récupérer token
        const token = localStorage.getItem("token");

        axios.get("https://financestore-backend.onrender.com/api/dashboard/", {
            headers: {
                Authorization: `Token ${token}`
            }
        })
            .then(res => setData(res.data))
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const refreshAll = () => {
        fetchDashboard();
    };

    return (
        <>
            <h2>🏠 Dashboard</h2>

            {/* ➕ AJOUT */}
            <div className="card">
                <AddTransaction refresh={refreshAll} />
            </div>

            {/* 📊 STATS */}
            <div className="card">
                {data ? (
                    <div className="stats">
                        <p>💰 Revenus : {data.total_income}</p>
                        <p>💸 Dépenses : {data.total_expense}</p>

                        <p style={{ color: data.balance >= 0 ? "green" : "red" }}>
                            📈 Bénéfice : {data.balance}
                        </p>

                        <p style={{ color: "orange" }}>
                            💳 Dettes : {data.total_debt}
                        </p>
                    </div>
                ) : (
                    <p>Chargement...</p>
                )}
            </div>

            {/* 📅 JOURNALIER */}
            <div className="card">
                <h2>📅 Rapport Journalier</h2>

                {data ? (
                    <div className="stats">
                        <p>💰 Revenus du jour : {data.daily_income}</p>
                        <p>💸 Dépenses du jour : {data.daily_expense}</p>
                        <p style={{ color: data.daily_balance >= 0 ? "green" : "red" }}>
                            📊 Résultat : {data.daily_balance}
                        </p>
                    </div>
                ) : (
                    <p>Chargement...</p>
                )}
            </div>

            {/* 📊 MENSUEL */}
            <div className="card">
                <h2>📊 Rapport Mensuel</h2>

                {data ? (
                    <div className="stats">
                        <p>💰 Revenus : {data.monthly_income}</p>
                        <p>💸 Dépenses : {data.monthly_expense}</p>

                        <p style={{ color: data.monthly_balance >= 0 ? "green" : "red" }}>
                            📈 Résultat : {data.monthly_balance}
                        </p>
                    </div>
                ) : (
                    <p>Chargement...</p>
                )}
            </div>

            {/* 🔔 ALERTES */}
            <div className="card">
                <h2>🔔 Alertes</h2>

                {data?.alerts?.length > 0 ? (
                    data.alerts.map((alert, index) => (
                        <p key={index} className="alert">{alert}</p>
                    ))
                ) : (
                    <p>Aucune alerte</p>
                )}
            </div>

            {/* 📊 GRAPH */}
            <div className="card">
                <Chart data={data} />
            </div>
        </>
    );
}

export default Dashboard;