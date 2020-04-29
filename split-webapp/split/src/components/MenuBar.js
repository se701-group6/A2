import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PropTypes from "prop-types";
import { UserContext } from "../context/UserContext";
import styles from "./MenuBar.module.css";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default function MenuBar(props) {
  const classes = useStyles();
  const [auth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <UserContext.Consumer>
      {({ username }) => (
        <div className={classes.root}>
          <AppBar position="static" className={styles.appBar} color="white">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="pink"
                aria-label="menu"
                onClick={props.toggleSidebar}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title} />
              {auth && (
                <div className={styles.menuBar}>
                  <h3 className={styles.profileName}>{username}</h3>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="pink"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right"
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right"
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </AppBar>
        </div>
      )}
    </UserContext.Consumer>
  );
}

MenuBar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired
};
