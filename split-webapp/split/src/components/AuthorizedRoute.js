import { Redirect, Route } from "react-router-dom";
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const AuthorizedRoute = ({ path, component, exact }) => (
  <Route
    path={path}
    component={
      useContext(UserContext).username ? component : () => <Redirect to="/" />
    }
    exact={exact}
  />
);

AuthorizedRoute.propTypes = Route.propTypes;

export default AuthorizedRoute;
