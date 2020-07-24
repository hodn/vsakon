import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PowerIcon from '@material-ui/icons/Power';
import colors from '../colors';
import { MainView } from '../views/MainView';

// Highest component in order - mounts Views and keeps state of recording and ports
const { ipcRenderer } = window.require('electron');

const styles = {

  root: {
    flexGrow: 2
  },

  menuButton: {
    marginRight: 10,
  },

  iconSet: {
    marginLeft: 'auto',
    marginRight: 15
  },

  icon: {
    marginLeft: 10,
    verticalAlign: 'middle'
  },

  fab: {
    marginLeft: 15,
  },

};

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      ports: {},
      recording: false
    }

    this.getPortIndication = this.getPortIndication.bind(this);
    this.setRecording = this.setRecording.bind(this);

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
  // Turn recording on/off
  setRecording() {
    this.setState({ recording: !this.state.recording });
    ipcRenderer.send("set-recording");
    ipcRenderer.send("get-records");
  }

  // What the actual component renders
  render() {

    const { classes } = this.props;

    return (

      <div className={classes.root}>
        <AppBar style={{ backgroundColor: colors.main, margin: 0 }} position="static">
          <Toolbar>
            <LocationOnIcon/>
            <div className={classes.iconSet} >

              {this.getPortIndication().map((indication) => {
                return (<Tooltip key={indication.port} title={indication.port}>
                  <PowerIcon className={classes.icon} style={{ color: indication.color }} />
                </Tooltip>)
              })}

            </div>

          </Toolbar>
        </AppBar>
      </div>


    );


  }

}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);

