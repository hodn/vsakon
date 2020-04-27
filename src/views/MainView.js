import React from 'react';
import DeviceComponent from '../components/DeviceComponent.js';
import Grid from '@material-ui/core/Grid';
const { ipcRenderer } = window.require('electron');


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
    ipcRenderer.send("online-view-mounted");
    ipcRenderer.send("get-settings");

    ipcRenderer.once("settings-loaded", (event, arg) => {

      const settings = arg;
      this._isMounted && this.setState({settings});
    })

    for (let i = 1; i < 31; i++) {

      this._isMounted && this.setState((state, props) => ({
        indexes: [...state.indexes, i]
      }))
    }
  }

  componentWillUnmount() {

  }

  // What the actual component renders
  render() {

    return (

      <div> 
        <Grid container>
          {this.state.indexes.map((index) => {
            return <Grid item xs={2} key={"comp" + index}><DeviceComponent settings={this.state.settings} devId={index} key={index} /> </Grid>
          }, this)}
        </Grid>

      </div>


    );


  }

}

