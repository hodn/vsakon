import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PowerIcon from '@material-ui/icons/Power';
import SaveIcon from '@material-ui/icons/Save';
import colors from '../colors';

const { ipcRenderer } = window.require('electron');

const styles = {

  root: {
    flexGrow: 1,
    backgroundColor: colors.main,
  },
  menuButton: {
    marginRight: 10,
  },
  title: {
    flexGrow: 1,
    textAlign: 'left'
  },
};

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

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
    //ipcRenderer.on(this.props.devId.toString(), (event, arg) => {
    // Connection checker


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
    //ipcRenderer.send("remove-alarm", this.props.devId);
    ipcRenderer.send("connect-ports");

  }

  randomHR() {

    return Math.floor(Math.random() * (200 - 0));
  }

  // What the actual component renders
  render() {

    const { classes } = this.props;

    return (


      <div>
        <div>
          <AppBar className={classes.root} style={{ margin: 0 }} position="static">
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography className={classes.title} variant="h6" color="inherit">
                FLEXIGUARD
             </Typography>
              <PowerIcon />
              <PowerIcon />
              <SaveIcon />
            </Toolbar>
          </AppBar>
        </div>
      </div>

    );


  }

}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);

