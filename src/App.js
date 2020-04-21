import React, { Component } from 'react';
import 'typeface-roboto';
import { StylesProvider } from "@material-ui/styles";
import './App.css';
import TopBar from './components/TopBar';
import '../node_modules/react-vis/dist/style.css';
import 'leaflet/dist/leaflet.css';
const { ipcRenderer } = window.require('electron');

class App extends Component {

  render() {

    ipcRenderer.send("clear-to-send");
    //ipcRenderer.send("connect-ports");

    return (

        <StylesProvider injectFirst>
          <TopBar/>
        </StylesProvider>
    );
  }
}


export default App;
