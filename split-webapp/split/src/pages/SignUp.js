import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid, Box, TextField, Button } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { NavLink } from "react-router-dom";
import mainLogo from "./split2.png";
import "../App.css";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200
    }
  },
  margin: {
    margin: theme.spacing(1)
  }
}));

function SignUp() {
  const classes = useStyles();
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
                className="SignInContainer"
              >
                <img
                  src={mainLogo}
                  style={{ width: "50%", marginTop: "10%" }}
                  alt="main logo for sign up"
                />
                <Box component="div" className="InnerContainer">
                  <Typography component="h3" className="SignIn">
                    Sign In
                  </Typography>
                  <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                      id="outlined-basic"
                      label="Username"
                      variant="filled"
                    />

                    <TextField
                      id="outlined-password-input"
                      type="password"
                      label="Password"
                      variant="filled"
                    />
                  </form>

                  <Typography component="h3" className="LogIn">
                    <div>
                      <NavLink to="/home/transactions">
                        <Button
                          variant="contained"
                          color="primary"
                          borderRadius={30}
                          className={classes.margin}
                        >
                          Sign up
                        </Button>
                      </NavLink>
                    </div>
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

export default SignUp;
