import React from 'react';
import { XYPlot, LineSeries } from 'react-vis';
const { ipcRenderer } = window.require('electron');

export class DevContainer extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this.checkDeviceConnection = this.checkDeviceConnection.bind(this);

    this.state = {
      realTimeData: undefined,
      graphData: [],
      connected: false,
      interval: undefined
    }

  }

  componentDidMount() {

    this._isMounted = true;

    ipcRenderer.send("clear-to-send");
    ipcRenderer.on('18', (event, arg) => {

      setTimeout(this.checkDeviceConnection, 3000);

      const packet = arg
      const graph = { x: packet.basicData.timestamp, y: packet.basicData.motionX }

      this._isMounted && this.setState((state, props) => ({
        realTimeData: packet,
        connected: true,
        graphData: [...state.graphData, graph]
      }))

    })

  }

  componentWillUnmount() {

  }

  checkDeviceConnection() {


    if (this.state.realTimeData !== undefined) {

      const time = this.state.realTimeData.basicData.timestamp;

      if (Date.now() - time > 2800) {
        
        this._isMounted && this.setState((state, props) => ({
          connected: false

        }))

      }

    }
    else {
      return;
    }



  }


  // What the actual component renders
  render() {

    return (

      <div>
        <p>{this.state.connected.toString()}</p>
      </div>

    );


  }

}

