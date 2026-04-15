import React, { useEffect, useState } from "react";
import axios from "axios";

function DebtList() {
    const [debts, setDebts] = useState([]);
    const [form, setForm] = useState({ name: "", amount: "" });

    const fetchDebts = () => {
        const token = localStorage.getItem("token"); // 🔐 Récupération du token

        if (!token) {
            alert("❌ Vous devez être connecté");
            return;
        }

        axios.get("https://financestore-backend.onrender.com/api/debts/", {
            headers: { Authorization: `Token ${token}` }
        })
            .then(res => {
                console.log("DEBTS:", res.data); // 🔍 DEBUG
                setDebts(res.data);
            })
            .catch(err => {
                console.log("ERROR:", err.response);
            });
    };

    useEffect(() => {
        fetchDebts();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        axios.post("http://127.0.0.1:8000/api/debts/", form, {
            headers: { Authorization: `Token ${token}` }
        })
            .then(() => {
                setForm({ name: "", amount: "" });
                fetchDebts();
            })
            .catch(err => console.log(err));
    };

    const markPaid = (id) => {
        const token = localStorage.getItem("token");

        axios.patch(`http://127.0.0.1:8000/api/debts/${id}/`, { paid: true }, {
            headers: { Authorization: `Token ${token}` }
        })
            .then(() => fetchDebts())
            .catch(err => console.log(err));
    };

    const deleteDebt = (id) => {
        const token = localStorage.getItem("token");

        axios.delete(`http://127.0.0.1:8000/api/debts/${id}/`, {
            headers: { Authorization: `Token ${token}` }
        })
            .then(() => fetchDebts())
            .catch(err => console.log(err));
    };

    return (
        <div className="card">
            <h2>💳 Gestion des dettes</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Nom"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                />

                <input
                    type="number"
                    placeholder="Montant"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    required
                />

                <button type="submit">Ajouter</button>
            </form>

            <ul>
                {debts.map(d => (
                    <li key={d.id}>
                        {d.name} - {d.amount} FCFA

                        {d.paid ? (
                            <span style={{ color: "green" }}> ✔ Payée</span>
                        ) : (
                            <button onClick={() => markPaid(d.id)}>Payer</button>
                        )}

                        <button onClick={() => deleteDebt(d.id)}>🗑️</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DebtList;