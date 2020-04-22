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
      activityGraph: [],
      heartRateGraph: [],
      tempSkinGraph: [],
      accXGraph: [],
      accYGraph: [],
      accZGraph: [],
      user: null,
      connected: false,
      detailOpen: false,
      width: window.innerWidth/1920,
      height: window.innerHeight/1080
      // Settings here (events, thermo, tepovka) - can load with profiles
    }

    this.alarmOff = this.alarmOff.bind(this);
    this.checkDeviceConnection = this.checkDeviceConnection.bind(this);
    this.openDetail = this.openDetail.bind(this);
    this.closeDetail = this.closeDetail.bind(this);

  }

  componentDidMount() {

    this._isMounted = true;
    
    ipcRenderer.once(this.props.devId.toString() + "-profile", (event, arg) => {

      const user = arg;
      this._isMounted && this.setState({ user });

    })

    window.addEventListener('resize', () => {

      this._isMounted && this.setState({ 
        width: window.innerWidth/1920,
        height: window.innerHeight/1080
      });

    });
    

    // Listener for data for the exact device
    ipcRenderer.on(this.props.devId.toString(), (event, arg) => {

      // Connection checker
      setTimeout(this.checkDeviceConnection, 6000);

      const packet = arg.packet;
      const activityGraph = arg.activityGraph;
      const heartRateGraph = arg.heartRateGraph;
      const tempSkinGraph = arg.tempSkinGraph;
      const accXGraph = arg.accXGraph;
      const accYGraph = arg.accYGraph;
      const accZGraph = arg.accZGraph;
      const connected = true;

      this._isMounted && this.setState((state, props) => ({
        packet,
        activityGraph,
        heartRateGraph,
        tempSkinGraph,
        accXGraph,
        accYGraph,
        accZGraph,
        connected
      }))

    })

  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
  }

  checkDeviceConnection() {

    // Already connected
    if (this.state.packet !== null) {

      const time = this.state.packet.basicData.timestamp;

      // No data for 6 seconds - disconnected state
      if (Date.now() - time > 5000) {

        this._isMounted && this.setState((state, props) => ({
          connected: false,
          packet: null,
          activityGraph: [],
          heartRateGraph: [],
          tempSkinGraph: [],
          accXGraph: [],
          accYGraph: [],
          accZGraph: []
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
            <DeviceStatus direction={"column"} devId={this.props.devId} connected={this.state.connected} packet={this.state.packet} height={this.state.height} width={this.state.width}/>
            </Grid>
            <Grid item xs={6}>
              <ReactiveGauge hr={this.state.packet === null ? null : this.state.packet.basicData.heartRate} user={this.state.user} height={150 * this.state.height} width={160 * this.state.width} top={40 * this.state.height} />
            </Grid>
            <Grid item xs={2}>
              <PerformanceMeter icon activity={this.state.packet === null ? null : this.state.packet.basicData.activity} settings={this.props.settings} top={this.state.height * 20} height={this.state.height * 100} width={this.state.width * 12}/>
            </Grid>
            <Grid item xs={2}>
              <Thermometer showTemp temp={this.state.packet === null ? null : this.state.packet.basicData.tempSkin} settings={this.props.settings} top={this.state.height * 20}  height={this.state.height * 100} width={this.state.width * 12}/>
            </Grid>
          </Grid>
        </Paper>
        <DeviceDialog
          devId={this.props.devId}
          packet={this.state.packet}
          heartRateGraph={this.state.heartRateGraph}
          activityGraph={this.state.activityGraph}
          tempSkinGraph={this.state.tempSkinGraph}
          accXGraph={this.state.accXGraph}
          accYGraph={this.state.accYGraph}
          accZGraph={this.state.accZGraph}
          user={this.state.user}
          connected={this.state.connected}
          alarm={this.alarmOff}
          open={this.state.detailOpen}
          settings={this.props.settings}
          close={this.closeDetail} />
      </div>

    );


  }

}

DeviceComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeviceComponent);

