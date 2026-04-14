import React from "react";
import DebtList from "../DebtList";

function Debts() {
    return (
        <>
            <h2>💳 Dettes</h2>

            <div className="card">
                <DebtList />
            </div>
        </>
    );
}

export default Debts;