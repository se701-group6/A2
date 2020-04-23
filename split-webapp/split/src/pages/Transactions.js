import React from "react";
import { Divider } from "@material-ui/core";
import TransactionList from "../components/TransactionList";
import TransactionFilterButton from "../components/TransactionFilterButton";
import "../App.css";

function Transactions() {
  return (
    <div className="Transactions">
      <div className="TransactionsTitle">
        <h1 className="TransactionsText">Transactions </h1>
        <TransactionFilterButton className="SearchTransactions" />
      </div>
      <Divider />
      <TransactionList />
    </div>
  );
}

export default Transactions;
