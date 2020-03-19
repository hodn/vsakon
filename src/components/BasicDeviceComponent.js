import React from 'react';
import { XYPlot, LineSeries } from 'react-vis';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactiveGauge from "./ReactiveGauge";
import Button from '@material-ui/core/Button';
const { ipcRenderer } = window.require('electron');

const styles = {
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
};

class BasicDeviceComponent extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this.checkDeviceConnection = this.checkDeviceConnection.bind(this);

    this.state = {
      packet: null,
      timeSeries: [],
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

      if (this.state.timeSeries.length === 0) setInterval(this.checkDeviceConnection, 2000);

      const packet = arg.packet;
      const timeSeries = arg.timeSeries;

      if (packet !== this.state.packet) {

        this._isMounted && this.setState((state, props) => ({
          packet: packet,
          connected: true,
          timeSeries: timeSeries,
          randomHR: Math.floor(Math.random() * 200)

        }))

      }



    })

  }

  componentWillUnmount() {

  }

  checkDeviceConnection() {
    
    if (this.state.packet !== null) {

      const time = this.state.packet.basicData.timestamp;

      if (Date.now() - time > 6000) {

        this._isMounted && this.setState((state, props) => ({
          connected: false,
          packet: null,
          timeSeries: []
        }))

      }

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

    const { classes } = this.props;

    return (

      
      <div>
        <h3>{this.props.devId + 1} </h3>
        <h3>{this.state.packet === null ? "false" : this.state.packet.basicData.accX.toString()}</h3>
        <p>Connected: {this.state.connected.toString()} --- Alarm: {this.state.packet === null ? "false" : this.state.packet.deadMan.toString()}</p>
        <ReactiveGauge hr={this.state.randomHR} motionX={this.state.packet === null ? 0 : this.state.packet.basicData.motionX} />

        <XYPlot height={100} width={300}>
          <LineSeries data={this.state.timeSeries} />
        </XYPlot>
      </div>

    );


  }

}

BasicDeviceComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BasicDeviceComponent);

