import React from "react";
import SearchIcon from '@material-ui/icons/Search';
import TransactionList from "../components/TransactionList";
import '../App.css';

function Transactions() {
        return (
            <div className="Transactions">
            <div className="TransactionsTitle">
                <h1 className="TransactionsText">Transactions </h1>
                <SearchIcon className="SearchTransactions" />
                </div>
                <TransactionList />
            </div>
        );
}

export default Transactions;