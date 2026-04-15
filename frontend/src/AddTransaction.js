
import React, { useState } from "react";
import axios from "axios";

function AddTransaction() {
    const [form, setForm] = useState({
        amount: "",
        type: "income",
        category: "phone_sale",
        description: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token"); // 🔐 Récupération du token

        if (!token) {
            alert("❌ Vous devez être connecté pour ajouter une transaction");
            return;
        }

        axios.post("https://financestore-backend.onrender.com/api/transactions/", form, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
            .then(() => {
                alert("✅ Transaction ajoutée !");
                window.location.reload();
            })
            .catch(err => {
                console.log("ERROR:", err.response); // 🔍 Debug
                alert("❌ Erreur lors de l'ajout");
            });
    };

    return (
        <div>
            <h2>➕ Ajouter Transaction</h2>

            <form onSubmit={handleSubmit} className="form">
                <input
                    type="number"
                    name="amount"
                    placeholder="Montant"
                    onChange={handleChange}
                    required
                />

                <select name="type" onChange={handleChange} value={form.type}>
                    <option value="income">Revenu</option>
                    <option value="expense">Dépense</option>
                </select>

                <select name="category" onChange={handleChange} value={form.category}>
                    <option value="phone_sale">Vente téléphone</option>
                    <option value="accessory">Accessoire</option>
                    <option value="repair">Réparation</option>
                </select>

                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    value={form.description}
                />

                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
}

export default AddTransaction;