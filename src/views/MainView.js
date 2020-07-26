import React from 'react';
import Grid from '@material-ui/core/Grid';
const { ipcRenderer } = window.require('electron');

// Main view - online visualization of all units
export class MainView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      coeffs: [],
      soak: 0,
      location: null,
      start: null,
      end: null

    }
  }

  componentDidMount() {

    this._isMounted = true;

    ipcRenderer.on('online-data', (event, arg) => {
      this.setState({
        coeffs: arg.coeffs,
        soak: arg.soak,
        location: arg.measurementLocation,
        start: arg.measurementStart,
        end: arg.measurementEnd
      })
      console.log(this.state);
    })
  }

  componentWillUnmount() {

    ipcRenderer.removeAllListeners();

  }

  // What the actual component renders
  render() {

    return (

      <div>
        
      </div>


    );


  }

}

