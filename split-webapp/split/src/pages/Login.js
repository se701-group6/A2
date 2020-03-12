import React from 'react';
import { NavLink } from "react-router-dom"

function Login() {
  return (
      <div className="App">
        <header className="App-header">
        <h1>Sp/it Login</h1>
        <ul className="App-header">
        <NavLink to="/home"><button>To Home</button></NavLink>
        </ul>
        </header>
      </div>
  );
}

export default Login;
