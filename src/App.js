import React, { Component } from 'react';
import { StylesProvider } from "@material-ui/styles";
import "./App.css";
import { SettingsView } from './components/SettingsView';


  class App extends Component {
  
  render() {
    return (
  
  <StylesProvider injectFirst>
    <SettingsView />
  </StylesProvider>
    );
  }
}


export default App;
