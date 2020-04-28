import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

import { Flipper, Flipped } from "react-flip-toolkit";
import { v4 as uuidv4 } from "uuid";

import Header from "./Header";
import PeopleList from "./PeopleList";

import styles from "./index.module.css";

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

const editBill = data => {
  fetch("/api/bill_exec/edit_bill", {
    method: "PUT",
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

const addUserTo = (transaction, insertionIndex) => {
  const newId = uuidv4();
  return {
    ...transaction,
    users: {
      allIds: [
        ...transaction.users.allIds.slice(0, insertionIndex),
        newId,
        ...transaction.users.allIds.slice(insertionIndex)
      ],
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
  editBill = this.props.location.bill; // only defined during bill edit

  constructor(props) {
    super(props);

    const initialUsers = {
      allIds: [],
      byId: {}
    };

    // Populate fields with values of existing bill
    let users = [];
    let cost = 0;
    let title = "";
    if (this.editBill) {
      users = this.editBill.payments.map(person => person.from);
      users.unshift(this.editBill.payments[0].to); 
      cost = this.editBill.total;
      title = this.editBill.title;
    }

    const userLength = users.length > 0 ? users.length : MINIMUM_PEOPLE_COUNT;
    for (let i = 0; i < userLength; i += 1) {
      const userId = uuidv4();
      initialUsers.allIds.push(userId);
      initialUsers.byId[userId] = { name: users.shift() || "" };
    }
    const payee = this.editBill ? initialUsers.allIds[0] : null;

    this.state = {
      transaction: {
        title: title,
        users: initialUsers,
        cost: cost,
        payed: payee
      },

      // Do not start validating until after the first submission attempt.
      showErrors: false,

      // Delay submission by 200ms to give user a visual response.
      // During this fake "processing" time, this flag is set.
      submitAcknowledged: false
    };
  }

  getNormalizedTransaction() {
    const { transaction } = this.state;

    const normalizedUsersById = {};

    for (const userId of transaction.users.allIds) {
      normalizedUsersById[userId] = {
        ...transaction.users.byId[userId],
        name: transaction.users.byId[userId].name.trim()
      };
    }

    return {
      ...transaction,
      title: transaction.title.trim(),
      users: {
        ...transaction.users,
        byId: normalizedUsersById
      },
    };
  }

  addUser = () => {
    const { transaction } = this.state;

    this.setState({
      transaction: addUserTo(transaction, transaction.users.allIds.length)
    });
  };

  removeUser = userId => {
    const { transaction } = this.state;

    const deleteIndex = transaction.users.allIds.indexOf(userId);

    const updatedTransaction = {
      ...transaction,
      users: {
        ...transaction.users,
        allIds: transaction.users.allIds.filter(id => id !== userId)
      }
    };

    delete updatedTransaction.users.byId[userId];

    // Payed reference is no longer valid.
    if (transaction.payed === userId) {
      updatedTransaction.payed = null;
    }

    if (updatedTransaction.users.allIds.length >= MINIMUM_PEOPLE_COUNT) {
      this.setState({
        transaction: updatedTransaction
      });
    } else {
      this.setState({
        transaction: addUserTo(updatedTransaction, deleteIndex)
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

  handleInputBlur = event => {
    // Workaround for Firefox:
    //
    // When text-overflow: ellipsis is set in Chrome, Chrome
    // rewinds the input to the start when the input is blurred,
    // so that the ellipsis can be shown.
    // Firefox does not rewind to the start on blur, and so no
    // ellipsis is shown even though the value is overflowing.
    // Firefox supports two-value text-overflow syntax to
    // work around this, but Chrome and other browsers don't support
    // it yet.
    //
    // The solution is to emulate Chrome's rewinding behaviour on
    // all browsers and use the single value syntax for text-overflow.
    if (event.target.setSelectionRange && event.target.selectionStart > 0) {
      event.target.setSelectionRange(0, 0);

      // Workaround for Safari:
      // In Safari, setSelectionRange puts focus back into the input,
      // causing the focus system to become 'stuck' on the first
      // textbox the user clicks on.
      // De-focus from the text-box once more.
      // Be careful with infinite recursion here.
      event.target.blur();
    }

    this.setState({
      transaction: this.getNormalizedTransaction()
    });
  };

  split = async (billAction) => {
    const transaction = this.getNormalizedTransaction();
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
    if (this.editBill) {
      bill.bill_id = this.editBill.bill_id;
    }

    billAction(bill);

    history.push("/home/transactions");
  };

  validate() {
    const transaction = this.getNormalizedTransaction();

    const errors = {};

    if (transaction.cost === 0) {
      errors.cost = "Cannot split a zero amount";
      errors.hasError = true;
    }

    if (transaction.cost < 0) {
      errors.cost = "Cannot split a negative amount";
      errors.hasError = true;
    }

    if (!transaction.users.byId[transaction.payed]) {
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

    let submitButtonText = this.editBill ? "Update This Bill" : "Split This Bill";
    if (submissionFailed) {
      submitButtonText = "We found some things to fix";
    } else if (submitAcknowledged) {
      submitButtonText = this.editBill ? "Updating..." : "Splitting...";
    }

    return (
      <Flipper flipKey={flipKey}>
        <div className={styles.page}>
          <Flipped flipId="Split-card">
            <div className={styles.card}>
              <Flipped inverseFlipId="Split-card">
                <div>
                  <Header
                    className={styles.header}
                    title={transaction.title}
                    titlePlaceholder={DEFAULT_BILL_TITLE}
                    cost={transaction.cost}
                    costError={errors.cost}
                    showErrors={showErrors}
                    onTitleChange={this.handleTitleChange}
                    onCostChange={this.handleTotalChange}
                    onInputBlur={this.handleInputBlur}
                  />

                  <PeopleList
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
                    onInputBlur={this.handleInputBlur}
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
              onClick={() => this.editBill ? this.split(editBill) : this.split(createBill)}
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
