import React, { Component } from "react";
import {
  Button,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  List
} from "@material-ui/core";

class Split extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transaction: {
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

    this.setState({
      transaction: {
        users: transaction.users.concat(name)
      }
    });
  }

  split() {
    const {
      transaction: { users }
    } = this.state;
    const usersArray = users;
    const cost = document.getElementById("cost").value;
    const perPersonCost = cost / usersArray.length;

    const paymentArray = [];

    usersArray.forEach(user => {
      paymentArray.push({
        name: user,
        amount: perPersonCost
      });
    });

    const bill = {
      title: "Transaction title",
      payer: "",
      total: cost,
      payments: paymentArray
    };

    this.createBill(bill);
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
          <div className="TransactionsTitle">
            <h1 className="TransactionsText">New Payment </h1>
            <TextField id="cost" placeholder="Amount Paid" />
          </div>

          <List component="nav" aria-label="main mailbox folders">
            {transaction &&
              transaction.users.map(user => (
                <ListItem button>
                  <ListItemText primary={user} />
                </ListItem>
              ))}
          </List>
          <Divider />
          <TextField id="name" placeholder="Name" type="text" />
          <Button
            className="AddButton"
            onClick={() => this.addUser()}
            variant="contained"
          >
            +
          </Button>
        </div>

        <Button
          className="splitButton"
          variant="contained"
          color="primary"
          onClick={() => this.split()}
        >
          Split
        </Button>
      </div>
    );
  }
}

export default Split;
