import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { Grid, Box, TextField, Button } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { NavLink } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
import VpnKey from "@material-ui/icons/VpnKey";
import InputAdornment from "@material-ui/core/InputAdornment";
import PropTypes from "prop-types";
import mainLogo from "./split2.png";
import { UserContext } from "../context/UserContext";
import { getCookie } from "../utils/helpers";
import styles from "./SignUp.module.css";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        username: "",
        password: "",
        confPassword: ""
      },
      failed: false,
      validation: {
        validPassword: true,
        matchPassword: true
      }
    };
  }

  handleTextChange = event => {
    const { user, validation } = this.state;
    user[event.target.name] = event.target.value;
    validation.validPassword = true;
    this.setState({ user, failed: false, validation });
  };

  handleBlurChange = () => {
    const { validation } = this.state;
    validation.matchPassword = this.validatePassword();
    validation.validPassword = !this.emptyPassword();
    this.setState({ validation });
  };

  // Creates a new user JSON and sends to the create account end point.
  // User should get logged in as well as session created.

  createUser(setUsername) {
    const { user, validation } = this.state;
    const { history } = this.props;

    if (!this.validateUsername()) {
      this.setState({
        failed: true
      });
    }

    if (this.emptyPassword()) {
      validation.validPassword = false;
      this.setState({
        validation
      });
    }

    if (
      this.validateUsername() === true &&
      this.emptyPassword() === false &&
      this.validatePassword() === true
    ) {
      fetch("api/account/register", {
        method: "POST",
        body: JSON.stringify({
          username: user.username,
          password: user.password
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          setUsername(getCookie("username"));
          if (data.success === true) {
            history.push("/home/split");
          } else {
            this.setState({
              user,
              failed: true
            });
          }
        })
        .catch(err => console.log(err));
    }
  }

  validatePassword() {
    const { user } = this.state;
    return user.password === user.confPassword;
  }

  emptyPassword() {
    const { user } = this.state;
    return user.password.length === 0;
  }

  validateUsername() {
    const { user } = this.state;
    return user.username !== "";
  }

  render() {
    const { failed, user, validation } = this.state;
    return (
      <React.Fragment key="SignUpKey">
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
                  className={styles.signInContainer}
                >
                  <img
                    src={mainLogo}
                    style={{ width: "50%", marginTop: "10%" }}
                    alt="main logo for sign up"
                  />
                  <Box component="div" className={styles.innerContainer}>
                    <Typography component="h3" className={styles.signIn}>
                      Sign Up
                    </Typography>
                    <form className="root" noValidate autoComplete="off">
                      <TextField
                        id="username"
                        label="Username"
                        name="username"
                        variant="filled"
                        error={failed}
                        helperText={
                          failed
                            ? "Invalid Username. Cannot be empty or in use."
                            : ""
                        }
                        onChange={this.handleTextChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircle />
                            </InputAdornment>
                          )
                        }}
                      />

                      <TextField
                        required
                        error={!validation.validPassword}
                        helperText={
                          !validation.validPassword ? "Password required" : ""
                        }
                        onBlur={this.handleBlurChange}
                        id="outlined-password-input"
                        name="password"
                        type="password"
                        label="Password"
                        variant="filled"
                        value={user.password}
                        onChange={this.handleTextChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <VpnKey />
                            </InputAdornment>
                          )
                        }}
                      />
                      <TextField
                        required
                        error={!validation.matchPassword}
                        helperText={
                          !validation.matchPassword
                            ? "Passwords do not match"
                            : ""
                        }
                        onBlur={this.handleBlurChange}
                        id="outlined-password-input-confirm"
                        name="confPassword"
                        type="password"
                        label="Confirm Password"
                        variant="filled"
                        onChange={this.handleTextChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <VpnKey />
                            </InputAdornment>
                          )
                        }}
                      />
                    </form>

                    <Typography component="h3" className="LogIn">
                      <NavLink to="/">
                        <Button
                          variant="contained"
                          color="primary"
                          borderRadius={30}
                          className="margin"
                        >
                          Return to Log In
                        </Button>
                      </NavLink>

                      <NavLink to="/SignUp">
                        <UserContext.Consumer>
                          {({ setUsername }) => {
                            return (
                              <Button
                                variant="contained"
                                color="primary"
                                borderRadius={30}
                                className="margin"
                                onClick={() => this.createUser(setUsername)}
                              >
                                Sign up
                              </Button>
                            );
                          }}
                        </UserContext.Consumer>
                      </NavLink>
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

SignUp.propTypes = {
  history: PropTypes.node.isRequired
};

export default SignUp;
