import React, { Component } from "react";
import PropTypes from "prop-types";
import { getCookie } from "../utils/helpers";

export const UserContext = React.createContext({});

export class UserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: getCookie("username")
    };
  }

  setUsername = username => {
    this.setState({
      username
    });
  };

  render() {
    const { username } = this.state;
    const { children } = this.props;
    return (
      <UserContext.Provider
        value={{
          username,
          setUsername: this.setUsername
        }}
      >
        {children}
      </UserContext.Provider>
    );
  }
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};
