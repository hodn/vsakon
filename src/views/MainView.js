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

