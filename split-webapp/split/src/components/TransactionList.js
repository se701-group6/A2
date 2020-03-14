import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
 
export default function TransactionList() {

const transaction = {

}

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