import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import PaymentIcon from "@material-ui/icons/Payment";
import "../App.css";

function ListItemLink(props) {
  // Creates an error due to props spreading
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListItem button component="a" {...props} />;
}


class TransactionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bills: []
    };
  }


populateBills(bills) {
  if (bills.length === 0) {
    return;
  } else {

    console.log(bills);
  return bills.map(bill => (
    <ExpansionPanel>
      <ExpansionPanelSummary>
        <Typography variant="h5">
          {bill.title}, ${bill.total}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {bill.payments.map(payment => {
          const label = `${payment.from} owes ${payment.to} $${payment.amount}`;
          return (
            <div key={payment.id}>
              <FormControlLabel
                aria-label="Acknowledge"
                onClick={() => this.markPaid({
                  payment_id: payment.payment_id,
                  is_paid: !payment.is_paid,
                })}
                onFocus={event => event.stopPropagation()}
                control={<Checkbox checked={payment.is_paid} />}
                label={label}
              />
            </div>
          );
        })}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  ));
      }
}

setPaidStatus(paymentId, paid) {
  this.setState({
    bills: this.state.bills.map((bill) => {
      return {
        ...bill,
        payments: bill.payments.map((payment) => { 
        if (payment.payment_id === paymentId) {
          return { 
            ...payment,
            is_paid: paid,
          }
        }
        return payment;
      }) }
      
    })
  });
}

markPaid(data) {
  fetch("/api/pay_exec/make_payment", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      // If "this" is not called in the createBill method, you may have to create the function outside of the class (es-lint rule)
      this.setPaidStatus(data.payment_id, data.is_paid);
      return res;
    })
    .catch(err => console.log(err));
}

  componentDidMount() {
    //  actual address http://0.0.0.0:1234/api/bill_data/get_bill
    fetch("/api/bill_data/get_bills") // temp
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data.bills);
        // make a mapping of bills to list items here and render it below
        this.setState({
          bills: data.bills
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { bills } = this.state;
    return (
      <div>
        {this.populateBills(bills)}
        <List component="nav" aria-label="main mailbox folders">
          <Divider />
          <ListItem button>
            <ListItemLink href="#simple-list" className="TransactionSummary">
              <ListItemText primary="Ryan owes Vanessa $10" />
              <ListItemIcon>
                <PaymentIcon className="PaymentIcon" />
              </ListItemIcon>
            </ListItemLink>
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemLink href="#simple-list" className="TransactionSummary">
              <ListItemText primary="Vanessa owes sean $4" />
              <ListItemIcon>
                <PaymentIcon className="PaymentIcon" />
              </ListItemIcon>
            </ListItemLink>
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemLink href="#simple-list" className="TransactionSummary">
              <ListItemText primary="Ryan owes Vanessa a cat" />
              <ListItemIcon>
                <PaymentIcon className="PaymentIcon" />
              </ListItemIcon>
            </ListItemLink>
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemLink href="#simple-list" className="TransactionSummary">
              <ListItemText primary="Sean owes Ryan an apology" />
              <ListItemIcon>
                <PaymentIcon className="PaymentIcon" />
              </ListItemIcon>
            </ListItemLink>
          </ListItem>
        </List>
      </div>
    );
  }
}

export default TransactionList;
