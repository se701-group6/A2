import React, { Component } from "react";
import {
  Button,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  List,
  FormControlLabel,
  Radio,
  FormGroup,
  RadioGroup
} from "@material-ui/core";
import PropTypes from "prop-types";

class Split extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transaction: {
        title: "title",
        users: [],
        cost: 0,
        payed: ""
      }
    };
  }

  addUser() {
    const { transaction } = this.state;
    const name = document.getElementById("name").value;
    document.getElementById("name").value = "";

    if (name.length === 0) {
      alert("Please enter a valid non-empty name.");
      return;
    }
    if (transaction.users.includes(name)) {
      alert(
        "This person is already on the list. Please enter a different name."
      );
      return;
    }

    this.setState({
      transaction: {
        ...transaction,
        users: transaction.users.concat(name)
      }
    });
  }

  handleChange(name) {
    const { transaction } = this.state;

    this.setState({
      transaction: {
        ...transaction,
        payed: name
      }
    });
  }

  split() {
    const { transaction } = this.state;
    const { history } = this.props;
    const usersArray = transaction.users;
    const cost = document.getElementById("cost").value;
    const title = document.getElementById("title").value;
    const perPersonCost = cost / usersArray.length;

    const paymentArray = [];

    usersArray.forEach(user => {
      if (user !== transaction.payed) {
        paymentArray.push({
          person: user,
          amount: perPersonCost
        });
      }
    });

    const bill = {
      title,
      payer: transaction.payed,
      total: cost,
      outstanding_payments: paymentArray
    };

    this.createBill(bill);

    if (transaction.users.length < 2) {
      alert(
        "There is not enough people to split a bill. Please make sure at least 2 people are on the list."
      );
      return;
    } if (!transaction.payed) {
      alert("Please choose a payee for this bill.");
      return;
    }

    history.push("/home/transactions");
  }

  createBill(data) {
    fetch("/api/bill_exec/create_bill", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // If "this" is not called in the createBill method, you may have to create the function outside of the class (es-lint rule)
        this.setState({});
        return res;
      })
      .catch(err => console.log(err));
  }

  render() {
    const { transaction } = this.state;
    return (
      <div>
        <div className="Transactions">
          <form>
            <div className="CreateBillHeader">
              <h1 className="CardTitle">Create a New Payment </h1>

              <TextField
                required
                id="title"
                placeholder="Title"
                label="Transaction Title"
              />
              <div className="SplitLabels">
                <div className="DollarLabel">$</div>
                <TextField
                  required
                  type="number"
                  id="cost"
                  placeholder="45"
                  label="Amount Paid"
                />
              </div>
            </div>
            <Divider />
          </form>
          <FormGroup>
            <RadioGroup>
              {transaction.users.length !== 0 && (
                <List component="nav" aria-label="main mailbox folders">
                  {transaction &&
                    transaction.users.map(user => (
                      <ListItem button onClick={() => this.handleChange(user)}>
                        <ListItemText primary={user} />
                        <FormControlLabel
                          control={<Radio />}
                          label="Payee"
                          checked={user === transaction.payed}
                        />
                      </ListItem>
                    ))}
                </List>
              )}
            </RadioGroup>
          </FormGroup>
          <Divider />
          <div className="BillPayers">
            <TextField
              id="name"
              className="NoEffects"
              placeholder="Name"
              type="text"
              disableUnderline="true"
              onKeyUp={event => {
                if (event.key === "Enter") {
                  this.addUser();
                }
              }}
            />
            <Button
              className="AddButton"
              onClick={() => this.addUser()}
              variant="contained"
            >
              + Add
            </Button>
          </div>

          <Button
            className="splitButton"
            variant="contained"
            color="primary"
            onClick={() => this.split()}
          >
            Split bill
          </Button>
        </div>
      </div>
    );
  }
}

Split.propTypes = {
  history: PropTypes.node.isRequired
};

export default Split;
