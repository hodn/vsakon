import React, { Component } from 'react';
import { MainView } from './views/MainView';
import { StylesProvider } from "@material-ui/styles";
import './App.css';
import TopBar from './components/TopBar';
import '../node_modules/react-vis/dist/style.css';
const { ipcRenderer } = window.require('electron');

class App extends Component {

  render() {

    ipcRenderer.send("clear-to-send");
    ipcRenderer.send("connect-ports");

    return (

        <StylesProvider injectFirst>
          <TopBar/>
          <MainView />
        </StylesProvider>
    );
  }
}


export default App;
