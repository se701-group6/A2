import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid, Box, TextField, Button } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { NavLink } from "react-router-dom";
import "../App.css";
import AccountCircle from "@material-ui/icons/AccountCircle";
import VpnKey from "@material-ui/icons/VpnKey";
import InputAdornment from "@material-ui/core/InputAdornment";
import mainLogo from "./split2.png";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
      background: "white"
    }
  },
  margin: {
    margin: theme.spacing(1)
  }
}));

function Login() {
  const classes = useStyles();
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
                    Sign Up
                  </Typography>
                  <form className={classes.root} noValidate autoComplete="off">
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
                    />
                  </form>

                  <Typography component="h3" className="LogIn">
                    <NavLink to="/">
                      <Button
                        variant="contained"
                        color="primary"
                        borderRadius={30}
                        className={classes.margin}
                      >
                        Return to Log In
                      </Button>
                    </NavLink>

                    <NavLink to="/SignUp">
                      <Button
                        variant="contained"
                        color="primary"
                        borderRadius={30}
                        className={classes.margin}
                      >
                        Sign up
                      </Button>
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

export default Login;
