import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import colors from "../colors";
const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    margin: 10,
    width: 230
  }
}));

export default function AddTeamDialog(props) {
  const classes = useStyles();
  const [team, setTeam] = React.useState(props.team);

  // Setting team name or team note
  const handleChange = name => event => {
    setTeam({ ...team, [name]: event.target.value });
  };

  // Assigned user to device (unit) in the team
  const handleSelect = (value, index) => {
    let newMembers = [...team.members]; // to be refactored
    newMembers[index] = value;
    setTeam({ ...team, members: newMembers });
  }

  const submitForm = () => {
    props.handleDialog();
    let teamWithIDsOnly = Object.assign({}, team); // to be refactored
    
    // Saving only member IDs
    for (let index = 0; index < teamWithIDsOnly.members.length; index++) {
      teamWithIDsOnly.members[index] = teamWithIDsOnly.members[index].id;
    };

    ipcRenderer.send("add-teams", {collection: "teams", data: teamWithIDsOnly}); // Save to DB
    ipcRenderer.send("get-teams"); // Refresh the table
  }

  // Return select and autocomplete component for each device (unit)
  const getUnits = () => {
    
    const units = [];

    for (let index = 0; index < 30; index++) {
      
      const topValue = props.users.find(element => { 
        if(team.members[index] !== null && team.members[index] !== undefined ) return element.id === team.members[index].id; // If default user for that unit exists
        else return null;
      });
      
      units.push(<Autocomplete
              options={props.users}
              getOptionLabel={(option) => { return option.name + " " + option.surname }}
              className={classes.textField}
              value={topValue}
              onChange={(event, value) => handleSelect(value, index)}
              key={index}
              renderInput={(params) => <TextField {...params} className={classes.textField} label={"Unit " + (index + 1)} />}
            />)
      
    }

    return units;
  }

  
  return (
    <div>
      <Dialog open={true} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add new team</DialogTitle>
        <DialogContent>
          <TextField className={classes.textField} required label="Name" name="name" value={team.name} onChange={handleChange('name')} />
          <TextField className={classes.textField} required multiline label="Note" name="note" value={team.note} onChange={handleChange('note')} />
          <form className={classes.container}> 
          {getUnits().map((component) => {
            return component;
          })}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleDialog}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={submitForm} style={{ color: colors.secondary }}>
            Add
          </Button>
        </DialogActions>

      </Dialog>
    </div>
  )
}