import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
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
      // If you're using state in component remove the es-lint line below, (else make it a functional component)
      // eslint-disable-next-line react/no-unused-state
      transaction: {
        users: [],
        cost: 0,
        payed: ""
      }
    };
  }

  componentDidMount() {
    fetch("api/adress/goes/here")
      .then(res => {
        return res.json();
      })
      .then(data => {
        // make a mapping of bills to list items here and render it below
        console.log(data); // Temporary code (Adjust as required)
      })
      .catch(err => {
        alert(err);
      });
  }

  render() {
    return (
      <div>
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
