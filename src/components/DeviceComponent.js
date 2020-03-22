import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactiveGauge from "./ReactiveGauge";
import { Paper } from '@material-ui/core';
import { Grid } from '@material-ui/core';
const { ipcRenderer } = window.require('electron');

const styles = {

  root: {

    'border-style': 'solid',
    margin: '10px'
  }

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

    // Listener for data for the exact device
    ipcRenderer.on(this.props.devId.toString(), (event, arg) => {

      // Connection checker
      if (this.state.timeSeries.length === 0) setInterval(this.checkDeviceConnection, 2000);

      const packet = arg.packet;
      const timeSeries = arg.timeSeries;

      // Avoiding collision of same packets
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

    // Already connected
    if (this.state.packet !== null) {

      const time = this.state.packet.basicData.timestamp;

      // No data for 6 seconds - disconnected state
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
    // Sending the command to remove alarm
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
        <Paper>
          <Grid container>
            <Grid item xs={6}>
              <ReactiveGauge hr={90} motionX={this.state.packet === null ? 0 : this.state.packet.basicData.motionX} />
            </Grid>
          </Grid>
        </Paper>
      </div>

    );


  }

}

BasicDeviceComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BasicDeviceComponent);

