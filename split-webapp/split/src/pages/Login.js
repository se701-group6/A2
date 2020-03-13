import React from "react";
import { NavLink } from "react-router-dom";
import Button from "@material-ui/core/Button";

function Login() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sp/it Login</h1>
        <ul className="App-header">
          <NavLink to="/home/transactions">
            <Button variant="contained" color="primary">
              To Home
            </Button>
          </NavLink>
        </ul>
      </header>
    </div>
  );
}

export default Login;
