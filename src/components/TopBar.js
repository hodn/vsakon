import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import PowerIcon from '@material-ui/icons/Power';
import SaveIcon from '@material-ui/icons/Save';
import SettingsIcon from '@material-ui/icons/Settings';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import MapIcon from '@material-ui/icons/Map';
import TimelineIcon from '@material-ui/icons/Timeline';
import colors from '../colors';
import ResetMenu from './ResetMenu';
import { MainView } from '../views/MainView';


const { ipcRenderer } = window.require('electron');

const styles = {

  root: {
    flexGrow: 1
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
  }
};

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      ports: {},
      recording: false,
      tabValue: 0
    }

    this.getPortIndication = this.getPortIndication.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.TabContainer = this.TabContainer.bind(this);
    this.setRecording = this.setRecording.bind(this);

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

    // Listener for changes on port - disconnect/connect
    ipcRenderer.on('port-state', (event, arg) => {

      this.setState(prevState => {
        let ports = prevState.ports;
        ports[arg.port] = arg.state; // Saves the port state
        return { ports };
      })
    })


  }

  componentWillUnmount() {

  }

// Changes the color of ports icon upon connect/disconnect
  getPortIndication() {

    let ports = Object.assign({}, this.state.ports);

    let indicationColors = Object.keys(ports).map(function (key, index) {

      let indicationColor = null;

      if (ports[key] === "opened") indicationColor = colors.green;
      if (ports[key] === "set") indicationColor = colors.grey;
      if (ports[key] === "closed") indicationColor = colors.red;

      return indicationColor;
    })

    return indicationColors;

  }
// Turn recording on/off
  setRecording(){
    this.setState({ recording: !this.state.recording });
    ipcRenderer.send("set-recording");
  }

// Helper functions for tab - navigation
  changeTab(event, tabValue) {

    this.setState({ tabValue });
  }

  TabContainer(props) {
    return (
      <Typography component="div" style={{ padding: 10 }}>
        {props.children}
      </Typography>
    );
  }


  // What the actual component renders
  render() {

    const { classes } = this.props;

    return (

      <div className={classes.root}>
        <AppBar style={{ backgroundColor: colors.main, margin: 0 }} position="static">
          <Toolbar>

            <Tabs TabIndicatorProps={{ style: { background: colors.secondary } }} aria-label="tab" value={this.state.tabValue} onChange={this.changeTab}>
              <Tab icon={<ViewComfyIcon />} />
              <Tab icon={<MapIcon />} />
              <Tab icon={<TimelineIcon />} />
              <Tab icon={<SettingsIcon />} />
            </Tabs>

            <div className={classes.iconSet} >

              {this.state.recording && <SaveIcon className={classes.icon} style={{ color: colors.green }} />} 
              
              {this.getPortIndication().map((indicationColor) => {
                return <PowerIcon className={classes.icon} style={{ color: indicationColor }} />
              })}

            </div>

            <Fab onClick={this.setRecording} size="small" aria-label="reset" >
              <SaveIcon />
            </Fab>
            
            <div className={classes.icon}> <ResetMenu /> </div>

          </Toolbar>
        </AppBar>

        {this.state.tabValue === 0 && <this.TabContainer> <MainView /> </this.TabContainer>}
        {this.state.tabValue === 1 && <this.TabContainer> Map </this.TabContainer>}
        {this.state.tabValue === 2 && <this.TabContainer> History </this.TabContainer>}
        {this.state.tabValue === 3 && <this.TabContainer> Settings </this.TabContainer>}

      </div>


    );


  }

}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);

