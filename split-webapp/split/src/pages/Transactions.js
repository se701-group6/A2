import React from "react";
import TollIcon from "@material-ui/icons/Toll";
import { Divider } from "@material-ui/core";
import TransactionList from "../components/TransactionList";
import styles from "./Transactions.module.css";

function Transactions() {
  return (
    <div className={styles.transactions}>
      <div className={styles.transactionsTitle}>
        <h1>Transactions </h1>
        <TollIcon className={styles.searchTransactions} />
      </div>
      <Divider />
      <TransactionList />
    </div>
  );
}

export default Transactions;
