import React from 'react';
import DeviceComponent from '../components/DeviceComponent.js';
import Grid from '@material-ui/core/Grid';
const { ipcRenderer } = window.require('electron');

// Main view - online visualization of all units
export class MainView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      indexes: [],
      settings: null

    }
  }

  componentDidMount() {

    this._isMounted = true;
    ipcRenderer.send("online-view-mounted"); // Getting cached data and user profiles
    ipcRenderer.send("get-settings");

    // User settings loaded
    ipcRenderer.once("settings-loaded", (event, arg) => {

      const settings = arg;
      this._isMounted && this.setState({settings});
    })

    // Generating indexes of DeviceComponents - for each device unit
    for (let i = 1; i < 31; i++) {

      this._isMounted && this.setState((state, props) => ({
        indexes: [...state.indexes, i]
      }))
    }
  }

  componentWillUnmount() {

    ipcRenderer.removeAllListeners();

  }

  // What the actual component renders
  render() {

    return (

      <div> 
        <Grid container>
          {this.state.indexes.map((index) => {
            // Had to be done this way - passing the settings down to child components
            return <Grid item xs={2} key={"comp" + index}><DeviceComponent settings={this.state.settings} devId={index} key={index} /> </Grid>
          }, this)}
        </Grid>

      </div>


    );


  }

}

