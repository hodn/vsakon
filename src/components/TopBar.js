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
      ports: {},
      recordingState: []
    }

    this.alarmOff = this.alarmOff.bind(this);
    this.checkDeviceConnection = this.checkDeviceConnection.bind(this);
    this.getPortIcon = this.getPortIcon.bind(this);

  }

  componentDidMount() {

    this._isMounted = true;

    // Listener for identified ports
    ipcRenderer.on('ports-found', (event, arg) => {

      let foundPorts = {};

      arg.forEach(port => {

        foundPorts[port] = "set";

      });

      this.setState(prevState => ({
        ports: foundPorts
      }))

    })

    ipcRenderer.on('port-state', (event, arg) => {

      this.setState(prevState => {
        let ports = prevState.ports;
        ports[arg.port] = arg.state;
        return { ports };
      })

      console.log(this.state.ports);
    })


  }

  componentWillUnmount() {

  }

  checkDeviceConnection() {


  }

  alarmOff() {
    // Sending the command to remove alarm
    //ipcRenderer.send("remove-alarm", this.props.devId);
    ipcRenderer.send("connect-ports");

  }

  getPortIcon() {
    
    let ports = Object.assign({}, this.state.ports); 
    let icons = [];
    
    {Object.keys(ports).map(function(key, index) {
      if (ports[key] === "opened") icons.push(<PowerIcon style={{color: colors.green}}/>);
      if (ports[key] === "set") icons.push(<PowerIcon style={{color: colors.grey}}/>);
      if (ports[key] === "closed") icons.push(<PowerIcon style={{color: colors.red}}/>);
   })}

   return icons;

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
             {this.getPortIcon().map((component) => {
            return component;
          })}
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

