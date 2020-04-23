import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

import { Flipper, Flipped } from "react-flip-toolkit";
import { v4 as uuidv4 } from "uuid";

import EditableBillHeader from "../components/EditableBillHeader";
import EditableBillPeopleList from "../components/EditableBillPeopleList";

import styles from "./Split.module.css";

const DEFAULT_BILL_TITLE = "Untitled Bill";
const MINIMUM_PEOPLE_COUNT = 2;

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

const addUserTo = transaction => {
  const newId = uuidv4();
  return {
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
  };
};

class Split extends Component {
  constructor(props) {
    super(props);

    const initialUsers = {
      allIds: [],
      byId: {}
    };

    for (let i = 0; i < MINIMUM_PEOPLE_COUNT; i += 1) {
      const userId = uuidv4();
      initialUsers.allIds.push(userId);
      initialUsers.byId[userId] = { name: "" };
    }

    this.state = {
      transaction: {
        title: "",
        users: initialUsers,
        cost: 0,
        payed: null
      },

      // Do not start validating until after the first submission attempt.
      showErrors: false,

      // Delay submission by 200ms to give user a visual response.
      // During this fake "processing" time, this flag is set.
      submitAcknowledged: false
    };
  }

  addUser = () => {
    const { transaction } = this.state;

    this.setState({
      transaction: addUserTo(transaction)
    });
  };

  removeUser = userId => {
    const { transaction } = this.state;

    const updatedTransaction = {
      ...transaction,
      users: {
        ...transaction.users,
        allIds: transaction.users.allIds.filter(id => id !== userId)
      }
    };

    delete updatedTransaction.users.byId[userId];

    if (updatedTransaction.users.allIds.length >= MINIMUM_PEOPLE_COUNT) {
      this.setState({
        transaction: updatedTransaction
      });
    } else {
      this.setState({
        transaction: addUserTo(updatedTransaction)
      });
    }
  };

  handlePeopleSwapOrder = (oldIndex, newIndex) => {
    const { transaction } = this.state;

    const newOrder = transaction.users.allIds.slice();
    const item = newOrder.splice(oldIndex, 1)[0];
    newOrder.splice(newIndex, 0, item);

    this.setState({
      transaction: {
        ...transaction,
        users: {
          ...transaction.users,
          allIds: newOrder
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

  split = async () => {
    const { transaction } = this.state;
    const { history } = this.props;
    const { users, cost } = transaction;
    const perPersonCost = cost / users.allIds.length;
    const title = transaction.title || DEFAULT_BILL_TITLE;

    const paymentArray = [];

    // Show visual feedback that the user's intention of submitting
    // the form has been acknowledged.
    this.setState({
      showErrors: false,
      submitAcknowledged: true
    });
    await new Promise(resolve => setTimeout(resolve, 200));

    if (this.validate().hasError) {
      // Begin live-validations after first failed submission.
      this.setState({
        showErrors: true,
        submitAcknowledged: false
      });
      return;
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

  validate() {
    const { transaction } = this.state;

    const errors = {};

    if (transaction.cost === 0) {
      errors.cost = "Cannot split a zero amount";
      errors.hasError = true;
    }

    if (transaction.cost < 0) {
      errors.cost = "Cannot split a negative amount";
      errors.hasError = true;
    }

    if (!transaction.payed) {
      errors.payed = "Please choose a payee for this bill";
      errors.hasError = true;
    }

    errors.users = {};
    const uniqueNameSet = new Set();
    for (const userId of transaction.users.allIds) {
      const { name } = transaction.users.byId[userId];
      if (!name) {
        errors.users[userId] = "Please enter a name";
        errors.hasError = true;
      } else if (uniqueNameSet.has(name)) {
        errors.users[userId] = "Same name can’t appear twice";
        errors.hasError = true;
      }
      uniqueNameSet.add(name);
    }

    return errors;
  }

  render() {
    const { transaction, showErrors, submitAcknowledged } = this.state;
    const errors = this.validate();
    const submissionFailed = showErrors && errors.hasError;

    // We want the Flip toolkit to animate whenever the
    // list of people changes, either by deletion, addition,
    // or re-ordering.
    const flipKey = transaction.users.allIds.join(" ");

    let submitButtonText = "Split This Bill";
    if (submissionFailed) {
      submitButtonText = "We found some things to fix";
    } else if (submitAcknowledged) {
      submitButtonText = "Splitting...";
    }

    return (
      <Flipper flipKey={flipKey}>
        <div className={styles.page}>
          <Flipped flipId="Split-card">
            <div className={styles.card}>
              <Flipped inverseFlipId="Split-card">
                <div>
                  <EditableBillHeader
                    className={styles.header}
                    title={transaction.title}
                    titlePlaceholder={DEFAULT_BILL_TITLE}
                    cost={transaction.cost}
                    costError={errors.cost}
                    showErrors={showErrors}
                    onTitleChange={this.handleTitleChange}
                    onCostChange={this.handleTotalChange}
                  />

                  <EditableBillPeopleList
                    className={styles.peopleList}
                    people={transaction.users}
                    paidPersonId={transaction.payed}
                    peopleError={errors.users}
                    paidError={errors.payed}
                    showErrors={showErrors}
                    onPayeeChange={this.handlePayeeChange}
                    onNameChange={this.handleNameChange}
                    onRemovePerson={this.removeUser}
                    onSwapOrder={this.handlePeopleSwapOrder}
                  />

                  <Flipped flipId="Split-addPerson" translation>
                    <Button
                      onClick={this.addUser}
                      fullWidth
                      className={styles.addPersonButton}
                      startIcon={<AddIcon />}
                    >
                      Add Person
                    </Button>
                  </Flipped>
                </div>
              </Flipped>
            </div>
          </Flipped>

          <Flipped flipId="Split-splitButton" translation>
            <Button
              className={[
                styles.splitButton,
                submissionFailed ? styles.splitButtonError : "",
                submitAcknowledged ? styles.splitButtonProgress : ""
              ].join(" ")}
              variant="contained"
              fullWidth
              disabled={submitAcknowledged}
              onClick={this.split}
            >
              {submitButtonText}
            </Button>
          </Flipped>
        </div>
      </Flipper>
    );
  }
}

Split.propTypes = {
  history: PropTypes.node.isRequired
};

export default Split;
