import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import {Box} from "@material-ui/core";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import {TextField} from '@material-ui/core';
import {Button} from '@material-ui/core';
import {NavLink} from  "react-router-dom";
import mainLogo from'./split2.png';






const useStyles = makeStyles(theme => ({
    outterContainer: {
        
        backgroundColor: '#6fa2fb', height: '75vh', width: '50vh', textAlign: 'center'
      },
      innerContainer: {
        
        backgroundColor: '#6fa2fb', height: '65%', width: '90%', textAlign: 'center',
        marginTop: '10%',
        marginLeft: '4%',
        textAlign: 'left'
        
      },
      textField: {
          backgroundColor: 'white',
          marginTop: '10%',
          marginLeft: '10%',
          borderColor: '#6fa2fb'

      },
      signIn: {
        fontSize: '120%',
        color: 'white',
        marginLeft: '10%'
      },
      logIn: {
        fontSize: '3vw',
        color: 'white',
        marginTop: '10%',
        marginLeft: '40%'
      },



    }));

export default function Login() {
    const classes = useStyles();

    return ( 
        <React.Fragment>
            <CssBaseline />
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh' }}
                >
                    <Grid item xs={0}>
                        <Container fixed  justifyContent="center">
                                <Container fixed>
                                    <Box component="div" borderRadius={12} className = {classes.outterContainer} >
                                        
                                        <img src ={mainLogo} style={{ width: "50%", marginTop: '10%'}}/>
                                        <Box component="div" className= {classes.innerContainer}>
                                            <Typography component="h3" className ={classes.signIn}>
                                                Sign In
                                            </Typography>
                                            <TextField id="outlined-basic" label="Username" variant="filled" className={classes.textField} />
                                            <TextField id="outlined-password-input" type="password" label="Password" variant="filled" className={classes.textField} />
                                            <Typography component="h3" className ={classes.logIn}>
                                            <NavLink to="/home/transactions">
                                              <Button variant="contained" color="primary" borderRadius={30} >
                                                 Login
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

