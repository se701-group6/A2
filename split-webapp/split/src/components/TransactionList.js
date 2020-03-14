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
          <ListItemText primary="Ryan owes Vanessa $5" />
          <ListItemIcon>
            <PaymentIcon className="PaymentIcon"/>
          </ListItemIcon>
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="Vanessa owes sean $4" />
          <ListItemIcon>
            <PaymentIcon className="PaymentIcon"/>
          </ListItemIcon>
        </ListItem>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem button>
          <ListItemText primary="Lorem Ipsum" />
        </ListItem>
        <Divider />
        <ListItemLink href="#simple-list">
          <ListItemText primary="Lorem Ipsum" />
        </ListItemLink>
        <Divider />
      </List>
    </div>
  );
}