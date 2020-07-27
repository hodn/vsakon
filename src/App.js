import React, { Component } from 'react';
import 'typeface-roboto';
import { StylesProvider } from "@material-ui/styles";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from "@material-ui/styles";
import './App.css';
import TopBar from './components/TopBar';
import '../node_modules/react-vis/dist/style.css';
import 'leaflet/dist/leaflet.css';
import colors from './colors'
const { ipcRenderer } = window.require('electron');

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.secondary
    },
    secondary: {
      main: colors.main}
      
  }
})

class App extends Component {

  render() {

    ipcRenderer.send("clear-to-send");
    //ipcRenderer.send("connect-ports");

    return (

      <ThemeProvider theme={theme}>
        <StylesProvider injectFirst>
          <TopBar />
        </StylesProvider>
      </ThemeProvider>
    );
  }
}


export default App;
