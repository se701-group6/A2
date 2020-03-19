import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { Grid, Box, TextField, Button } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { NavLink } from "react-router-dom";
import "../App.css";
import AccountCircle from "@material-ui/icons/AccountCircle";
import VpnKey from "@material-ui/icons/VpnKey";
import InputAdornment from "@material-ui/core/InputAdornment";
import PropTypes from "prop-types";
import mainLogo from "./split2.png";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      failedAuth: false
    };
  }

  handleOnChangeUser = event => {
    this.state.username = event.target.value;
  };

  handleOnChangePassword = event => {
    this.state.password = event.target.value;
  };

  handleAuth = () => {
    this.setState({ failedAuth: true });
  };

  // creates user and passes it to the api call.
  createDetails() {
    const user = this.state;
    this.authenticate(user);
  }

  // api call to the back-end
  authenticate(user) {
    const { history } = this.props;
    fetch("/api/account/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data.success === true) {
          history.push("/home/transactions");
        } else {
          this.handleAuth();
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    const { failedAuth } = this.state;
    return (
      <React.Fragment key="LoginKey">
        <CssBaseline />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={0}>
            <Container fixed justifyContent="center">
              <Container fixed>
                <Box
                  component="div"
                  borderRadius={12}
                  className="SignInContainer"
                >
                  <img
                    src={mainLogo}
                    style={{ width: "50%", marginTop: "10%" }}
                    alt="Main logo for login"
                  />
                  <Box component="div" className="InnerContainer">
                    <Typography component="h3" className="SignIn">
                      Sign In
                    </Typography>

                    <TextField
                      id="outlined-basic"
                      label="Username"
                      variant="filled"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        )
                      }}
                      onChange={this.handleOnChangeUser}
                    />

                    <TextField
                      id="outlined-password-input"
                      type="password"
                      label="Password"
                      variant="filled"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKey />
                          </InputAdornment>
                        )
                      }}
                      onChange={this.handleOnChangePassword}
                    />

                    <Typography component="h3" className="LogIn">
                      <Button
                        variant="contained"
                        color="primary"
                        borderRadius={30}
                        className="margin"
                        onClick={() => {
                          this.createDetails();
                        }}
                      >
                        Log In
                      </Button>
                      <div>
                        <NavLink to="/SignUp" className="SignUpLink">
                          If you dont have an account, sign up here
                        </NavLink>
                      </div>
                      <Box
                        component="div"
                        visibility={failedAuth ? "visible" : "hidden"}
                        marginTop="50px"
                        color="white"
                      >
                        Incorrect Username or Password
                      </Box>
                    </Typography>
                  </Box>
                </Box>
              </Container>
            </Container>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  history: PropTypes.node.isRequired
};

export default Login;
