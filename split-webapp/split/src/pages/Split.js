import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

import { v4 as uuidv4 } from "uuid";

import EditableBillHeader from "../components/EditableBillHeader";
import EditableBillPeopleList from "../components/EditableBillPeopleList";

import styles from "./Split.module.css";

const createBill = data => {
  fetch("/api/bill_exec/create_bill", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      return res;
    })
    .catch(err => console.log(err));
};

class Split extends Component {
  constructor(props) {
    super(props);

    const firstRowId = uuidv4();

    this.state = {
      transaction: {
        title: "",
        users: {
          allIds: [firstRowId],
          byId: {
            [firstRowId]: { name: "" }
          }
        },
        cost: 0,
        payed: null
      }
    };
  }

  addUser = () => {
    const { transaction } = this.state;

    const newId = uuidv4();

    this.setState({
      transaction: {
        ...transaction,
        users: {
          allIds: [...transaction.users.allIds, newId],
          byId: {
            ...transaction.users.byId,
            [newId]: {
              name: ""
            }
          }
        }
      }
    });
  };

  handleNameChange = (userId, newName) => {
    const { transaction } = this.state;

    this.setState({
      transaction: {
        ...transaction,
        users: {
          ...transaction.users,
          byId: {
            ...transaction.users.byId,
            [userId]: {
              ...transaction.users.byId[userId],
              name: newName
            }
          }
        }
      }
    });
  };

  handlePayeeChange = userId => {
    const { transaction } = this.state;

    this.setState({
      transaction: { ...transaction, payed: userId }
    });
  };

  handleTitleChange = event => {
    const { transaction } = this.state;
    const title = event.target.value;

    this.setState({
      transaction: { ...transaction, title }
    });
  };

  handleTotalChange = (event, cost) => {
    const { transaction } = this.state;

    this.setState({
      transaction: { ...transaction, cost }
    });
  };

  split = () => {
    const { transaction } = this.state;
    const { history } = this.props;
    const { users, cost, title } = transaction;
    const perPersonCost = cost / users.allIds.length;

    const paymentArray = [];

    if (!title) {
      alert("Please enter a title description for this bill.");
      return;
    }
    if (!cost) {
      alert("Please enter an amount for this bill.");
      return;
    }
    if (transaction.users.allIds.length < 2) {
      alert(
        "There is not enough people to split a bill. Please make sure at least 2 people are on the list."
      );
      return;
    }
    if (!transaction.payed) {
      alert("Please choose a payee for this bill.");
      return;
    }

    const uniqueNameSet = new Set();
    for (const userId of users.allIds) {
      const name = users.byId[userId].name;
      if (!name) {
        alert("Please enter a name for each person");
        return;
      }
      if (uniqueNameSet.has(name)) {
        alert("Please enter a different name for each person");
        return;
      }
      uniqueNameSet.add(name);
    }

    for (const userId of users.allIds) {
      if (userId !== transaction.payed) {
        paymentArray.push({
          person: users.byId[userId].name,
          amount: perPersonCost
        });
      }
    }

    const bill = {
      title,
      payer: transaction.users.byId[transaction.payed].name,
      total: cost,
      outstanding_payments: paymentArray
    };

    createBill(bill);

    history.push("/home/transactions");
  };

  render() {
    const { transaction } = this.state;

    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <EditableBillHeader
            title={transaction.title}
            cost={transaction.cost}
            onTitleChange={this.handleTitleChange}
            onCostChange={this.handleTotalChange}
          />

          <EditableBillPeopleList
            people={transaction.users}
            paidPersonId={transaction.payed}
            onPayeeChange={this.handlePayeeChange}
            onNameChange={this.handleNameChange}
          />

          <Button onClick={this.addUser} fullWidth startIcon={<AddIcon />}>
            Add Person
          </Button>
        </div>

        <Button variant="contained" fullWidth onClick={this.split}>
          Split This Bill
        </Button>
      </div>
    );
  }
}

Split.propTypes = {
  history: PropTypes.node.isRequired
};

export default Split;
