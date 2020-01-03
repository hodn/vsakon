import React, { Component } from 'react';
import { MainView } from './components/MainView';
import { StylesProvider } from "@material-ui/styles";
import './App.css';
import '../node_modules/react-vis/dist/style.css';

class App extends Component {

  render() {
    return (

      <StylesProvider injectFirst>
        <MainView />
      </StylesProvider>
    );
  }
}


export default App;
