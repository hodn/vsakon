import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import PowerIcon from '@material-ui/icons/Power';
import SaveIcon from '@material-ui/icons/Save';
import colors from '../colors';
import ResetMenu from './ResetMenu';

const { ipcRenderer } = window.require('electron');

const styles = {

  root: {
    flexGrow: 1,
    backgroundColor: colors.main,
    marginBottom: 10
  },

  menuButton: {
    marginRight: 10,
  },

  iconSet: {
    marginLeft: 'auto',
    marginRight: 10
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
      recordingState: null
    }

    this.getPortIndication = this.getPortIndication.bind(this);

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

  // What the actual component renders
  render() {

    const { classes } = this.props;

    return (

      <div className={classes.root}>
        <AppBar className={classes.root} style={{ margin: 0 }} position="static">
          <Toolbar>

            <Tabs aria-label="Tab">
              <Tab label="Overview" />
              <Tab label="Map" />
              <Tab label="History" />
              <Tab label="Settings" />
            </Tabs>

            <div className={classes.iconSet} >

              {this.getPortIndication().map((indicationColor) => {
                return <PowerIcon className={classes.icon} style={{ color: indicationColor }} />
              })}

              <SaveIcon className={classes.icon}/>
            </div>

            <ResetMenu/>

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

