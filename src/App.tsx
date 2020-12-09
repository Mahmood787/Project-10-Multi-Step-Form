import React from 'react';
import logo from './logo.svg';
import './App.css';
import StepperForm from './components/StepperForm';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

function App() {
  return (
    <div className="App" >
      <AppBar position="static" style={{marginBottom:"60px"}}>
      <Toolbar variant="dense">
      <Typography variant="h6" color="inherit">
      Multi Step Form
    </Typography>
    </Toolbar>
      </AppBar>
      <StepperForm/>
    </div>
  );
}

export default App; 
