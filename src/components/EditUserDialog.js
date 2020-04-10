import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import colors from "../colors";

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    margin: 15,
    width: 230
  },
  menu: {
    width: 260,
  },
}));

export default function EditUserDialog(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState(props.user);
  console.log(values);
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  /* props: title, type of operation, state of close, event to send*/

  return (
    <div>
      <Dialog open={true} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit user</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <TextField className={classes.textField} required label="Name" name="name" value={values.name} onChange={handleChange('name')} />
            <TextField className={classes.textField} required label="Surname" name="surname" value={values.surname} onChange={handleChange('surname')} />
            <TextField className={classes.textField} required multiline label="Note" name="note" value={values.note} onChange={handleChange('note')} />
            <TextField className={classes.textField} required label="Age" name="age" type="number" value={values.age} onChange={handleChange('age')} />
            <TextField className={classes.textField} required label="Weight (kg)" name="weight" type="number" value={values.weight} onChange={handleChange('weight')} />
            <TextField className={classes.textField} required label="Height (cm)" name="height" type="number" value={values.height} onChange={handleChange('height')} />
            <TextField className={classes.textField} required label="Resting heart rate (BPM)" name="hrRest" type="number" value={values.hrRest} onChange={handleChange('hrRest')} />
            <TextField className={classes.textField} required label="Reference heart rate (BPM)" name="hrRef" type="number" value={values.hrRef} onChange={handleChange('hrRef')} />
            <TextField className={classes.textField} required label="Maximum heart rate (BPM)" name="hrMax" type="number" value={values.hrMax} onChange={handleChange('hrMax')} />
            <TextField className={classes.textField} required label="Maximum VO2 (ml/min)" name="vMax" type="number" value={values.vMax} onChange={handleChange('vMax')} />
            <TextField className={classes.textField}
              select
              label="Select gender"
              value={values.gender}
              onChange={handleChange('gender')}
              margin="normal"
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
            >
              <MenuItem key={"male"} value={"Male"}>
                Male
              </MenuItem>
              <MenuItem key={"female"} value={"Female"}>
                Female
              </MenuItem>
            </TextField>
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleUserDialog}>
            Cancel
          </Button>
          <Button type="submit" onClick={props.handleUserDialog} style={{color: colors.secondary}}>
            Save
          </Button>
        </DialogActions>
       
      </Dialog>
    </div>
  )
}