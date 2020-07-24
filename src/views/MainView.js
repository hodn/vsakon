import React from 'react';
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
        Nothing
      </div>


    );


  }

}

