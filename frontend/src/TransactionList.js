import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function TransactionList() {
    const [transactions, setTransactions] = useState([]);
    const [editData, setEditData] = useState(null);

    const [filterType, setFilterType] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");
    const [search, setSearch] = useState("");

    const fetchTransactions = () => {
        const token = localStorage.getItem("token"); // 🔐 Récupération du token

        if (!token) {
            alert("❌ Vous devez être connecté");
            return;
        }

        axios.get("https://financestore-backend.onrender.com/api/transactions/", {
            headers: { Authorization: `Token ${token}` }
        })
            .then(res => {
                console.log("DATA:", res.data); // 🔍 DEBUG
                setTransactions(res.data);
            })
            .catch(err => {
                console.log("ERROR:", err.response);
            });
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const deleteTransaction = (id) => {
        if (window.confirm("Supprimer ?")) {
            const token = localStorage.getItem("token");

            axios.delete(`http://127.0.0.1:8000/api/transactions/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            })
                .then(() => fetchTransactions())
                .catch(err => console.log(err));
        }
    };

    const updateTransaction = (id) => {
        const token = localStorage.getItem("token");

        axios.put(`http://127.0.0.1:8000/api/transactions/${id}/`, editData, {
            headers: { Authorization: `Token ${token}` }
        })
            .then(() => {
                setEditData(null);
                fetchTransactions();
            })
            .catch(err => console.log(err));
    };

    const filteredTransactions = transactions.filter(t => {
        return (
            (filterType === "all" || t.type === filterType) &&
            (filterCategory === "all" || t.category === filterCategory) &&
            (
                t.description?.toLowerCase().includes(search.toLowerCase()) ||
                t.type?.toLowerCase().includes(search.toLowerCase()) ||
                t.category?.toLowerCase().includes(search.toLowerCase())
            )
        );
    });

    return (
        <div className="card">
            <h2>📋 Liste des transactions</h2>

            <input
                type="text"
                placeholder="🔍 Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    padding: "8px",
                    width: "200px",
                    marginBottom: "10px",
                    marginRight: "10px"
                }}
            />

            <div style={{ marginBottom: "15px" }}>
                <select onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">Tous</option>
                    <option value="income">Revenus</option>
                    <option value="expense">Dépenses</option>
                </select>

                <select
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ marginLeft: "10px" }}
                >
                    <option value="all">Toutes catégories</option>
                    <option value="phone_sale">Téléphones</option>
                    <option value="accessory">Accessoires</option>
                    <option value="repair">Réparations</option>
                    <option value="other">Autre</option>
                </select>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Montant</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredTransactions.map((t, index) => (
                        <tr key={t.id}>
                            <td>{index + 1}</td>

                            <td>
                                {editData?.id === t.id ? (
                                    <input
                                        value={editData.type}
                                        onChange={e =>
                                            setEditData({ ...editData, type: e.target.value })
                                        }
                                    />
                                ) : t.type}
                            </td>

                            <td>
                                {editData?.id === t.id ? (
                                    <input
                                        type="number"
                                        value={editData.amount}
                                        onChange={e =>
                                            setEditData({ ...editData, amount: e.target.value })
                                        }
                                    />
                                ) : t.amount}
                            </td>

                            <td>
                                {editData?.id === t.id ? (
                                    <input
                                        value={editData.description}
                                        onChange={e =>
                                            setEditData({ ...editData, description: e.target.value })
                                        }
                                    />
                                ) : t.description}
                            </td>

                            <td>{t.date}</td>

                            <td>
                                {editData?.id === t.id ? (
                                    <>
                                        <button onClick={() => updateTransaction(t.id)}>💾</button>
                                        <button onClick={() => setEditData(null)}>❌</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setEditData(t)}>✏️</button>
                                        <button onClick={() => deleteTransaction(t.id)}>🗑️</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionList;