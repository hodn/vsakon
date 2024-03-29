import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import UsbIcon from '@material-ui/icons/Usb';
import OpacityIcon from '@material-ui/icons/Opacity';
import InputIcon from '@material-ui/icons/Input';
import colors from '../colors';
import MainView from '../views/MainView';
import SetLocation from '../components/SetLocation';

// Highest component in order - mounts Views and keeps state of recording and ports
const { ipcRenderer } = window.require('electron');

const styles = {

  root: {
    flexGrow: 2
  },

  button: {
    margin: 10,
    color: colors.secondary,
    verticalAlign: 'middle'
  },

  indicatorSet: {
    marginLeft: 'auto',
    margin: 10
  },

  indicator: {
    margin: 10,
    height: 35,
    width: 35,
    verticalAlign: 'middle'
  }
};

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      ports: {},
      isSoaking: false,
      isOnline: false,
      location: "Lokalita měření",
      dialog: true
    }

    this.getPortIndication = this.getPortIndication.bind(this);
    this.getSoakIndicationColor = this.getSoakIndicationColor.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.setLocation = this.setLocation.bind(this);
  }

  componentDidMount() {

    this._isMounted = true;

    // Listener for identified ports 
    ipcRenderer.on('ports-found', (event, arg) => {

      let foundPorts = {};

      arg.forEach(port => {

        // If the port is already opened, keep the OPEN indication, else set the port as identified (set)
        if (this.state.ports[port] === "opened") {
          foundPorts[port] = "opened";
        } else {
          foundPorts[port] = "set";
        }

      });

      this._isMounted && this.setState(prevState => ({
        ports: foundPorts
      }))

    })

    // Listener for changes on port - disconnect/connect - changes the indication
    ipcRenderer.on('port-state', (event, arg) => {

      this.setState(prevState => {
        let ports = prevState.ports;
        ports[arg.port] = arg.state; // Saves the port state
        return { ports };
      })
    })

     // Listener for state of soaking - waiting for activation/soaking
     ipcRenderer.on('soak-state', (event, arg) => {
      this.setState({
        isSoaking: arg
      })
    })

  }

  componentWillUnmount() {

    ipcRenderer.removeAllListeners();

  }

  // Returns the indication icons for the receivers
  getPortIndication() {

    let ports = Object.assign({}, this.state.ports);

    let indicationIcons = Object.keys(ports).map(function (key, index) {

      let indicationColor = null;

      if (ports[key] === "opened") indicationColor = colors.green;
      if (ports[key] === "set") indicationColor = colors.grey;
      if (ports[key] === "closed") indicationColor = colors.red;

      return { color: indicationColor, port: key };
    })

    return indicationIcons;

  }

  getSoakIndicationColor(){
    
    if (this.state.isSoaking) {
      return colors.green;
    }
    else if (this.state.isOnline) {
      return colors.yellow;
    } else {
      return colors.red;
    }
  }

  toggleDialog(){
    this.setState({ dialog: !this.state.dialog });
  }

  setLocation(name){
    this.setState({ location: name });
    ipcRenderer.send("location-set", name);
  }

  // What the actual component renders
  render() {

    const { classes } = this.props;

    return (

      <div className={classes.root}>
        <AppBar style={{ backgroundColor: colors.main, margin: 0 }} position="static">
          <Toolbar>
            <LocationOnIcon className={classes.indicator} />
            <Typography variant="h5">{this.state.location}</Typography>
            <IconButton onClick={() => this.toggleDialog()} className={classes.button}>
              <InputIcon fontSize="large"/>
            </IconButton>

            <div className={classes.indicatorSet} >

              {this.getPortIndication().map((indication) => {
                return (<Tooltip key={indication.port} title={indication.port}>
                  <UsbIcon className={classes.indicator} style={{ color: indication.color }} />
                </Tooltip>)
              })}
              <OpacityIcon className={classes.indicator} style={{ color: this.getSoakIndicationColor() }}/>

            </div>

          </Toolbar>
        </AppBar>
        <MainView isSoaking={this.state.isSoaking} isOnline={this.state.isOnline} />
        {this.state.dialog && <SetLocation dialog={() => this.toggleDialog()} setLocation={this.setLocation} />}
      </div>


    );


  }

}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);

