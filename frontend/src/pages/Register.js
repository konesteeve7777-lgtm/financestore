import React, { useState } from "react";
import axios from "axios";

function Register({ setAuth }) {
    const [form, setForm] = useState({ username: "", password: "" });

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("https://financestore-backend.onrender.com/api/register/", form)
            .then(res => {
                localStorage.setItem("token", res.data.token);
                setAuth(true);
            })
            .catch(() => alert("Erreur inscription"));
    };

    return (
        <div className="card">
            <h2>📝 Inscription</h2>

            <form onSubmit={handleSubmit}>
                <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
                <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="submit">S'inscrire</button>
            </form>
        </div>
    );
}

export default Register;