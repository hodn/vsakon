import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Folder from '@material-ui/icons/Folder';
import colors from '../colors';

const { ipcRenderer } = window.require('electron');
const useStyles = makeStyles(theme => ({

  paper: {
    padding: 20,
    marginBottom: 20
  }

}));

export default function SettingsView(props) {
  const classes = useStyles();
  const [eventNames, setEventNames] = React.useState([]);
  const [graphLength, setGraphLength] = React.useState(100);
  const [optimalTemp, setOptimalTemp] = React.useState([]);
  const [csvDirectory, setCsvDirectory] = React.useState("");
  const [csvComponents, setCsvComponents] = React.useState(null);

  React.useEffect(() => {
    ipcRenderer.send("get-settings");

    ipcRenderer.on("settings-loaded", (event, arg) => {
      setEventNames(arg.eventNames);
      setGraphLength(arg.graphLength);
      setOptimalTemp(arg.optimalTemp);
      setCsvDirectory(arg.csvDirectory);
      setCsvComponents(arg.csvComponents);
    })

    return () => {
      ipcRenderer.removeAllListeners();
    }
  }, [])

  const handleCheckbox = name => event => {
    setCsvComponents({ ...csvComponents, [name]: event.target.checked });
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h5">CSV directory</Typography>
        <Typography variant="subtitle1"> Select directory to store your recordings</Typography>
        <Button
          variant="contained"
          style={{ backgroundColor: colors.secondary, color: "white" }}
          className={classes.button}
          startIcon={<Folder />}
        > Select directory</Button>

      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h5">CSV components</Typography>
        <Typography variant="subtitle1"> Select data sets for recordings </Typography>
        <FormControlLabel
          control={<Checkbox checked={csvComponents ? csvComponents.basicData : false} style={{ color: colors.secondary }} onChange={handleCheckbox("basicData")}/>}
          label="Basic data"
        />
        <FormControlLabel
          control={<Checkbox checked={csvComponents ? csvComponents.performanceData : false} style={{ color: colors.secondary }} onChange={handleCheckbox("performanceData")}/>}
          label="Performance data"
        />
        <FormControlLabel
          control={<Checkbox checked={csvComponents ? csvComponents.locationData : false} style={{ color: colors.secondary }} onChange={handleCheckbox("locationData")}/>}
          label="Location data"
        />
        <FormControlLabel
          control={<Checkbox checked={csvComponents ? csvComponents.nodeData : false} style={{ color: colors.secondary }} onChange={handleCheckbox("nodeData")}/>}
          label="Node data"
        />
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h5">Events</Typography>
        <Typography variant="subtitle1"> Write event names (seperate by semicolon)</Typography>
        <TextField id="outlined-basic" label="Event names" variant="outlined" color="primary"/>
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h5"> Temperature range</Typography>
        <Typography variant="subtitle1"> Set safe range for skin temperature</Typography>
        <Slider
          style={{color: colors.secondary, width: 400}}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          value={[30,35]}
          min={20}
          max={45}
        />
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h5"> Graph length</Typography>
        <Typography variant="subtitle1"> Set minutes length for online graphs</Typography>
        <Slider
          style={{color: colors.secondary, width: 400}}
          valueLabelDisplay="auto"
          value={2}
          min={1}
          max={30}
        />
      </Paper>

    </div>
  );
}
