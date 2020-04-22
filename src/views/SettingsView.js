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
    padding: 15,
    marginBottom: 10
  },
  subtitle: {
    marginBottom: 5
  }

}));

export default function SettingsView(props) {
  const classes = useStyles();
  const [eventNames, setEventNames] = React.useState([""]);
  const [graphLength, setGraphLength] = React.useState(1);
  const [optimalTemp, setOptimalTemp] = React.useState([30, 35]);
  const [csvDirectory, setCsvDirectory] = React.useState("");
  const [csvComponents, setCsvComponents] = React.useState(null);
  const [metersMax, setMetersMax] = React.useState(null);

  const updateSettings = () => {
    const newSettings = { csvDirectory, csvComponents, optimalTemp, graphLength, eventNames, metersMax };
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
      setMetersMax(arg.metersMax);
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
    ipcRenderer.send("update-settings", { csvComponents: changedComponents });// Change immediately as the user can switch on recording from settings menu
  };

  const handleMax = name => (event, value) => {
    setMetersMax({ ...metersMax, [name]: value });
  };

  const handleDirectoryChange = () => {
    ipcRenderer.send("open-dialog", "openDirectory");

    ipcRenderer.once("csv-path-loaded", (event, arg) => {
      setCsvDirectory(arg.path.toString());
      ipcRenderer.send("update-settings", { csvDirectory: arg.path.toString() });
    })
    // Change immediately as the user can switch on recording from settings menu
  };

  const handleMinutes = (event, newValue) => {
    setGraphLength(newValue)
  }

  const handleTemp = (event, newValue) => {
    setOptimalTemp(newValue)
  }

  const handleEvents = (event, newValue) => {
    const eventArray = event.target.value.split(",");
    setEventNames(eventArray);
  }

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography>CSV directory</Typography>
        <Typography className={classes.subtitle} variant="subtitle2"> {csvDirectory}</Typography>
        <Button
          variant="contained"
          size="small"
          style={{ backgroundColor: colors.secondary, color: "white" }}
          startIcon={<Folder />}
          onClick={handleDirectoryChange}
        > Select directory</Button>
      </Paper>
      <Paper className={classes.paper}>
        <Typography >CSV components</Typography>
        <FormControlLabel
          control={<Checkbox checked={csvComponents ? csvComponents.basicData : false} style={{ color: colors.secondary }} onChange={handleCheckbox("basicData")} />}
          label="Basic data"
        />
        <FormControlLabel
          control={<Checkbox checked={csvComponents ? csvComponents.performanceData : false} style={{ color: colors.secondary }} onChange={handleCheckbox("performanceData")} />}
          label="Performance data"
        />
        <FormControlLabel
          control={<Checkbox checked={csvComponents ? csvComponents.locationData : false} style={{ color: colors.secondary }} onChange={handleCheckbox("locationData")} />}
          label="Location data"
        />
        <FormControlLabel
          control={<Checkbox checked={csvComponents ? csvComponents.nodeData : false} style={{ color: colors.secondary }} onChange={handleCheckbox("nodeData")} />}
          label="Node data"
        />
      </Paper>
      <Paper className={classes.paper}>
        <Typography >Events</Typography>
        <Typography className={classes.subtitle} variant="subtitle2"> Write event names (seperate by comma)</Typography>
        <TextField id="outlined-basic" value={eventNames} onChange={handleEvents} style={{ width: 400 }} label="Event names" variant="outlined" color="primary" />
      </Paper>
      <Paper className={classes.paper}>
        <Typography> Skin temperature safe range</Typography>
        <Typography className={classes.subtitle} variant="subtitle2"> {optimalTemp[0]} - {optimalTemp[1]} °C</Typography>
        <Slider
          style={{ color: colors.secondary, width: 400 }}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          value={optimalTemp}
          min={20}
          max={45}
          onChange={handleTemp}
        />
      </Paper>
      <Paper className={classes.paper}>
        <Typography> Online graph length </Typography>
        <Typography className={classes.subtitle} variant="subtitle2"> {graphLength} minute(s) </Typography>
        <Slider
          style={{ color: colors.secondary, width: 400 }}
          valueLabelDisplay="auto"
          value={graphLength}
          min={1}
          max={15}
          onChange={handleMinutes}
        />
      </Paper>

      <Paper className={classes.paper}>
        <Typography className={classes.subtitle}> Meter visualization maximum</Typography>
        <Typography variant="subtitle2"> Maximum temperature: {metersMax ? parseInt(metersMax.temp, 10) : 50} °C</Typography>
        <Slider
          style={{ color: colors.secondary, width: 400 }}
          valueLabelDisplay="auto"
          value={metersMax ? parseInt(metersMax.temp, 10) : 50}
          min={0}
          max={100}
          onChange={handleMax("temp")}
        />

        <Typography className={classes.subtitle} variant="subtitle2"> Maximum acceleration: {metersMax ? parseInt(metersMax.acc, 10) : 10} G</Typography>
        <Slider
          style={{ color: colors.secondary, width: 400 }}
          valueLabelDisplay="auto"
          value={metersMax ? parseInt(metersMax.acc, 10) : 10}
          min={0}
          max={20}
          onChange={handleMax("acc")}
        />

        <Typography className={classes.subtitle} variant="subtitle2"> Maximum activity: {metersMax ? parseInt(metersMax.activity, 10) : 100} nat</Typography>
        <Slider
          style={{ color: colors.secondary, width: 400 }}
          valueLabelDisplay="auto"
          value={metersMax ? parseInt(metersMax.activity, 10) : 100}
          min={0}
          max={500}
          onChange={handleMax("activity")}
        />

        <Typography className={classes.subtitle} variant="subtitle2"> Maximum performance: {metersMax ? parseInt(metersMax.stehlik, 10) : 180} stehlik</Typography>
        <Slider
          style={{ color: colors.secondary, width: 400 }}
          valueLabelDisplay="auto"
          value={metersMax ? parseInt(metersMax.stehlik, 10) : 180}
          min={0}
          max={300}
          onChange={handleMax("stehlik")}
        />
      </Paper>

    </div>
  );
}
