import React from "react";
import AddTransaction from "../AddTransaction";
import TransactionList from "../TransactionList";

function Transactions() {
    return (
        <>
            <h2>📋 Transactions</h2>

            <div className="card">
                <AddTransaction />
            </div>

            <div className="card">
                <TransactionList />
            </div>
        </>
    );
}

export default Transactions;