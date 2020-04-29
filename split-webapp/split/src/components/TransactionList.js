import React from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import PaymentIcon from "@material-ui/icons/Payment";
import Pagination from "@material-ui/lab/Pagination";
import PropTypes from "prop-types";
import "../App.css";

/* eslint react/no-unused-prop-types: 0 */

function buildUrl(url, parameters) {
  let qs = "";
  let newUrl = url;

  // Build the query string
  Object.keys(parameters).forEach(key => {
    const value = parameters[key];
    qs += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
  });

  if (qs.length > 0) {
    qs = qs.substring(0, qs.length - 1); // chop off last "&"
    newUrl = `${url}?${qs}`;
  }
  return newUrl;
}

function calculateTotalPaid(bill) {
  let runningTotal = 0;
  bill.payments.forEach(payment => {
    if (payment.is_paid) {
      runningTotal += payment.amount;
    }
  });

  return runningTotal;
}

function calculateTotalOutstanding(bill) {
  let total = 0;
  bill.payments.forEach(payment => {
    total += payment.amount;
  });

  return total;
}

class TransactionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bills: [],
      page: 1
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.sendFilters(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.sendFilters(this.props);
    }
  }

  setPaidStatus(paymentId, paid) {
    const { bills } = this.state;
    this.setState({
      bills: bills.map(bill => {
        return {
          ...bill,
          payments: bill.payments.map(payment => {
            if (payment.payment_id === paymentId) {
              return {
                ...payment,
                is_paid: paid
              };
            }
            return payment;
          })
        };
      })
    });
  }

  // eslint-disable-next-line no-unused-vars
  sendFilters = async ({ sortField, sortOrder, isPaid, payer, payee }) => {
    const { page } = this.state;
    const params = {
      sort_field: sortField,
      sort_order: sortOrder,
      is_paid: isPaid,
      payer,
      payee,
      page_number: page
    };

    const url = "api/bill_data/get_bills";

    const response = await fetch(buildUrl(url, params), {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      method: "GET"
    })
      .then(responseBody => responseBody.json())
      .then(data => {
        this.setState({
          bills: data.bills
        });
      })
      .catch(error => {
        console.log(error);
      });

    if (response) {
      console.log(response.message);
    }
  };

  populateBills(bills) {
    const transaction = bills.map(bill => (
      <ExpansionPanel className="Bills">
        <ExpansionPanelSummary>
          <div className="BillSummary">
            <div className="BillTitle">{bill.title}</div>
            <div className="BillAmount">${Number(bill.total).toFixed(2)}</div>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="Payments">
          <div className="PaymentsTitle">
            <PaymentIcon className="PaymentHeaders" />
            <div className="RunningTotal">
              <div className="BillTitle Percentage">
                (
                {Math.round(
                  (calculateTotalPaid(bill) / calculateTotalOutstanding(bill)) *
                    100
                )}
                %){" "}
              </div>
              <div className="BillTitle">
                ${calculateTotalPaid(bill).toFixed(2)}/$
                {calculateTotalOutstanding(bill).toFixed(2)}
              </div>
            </div>
          </div>
          {bill.payments.map(payment => {
            const label = `${payment.from} owes ${payment.to} $${Number(
              payment.amount
            ).toFixed(2)}`;
            return (
              <div key={payment.id}>
                <FormControlLabel
                  aria-label="Acknowledge"
                  onClick={() =>
                    this.markPaid({
                      payment_id: payment.payment_id,
                      is_paid: !payment.is_paid
                    })
                  }
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

    if (transaction.length === 0) {
      return (
        <div className="NoTransactions">
          You have no outstanding transactions.
        </div>
      );
    }
    return transaction;
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
        this.setPaidStatus(data.payment_id, data.is_paid);
        return res;
      })
      .catch(err => console.log(err));
  }

  handleChange(event, value) {
    this.setState(
      {
        page: value
      },
      () => {
        this.sendFilters(this.props);
      }
    );
  }

  render() {
    const { bills, page } = this.state;
    const pageSize = 5;
    return (
      <div>
        {this.populateBills(bills)}
        <Pagination
          count={Math.ceil(bills.length / pageSize)}
          page={page}
          color="primary"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

TransactionList.propTypes = {
  sortField: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  isPaid: PropTypes.string.isRequired,
  payer: PropTypes.string.isRequired,
  payee: PropTypes.string.isRequired
};

export default TransactionList;
