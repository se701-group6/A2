import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import PaymentIcon from '@material-ui/icons/Payment';
import "../App.css";

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

class TransactionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        transaction: {
            users: [],
            cost: 0,
            payed: ""
        }
    }
  }

  componentDidMount() {

    fetch('api/adress/goes/here')
    .then(res => {
      return res.json();
    }).then(data => {
      // make a mapping of bills to list items here and render it below
    }).catch(err => {
      console.log(err);
    })
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
            <PaymentIcon className="PaymentIcon"/>
          </ListItemIcon>
        </ListItemLink>
        </ListItem>
        <Divider />
        <ListItem button>
        <ListItemLink href="#simple-list" className="TransactionSummary">
          <ListItemText primary="Vanessa owes sean $4" />
          <ListItemIcon>
            <PaymentIcon className="PaymentIcon"/>
          </ListItemIcon>
        </ListItemLink>
        </ListItem>
        <Divider />
        <ListItem button>
        <ListItemLink href="#simple-list" className="TransactionSummary">
          <ListItemText primary="Ryan owes Vanessa a cat" />
          <ListItemIcon>
            <PaymentIcon className="PaymentIcon"/>
          </ListItemIcon>
          </ListItemLink>
        </ListItem>
        <Divider />
        <ListItem button>
        <ListItemLink href="#simple-list" className="TransactionSummary">
          <ListItemText primary="Sean owes Ryan an apology"/>
          <ListItemIcon>
            <PaymentIcon className="PaymentIcon"/>
          </ListItemIcon>
          </ListItemLink>
        </ListItem>
      </List>
    </div>
    );
  }
}

export default TransactionList;
