import React, { Component } from 'react';
import { StylesProvider } from "@material-ui/styles";
import './App.css';
import '../node_modules/react-vis/dist/style.css';
import { DevContainer } from './components/DevContainer';


  class App extends Component {
  
  render() {
    return (
  
  <StylesProvider injectFirst>
    <DevContainer />
  </StylesProvider>
    );
  }
}


export default App;
