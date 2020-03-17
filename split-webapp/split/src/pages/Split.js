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
    const usersArray = transaction.users;
    const cost = document.getElementById("cost").value;
    const title = document.getElementById("title").value;
    const perPersonCost = cost / usersArray.length;

    const paymentArray = [];

    usersArray.forEach(user => {
      paymentArray.push({
        person: user,
        amount: perPersonCost
      });
    });

    const bill = {
      title,
      payer: transaction.payed,
      total: cost,
      outstanding_payments: paymentArray
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
          <form>
            <div className="CreateBillHeader">
              <h1 className="CreateBillTitle">Create a New Payment </h1>

              <TextField
                required
                id="title"
                placeholder="Title"
                label="Transaction Title"
              />
              <TextField
                required
                id="cost"
                placeholder="$45"
                label="Amount Paid"
              />
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
          <TextField
            id="name"
            placeholder="Name"
            type="text"
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
