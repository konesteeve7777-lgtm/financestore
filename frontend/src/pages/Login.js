import React, { useState } from "react";
import axios from "axios";

function Login({ setAuth }) {
    const [form, setForm] = useState({ username: "", password: "" });

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("https://financestore-backend.onrender.com/api/login/", form)
            .then(res => {
                // 🔐 stocker token
                localStorage.setItem("token", res.data.token);

                // 🔥 activer auth
                setAuth(true);

                // 🆕 redirection
                window.location.href = "/";
            })
            .catch(err => {
                console.log(err.response?.data); // 🧠 debug
                alert(err.response?.data?.error || "Erreur login");
            });
    };

    return (
        <div className="card">
            <h2>🔑 Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Username"
                    onChange={e => setForm({ ...form, username: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={e => setForm({ ...form, password: e.target.value })}
                />

                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
}

export default Login;