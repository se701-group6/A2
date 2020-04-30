import React, { Component } from "react";
import { Divider } from "@material-ui/core";
import TransactionList from "../components/TransactionList";
import styles from "./Transactions.module.css";
import TransactionFilterButton from "../components/TransactionFilterButton";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.changeFilters = this.changeFilters.bind(this);
    this.state = {
      sortField: "created_time",
      sortOrder: "desc",
      isPaid: "either",
      payer: "",
      payee: ""
    };
  }

  displayFilters = () => {
    const { sortField, sortOrder, isPaid, payer, payee } = this.state;
    let sortFieldText = "";
    let isPaidText = "";
    if (sortField === "created_time") {
      sortFieldText = "Created Time";
    } else if (sortField === "amount") {
      sortFieldText = "Total Amount";
    } else {
      sortFieldText = "Bill Name";
    }

    if (isPaid === "either") {
      isPaidText = "Either";
    } else if (isPaid === "paid") {
      isPaidText = "Paid";
    } else {
      isPaidText = "Unpaid";
    }

    return (
      <div>
        <p>
          <b>Sorting By:</b> {sortFieldText},{" "}
          {sortOrder === "desc" ? "Descending" : "Ascending"}, <b>Paid:</b>{" "}
          {isPaidText}, <b>Payee:</b> {payee === "" ? "Any" : payee},{" "}
          <b>Payee:</b> {payer === "" ? "Any" : payer}
        </p>
      </div>
    );
  };

  changeFilters(
    sort_field = "",
    sort_order = "",
    is_paid = "",
    payer = "",
    payee = ""
  ) {
    this.setState({
      sortField: sort_field,
      sortOrder: sort_order,
      isPaid: is_paid,
      payer,
      payee
    });
  }

  render() {
    const { sortField, sortOrder, isPaid, payer, payee } = this.state;

    return (
      <div className={styles.transactions}>
        <div className={styles.transactionsTitle}>
          <h1 className={styles.transactionsText}>Transactions </h1>
          <TransactionFilterButton changeFilters={this.changeFilters} />
        </div>
        <div className={styles.displayFilters}>
          <h5>Current Filters:</h5> {this.displayFilters()}
        </div>
        <Divider />
        <TransactionList
          sortField={sortField}
          sortOrder={sortOrder}
          isPaid={isPaid}
          payer={payer}
          payee={payee}
        />
      </div>
    );
  }
}

export default Transactions;
