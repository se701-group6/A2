import React from 'react';
import './App.css';
import { Route, HashRouter} from "react-router-dom"
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <HashRouter>
      <div className="App">
        <header className="App-header">
        <div>
          <Route exact path="/" component={Login}/>
          <Route path="/home" component={Home}/>
        </div>
        </header>
      </div>
    </HashRouter>
  );
}

export default App;
