import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactiveGauge from "./ReactiveGauge";
import { Paper } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import DeviceStatus from './DeviceStatus';
import PerformanceMeter from './PerformanceMeter';
import Thermometer from './Thermometer';
import DeviceDialog from './DeviceDialog';

const { ipcRenderer } = window.require('electron');

const styles = {

  root: {

    margin: 6,
  },
  icon: {
    height: '25px',
    width: '25px',
    fontSize: '100%',
    margin: '3px 0px 3px 3px',
    padding: '3px',
    float: 'left'
  }

};

class DeviceComponent extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      packet: null,
      timeSeries: [],
      connected: false,
      detailOpen: false,
    }

    this.alarmOff = this.alarmOff.bind(this);
    this.checkDeviceConnection = this.checkDeviceConnection.bind(this);
    this.openDetail = this.openDetail.bind(this);
    this.closeDetail = this.closeDetail.bind(this);

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

  openDetail() {
    this._isMounted && this.setState({ detailOpen: true });
  }

  closeDetail() {
    this.setState({ detailOpen: false });
  }

  // What the actual component renders
  render() {

    const { classes } = this.props;

    return (


      <div className={classes.root}>
        <Paper onClick={this.openDetail} elevation={5} square>
          <Grid container>
            <Grid item xs={2}>
              <DeviceStatus direction={"column"} devId={this.props.devId} connected={this.state.connected} packet={this.state.packet} />
            </Grid>
            <Grid item xs={6}>
              <ReactiveGauge hr={this.state.packet === null ? null : this.state.packet.basicData.heartRate} height={150} width={160} top={40} left={10} margin={-8} />
            </Grid>
            <Grid item xs={2}>
              <PerformanceMeter icon activity={this.state.packet === null ? null : this.state.packet.basicData.activity} top={20}/>
            </Grid>
            <Grid item xs={2}>
              <Thermometer showTemp temp={this.state.packet === null ? null : this.state.packet.basicData.tempSkin} top={20}/>
            </Grid>
          </Grid>
        </Paper>
        <DeviceDialog devId={this.props.devId} packet={this.state.packet} timeSeries={this.state.timeSeries} connected={this.state.connected} 
        alarm={this.alarmOff} open={this.state.detailOpen} close={this.closeDetail}/>
      </div>

    );


  }

}

DeviceComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeviceComponent);

