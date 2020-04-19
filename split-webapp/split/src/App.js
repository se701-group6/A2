import React from "react";
import "./App.css";
import { Route, HashRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <HashRouter>
        <div className="App">
          <header className="App-header">
            <div>
              <Route exact path="/" component={Login} />
              <Route path="/home" component={Home} />
              <Route path="/SignUp" component={SignUp} />
            </div>
          </header>
        </div>
      </HashRouter>
    </UserProvider>
  );
}

export default App;
