import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import { Button } from "@material-ui/core";
import Transactions from "./Transactions";
import Split from "./Split";
import "../App.css";
import NavList from "../components/NavList";
import MenuBar from "../components/MenuBar";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: true };
  }

  render() {
    const toggleSidebar = () => {
      this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    };

    const SideBar = () => (
      <div className="Sidebar">
        <Button
          className="SidebarButton"
          variant="contained"
          color="primary"
          onClick={() => toggleSidebar()}
        >
          {"<<<"}
        </Button>
        <h1 className="SplitLogo">Sp/it</h1>
        <NavLink to="/">
          <button type="button">Sign Out</button>
        </NavLink>
        <NavList />
      </div>
    );

    const CollapsedSideBar = () => (
      <div className="CollapsedSidebar">
        <Button
          className="CollapsedSidebarButton"
          variant="contained"
          color="primary"
          onClick={() => toggleSidebar()}
        >
          {">>>"}
        </Button>
      </div>
    );

    const { isOpen } = this.state;

    return (
      <HashRouter>
        <MenuBar className="AppBar" />
        <div>
          {isOpen ? SideBar() : CollapsedSideBar()}
          <div className="HomeScreen">
            <Route path="/home/transactions" component={Transactions} />
            <Route path="/home/split" component={Split} />
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Home;
