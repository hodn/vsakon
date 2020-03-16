import React from 'react';
import { XYPlot, LineSeries } from 'react-vis';
import GaugeComponent from "./GaugeComponent"
const { ipcRenderer } = window.require('electron');

export class BasicDeviceComponent extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this.checkDeviceConnection = this.checkDeviceConnection.bind(this);

    this.state = {
      realTimeData: null,
      graphData: [],
      connected: false,
      randomHR: 0
    }

    this.alarmOff = this.alarmOff.bind(this);
    this.checkDeviceConnection = this.checkDeviceConnection.bind(this);
    this.randomHR = this.randomHR.bind(this);

  }

  componentDidMount() {

    this._isMounted = true;

    ipcRenderer.on(this.props.devId.toString(), (event, arg) => {

      if (this.state.graphData.length === 0) setInterval(this.checkDeviceConnection, 3000);

      const data = arg.data;
      const graphData = arg.graphData;

      if (data !== this.state.realTimeData) {

        this._isMounted && this.setState((state, props) => ({
          realTimeData: data,
          connected: true,
          graphData: graphData,
          randomHR: Math.floor(Math.random() * 200)

        }))

      }



    })

  }

  componentWillUnmount() {

  }

  checkDeviceConnection() {


    if (this.state.realTimeData !== null) {

      const time = this.state.realTimeData.basicData.timestamp;

      if (Date.now() - time > 5000) {

        //add aditional if for longer than 6 secs - not enough saturation - set default state

        this._isMounted && this.setState((state, props) => ({
          connected: false

        }))

      }

    }
    else {
      return;
    }



  }

  alarmOff() {
    ipcRenderer.send("remove-alarm", this.props.devId);
  }

  randomHR() {

    return Math.floor(Math.random() * (200 - 0));
  }

  // What the actual component renders
  render() {

    return (

      <div>
        <h3>{this.props.devId.toString()} <button onClick={this.alarmOff}>Alarm OFF</button></h3>
        <h3>{this.state.realTimeData === null ? "false" : this.state.realTimeData.basicData.accX.toString()}}</h3>
        <p>Connected: {this.state.connected.toString()} --- Alarm: {this.state.realTimeData === null ? "false" : this.state.realTimeData.deadMan.toString()}</p>
        <GaugeComponent hr={this.state.randomHR} motionX={this.state.realTimeData === null ? 0 : this.state.realTimeData.basicData.motionX} />

        <XYPlot height={100} width={300}>
          <LineSeries data={this.state.graphData} />
        </XYPlot>
      </div>

    );


  }

}

