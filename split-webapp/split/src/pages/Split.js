import React, { Component } from "react";
import {
  Button,
  ListItem,
  ListItemText,
  ListItemIcon,
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
    let name = document.getElementById("name").value;
    document.getElementById("name").value = "";

    this.setState({
      transaction: {
        users: this.state.transaction.users.concat(name)
      }
    });
  }

  split() {
    let users = this.state.transaction.users;
    let cost = document.getElementById("cost").value;
    let perPersonCost = cost / users.length;

    let paymentArray = [];

    users.forEach(user => {
      paymentArray.push({
        name: user,
        amount: perPersonCost
      });
    });

    let bill = {
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
        return res;
      })
      .catch(err => alert(err));
  }

  render() {
    return (
      <div>
        <div className="Transactions">
          <div className="TransactionsTitle">
            <h1 className="TransactionsText">New Payment </h1>
            <TextField id="cost" placeholder="Amount Paid"></TextField>
          </div>

          <List component="nav" aria-label="main mailbox folders">
            {this.state.transaction &&
              this.state.transaction.users.map((user, index) => (
                <ListItem button>
                  <ListItemText primary={user} />
                </ListItem>
              ))}
          </List>
          <Divider />
          <TextField id="name" placeholder="Name" type="text"></TextField>
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
