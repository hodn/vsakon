import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import PowerIcon from '@material-ui/icons/Power';
import SaveIcon from '@material-ui/icons/Save';
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
      recordingState: null,
      tabValue: 0
    }

    this.getPortIndication = this.getPortIndication.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.TabContainer = this.TabContainer.bind(this);

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
              <Tab label="Overview"/>
              <Tab label="Map" />
              <Tab label="History" />
              <Tab label="Settings" />
            </Tabs>

            <div className={classes.iconSet} >

              {this.getPortIndication().map((indicationColor) => {
                return <PowerIcon className={classes.icon} style={{ color: indicationColor }} />
              })}

              <SaveIcon className={classes.icon} />
            </div>

            <ResetMenu />
            
          </Toolbar>
        </AppBar>

        {this.state.tabValue === 0 && <this.TabContainer> <MainView/> </this.TabContainer>}
        {this.state.tabValue === 1 && <this.TabContainer> Item Two </this.TabContainer>}
        {this.state.tabValue === 2 && <this.TabContainer> Item Three </this.TabContainer>}

      </div>
     

    );


  }

}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);

