import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Debts from "./pages/Debts";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {

    // 🔐 AUTH STATE
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

    // 🆕 Vérifier token au chargement
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []);

    // 🚪 LOGOUT
    const logout = () => {
        localStorage.removeItem("token");
        setIsAuth(false);
    };

    return (
        <Router>
            <div className="container">

                {/* 🧭 NAVBAR */}
                <div className="navbar">
                    <h1>📊 StoreFinance</h1>

                    <div>
                        {isAuth ? (
                            <>
                                <Link to="/">Dashboard</Link>
                                <Link to="/transactions">Transactions</Link>
                                <Link to="/debts">Dettes</Link>

                                <button onClick={logout} style={{ marginLeft: "10px" }}>
                                    🚪 Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/">Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </div>

                {/* 📄 ROUTES */}
                <Routes>

                    {!isAuth ? (
                        <>
                            <Route path="/" element={<Login setAuth={setIsAuth} />} />
                            <Route path="/register" element={<Register setAuth={setIsAuth} />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/debts" element={<Debts />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    )}

                </Routes>

            </div>
        </Router>
    );
}

export default App;