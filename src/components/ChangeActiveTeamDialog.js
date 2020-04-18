import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import colors from "../colors";
const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: 230
  }
}));

export default function ChangeActiveTeam(props) {
  const classes = useStyles();
  const [activeTeam, setActiveTeam] = React.useState(props.activeTeam);

  const handleSelect = (value) => {
    setActiveTeam(value);
  }

  const submitForm = () => {
    props.handleDialog();
    ipcRenderer.send("update-settings", {selectedTeam: activeTeam.id});
    ipcRenderer.send("get-teams");
  }

  const getSelect = () => {

    const topValue = props.teams.find(element => {
      if (activeTeam !== null && activeTeam !== undefined) return element.id === activeTeam.id;
      else return null;
    });

    return (<Autocomplete
      options={props.teams}
      getOptionLabel={(option) => { return option.name }}
      className={classes.textField}
      value={topValue}
      onChange={(event, value) => handleSelect(value)}
      renderInput={(params) => <TextField {...params} className={classes.textField} label="Active team" />}
    />)

  }


  return (
    <div>
      <Dialog open={true} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Change active team</DialogTitle>
        <DialogContent>
          <DialogContentText className={classes.container}>
            Change the active team for the visualization and recording. Not available during ongoing recording.
          </DialogContentText>
          <form className={classes.container}>
            {getSelect()}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleDialog}>
            Cancel
          </Button>
          <Button variant="outlined" disabled={props.recording} onClick={submitForm} style={{ color: colors.secondary }}>
            Change
          </Button>
        </DialogActions>

      </Dialog>
    </div>
  )
}