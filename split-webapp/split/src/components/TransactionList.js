import React from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import PaymentIcon from "@material-ui/icons/Payment";
import "../App.css";

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
    <ExpansionPanel className="Bills">
      <ExpansionPanelSummary>
      <div className="BillSummary">
        <div className="BillTitle">
          {bill.title}
        </div>
        <div className="BillAmount">
          ${bill.total}
        </div>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className="Payments">
      <div className="PaymentsTitle">
      <PaymentIcon className="PaymentHeaders"/>
      </div>
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
      </div>
    );
  }
}

export default TransactionList;
