import React from "react";
import { List, ListItem, ListItemText, Divider } from "@material-ui/core";
import PaymentIcon from "@material-ui/icons/Payment";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import "../App.css";

function ListItemLink(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListItem button component="a" {...props} />;
}

export default function NavList() {
  return (
    <div>
      <List component="nav" aria-label="main mailbox folders">
        <Divider />
        <ListItem button className="NavButton">
          <PaymentIcon className="NavIcon" />
          <ListItemLink href="#/home/transactions" className="NavButton">
            <ListItemText
              primary="Transactions"
              className="UnselectedNavText"
            />
          </ListItemLink>
        </ListItem>
        <Divider />
        <ListItem button>
          <PeopleOutlineIcon className="NavIcon" />
          <ListItemLink href="#/home/split">
            <ListItemText
              primary="Split a Bill"
              className="UnselectedNavText"
            />
          </ListItemLink>
        </ListItem>
        <Divider />
      </List>
    </div>
  );
}
