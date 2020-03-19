import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import { Divider } from "@material-ui/core";
import TransactionList from "../components/TransactionList";
import "../App.css";

function Transactions() {
  return (
    <div className="Transactions">
      <div className="TransactionsTitle">
        <h1 className="CardTitle">Transactions </h1>
        <SearchIcon className="SearchTransactions" />
      </div>
      <Divider />
      <TransactionList />
    </div>
  );
}

export default Transactions;
