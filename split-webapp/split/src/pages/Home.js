import React from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import Transactions from "./Transactions";
import Split from "./Split";
import NavList from "../components/NavList";
import MenuBar from "../components/MenuBar";
import styles from "./Home.module.css";

console.log(styles);

function Home() {
  return (
    <HashRouter>
      <MenuBar className={styles.appBar} />
      <div>
        <div className={styles.sideBar}>
          <h1 className={styles.splitLogo}>Sp/it</h1>
          <NavLink to="/">
            <button type="button">Sign Out</button>
          </NavLink>
          <NavList />
        </div>
        <div className={styles.homeScreen}>
          <Route path="/home/transactions" component={Transactions} />
          <Route path="/home/split" component={Split} />
        </div>
      </div>
    </HashRouter>
  );
}

export default Home;
