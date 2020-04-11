import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import PowerIcon from '@material-ui/icons/Power';
import SaveIcon from '@material-ui/icons/Save';
import SettingsIcon from '@material-ui/icons/Settings';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import MapIcon from '@material-ui/icons/Map';
import TimelineIcon from '@material-ui/icons/Timeline';
import GroupIcon from '@material-ui/icons/Group';
import colors from '../colors';
import ResetMenu from './ResetMenu';
import { MainView } from '../views/MainView';
import { SettingsView } from '../views/SettingsView';
import { HistoryView } from '../views/HistoryView';
import { TeamView } from '../views/TeamView'


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
              <Tab style={{ minWidth: 100 }}icon={<ViewComfyIcon/>} />
              <Tab style={{ minWidth: 100 }} icon={<MapIcon />} />
              <Tab style={{ minWidth: 100 }} icon={<TimelineIcon />} />
              <Tab style={{ minWidth: 100 }} icon={<GroupIcon/>} />
              <Tab style={{ minWidth: 100 }} icon={<SettingsIcon />} />
            </Tabs>

            <div className={classes.iconSet} >

              {this.state.recording && <SaveIcon className={classes.icon} style={{ color: colors.green }} />}

              {this.getPortIndication().map((indication) => {
                return (<Tooltip key={indication.port} title={indication.port}>
                  <PowerIcon className={classes.icon} style={{ color: indication.color }} />
                </Tooltip>)
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
        {this.state.tabValue === 2 && <this.TabContainer> <HistoryView/> </this.TabContainer>}
        {this.state.tabValue === 3 && <this.TabContainer> <TeamView recording={this.state.recording} /> </this.TabContainer>}
        {this.state.tabValue === 4 && <this.TabContainer> <SettingsView/> </this.TabContainer>}

      </div>


    );


  }

}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);

