import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
    marginBottom: 15
  },
  heading: {
    marginBottom: 10
  }

}));

export default function SettingsView(props) {
  const classes = useStyles();
  const [eventNames, setEventNames] = React.useState([""]);
  const [graphLength, setGraphLength] = React.useState(1);
  const [optimalTemp, setOptimalTemp] = React.useState([30,35]);
  const [csvDirectory, setCsvDirectory] = React.useState("");
  const [csvComponents, setCsvComponents] = React.useState(null);

  const updateSettings = () => {
    const newSettings = {csvDirectory, csvComponents, optimalTemp, graphLength, eventNames};
    ipcRenderer.send("update-settings", newSettings);
  }

  const updateRef = React.useRef();
  updateRef.current = updateSettings;

  React.useEffect(() => {
    
    ipcRenderer.send("get-settings");
    ipcRenderer.on("settings-loaded", (event, arg) => {
      setEventNames(arg.eventNames);
      setGraphLength(arg.graphLength);
      setOptimalTemp(arg.optimalTemp);
      setCsvDirectory(arg.csvDirectory);
      setCsvComponents(arg.csvComponents);
    })
    window.addEventListener('beforeunload', () => {
      updateRef.current()
    });
    return () => {
      ipcRenderer.removeAllListeners();
      updateRef.current();
    }
  }, [updateRef])

 

  const handleCheckbox = name => event => {
    setCsvComponents({ ...csvComponents, [name]: event.target.checked });
    const changedComponents = { ...csvComponents, [name]: event.target.checked };
    ipcRenderer.send("update-settings", {csvComponents: changedComponents});// Change immediately as the user can switch on recording from settings menu
  };

  const handleDirectoryChange = () => {
    ipcRenderer.send("open-dialog", "openDirectory");
    
    ipcRenderer.once("csv-path-loaded", (event, arg) => {
      setCsvDirectory(arg.path.toString());
      ipcRenderer.send("update-settings", {csvDirectory: arg.path.toString()});
    })
     // Change immediately as the user can switch on recording from settings menu
  };

  const handleMin = (event, newValue) => {
    setGraphLength(newValue)
  }

  const handleTemp = (event, newValue) => {
    setOptimalTemp(newValue)
  }

  const handleEvents = (event, newValue) =>{
    const eventArray = event.target.value.split(",");
    setEventNames(eventArray);
  }

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h5">CSV directory</Typography>
        <Typography className={classes.heading} variant="subtitle1"> Select directory to store your recordings</Typography>
        <Button
          variant="contained"
          style={{ marginBottom: 15, backgroundColor: colors.secondary, color: "white" }}
          startIcon={<Folder />}
          onClick={handleDirectoryChange}
        > Select directory</Button>
        <Typography variant="subtitle2"> {csvDirectory}</Typography>
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h5">CSV components</Typography>
        <Typography className={classes.heading} variant="subtitle1"> Select data sets for recordings </Typography>
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
        <Typography className={classes.heading} variant="subtitle1"> Write event names (seperate by comma)</Typography>
        <TextField id="outlined-basic" value={eventNames} onChange={handleEvents} style={{width: 500}}label="Event names" variant="outlined" color="primary"/>
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h5"> Temperature range</Typography>
        <Typography className={classes.heading} variant="subtitle1"> Set safe range for skin temperature (°C)</Typography>
        <Slider
          style={{color: colors.secondary, width: 400}}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          value={optimalTemp}
          min={20}
          max={45}
          onChange={handleTemp}
        />
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h5"> Graph length</Typography>
        <Typography className={classes.heading} variant="subtitle1"> Set length for online graphs (minutes)</Typography>
        <Slider
          style={{color: colors.secondary, width: 400}}
          valueLabelDisplay="auto"
          value={graphLength}
          min={1}
          max={15}
          onChange={handleMin}
        />
      </Paper>

    </div>
  );
}
