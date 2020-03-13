import React from 'react';
import { Route, NavLink, HashRouter} from "react-router-dom"
import Transactions from './Transactions';
import Split from './Split';
import '../App.css';

function Home() {
  return (
    <HashRouter>
    <div>
      <div className="Sidebar">
        <h1>Sp/it Home</h1>
        <NavLink to="/"><button>Sign Out</button></NavLink>
        <ul className="">
          <li><NavLink to="/home/transactions">Transactions</NavLink></li>
          <li><NavLink to="/home/split">Split</NavLink></li>
        </ul>
        </div>
        <div>
          <Route path="/home/transactions" component={Transactions}/>
          <Route path="/home/split" component={Split}/>

        </div>
      </div>
    </HashRouter>
  );
}

export default Home;
