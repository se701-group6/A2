import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
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

  toggleSidebar = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  render() {
    const SideBar = () => (
      <div className="Sidebar">
        <h1 className="SplitLogo">Sp/it</h1>
        <NavLink to="/">
          <button type="button">Sign Out</button>
        </NavLink>
        <NavList />
      </div>
    );

    const CollapsedSideBar = () => <div className="CollapsedSidebar" />;

    const { isOpen } = this.state;

    return (
      <HashRouter>
        <MenuBar className="AppBar" toggleSidebar={this.toggleSidebar} />
        <div>
          {isOpen ? <SideBar /> : <CollapsedSideBar />}
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
