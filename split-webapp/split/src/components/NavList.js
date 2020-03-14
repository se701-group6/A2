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
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import { NavLink } from "react-router-dom";
import '../App.css';



function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}
 
export default function NavList() {

const transaction = {

}

  return (
    <div>
      <List component="nav" aria-label="main mailbox folders">
      <Divider />
        <ListItem button className="NavButton">
        <PaymentIcon className="NavIcon"/>
        <ListItemLink href="#/home/transactions" className="NavButton">
          <ListItemText primary="Transactions" className="UnselectedNavText"/>
        </ListItemLink>
        </ListItem>
        <Divider />
        <ListItem button>
        <PeopleOutlineIcon className="NavIcon"/>
        <ListItemLink href="#/home/split">
          <ListItemText primary="Split a Bill" className="UnselectedNavText"/>
          </ListItemLink>
        </ListItem>
        <Divider />
      </List>
    </div>
  );
}