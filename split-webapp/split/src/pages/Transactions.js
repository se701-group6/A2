import React, { Component } from "react";
import { Divider } from "@material-ui/core";
import TransactionList from "../components/TransactionList";
import TransactionFilterButton from "../components/TransactionFilterButton";
import "../App.css";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.changeFilters = this.changeFilters.bind(this);
    this.state = {
      sortField: "",
      sortOrder: "",
      isPaid: "",
      payer: "",
      payee: ""
    };
  }

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
      <div className="Transactions">
        <div className="TransactionsTitle">
          <h1 className="TransactionsText">Transactions </h1>
          <TransactionFilterButton
            className="SearchTransactions"
            changeFilters={this.changeFilters}
          />
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
