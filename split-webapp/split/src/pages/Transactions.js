import React from "react";
import TollIcon from "@material-ui/icons/Toll";
import { Divider } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import TransactionList from "../components/TransactionList";
import "../App.css";

function Transactions() {
  return (
    <div className="Transactions">
      <div className="TransactionsTitle">
        <h1 className="TransactionsText">Transactions </h1>
        <TollIcon className="SearchTransactions" />
      </div>
      <Divider />
      <TransactionList />
      <Pagination count={10} color="primary" />
    </div>
  );
}

export default Transactions;
