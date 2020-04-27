import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import Transactions from "./Transactions";
import Split from "./Split";
import NavList from "../components/NavList";
import MenuBar from "../components/MenuBar";
import styles from "./Home.module.css";

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
      <div className={styles.sideBar}>
        <h1 className={styles.splitLogo}>Sp/it</h1>
        <NavLink to="/">
          <button type="button">Sign Out</button>
        </NavLink>
        <NavList />
      </div>
    );

    const CollapsedSideBar = () => <div className={styles.collapsedSidebar} />;

    const { isOpen } = this.state;

    return (
      <HashRouter>
        <MenuBar className={styles.appBar} toggleSidebar={this.toggleSidebar} />
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
