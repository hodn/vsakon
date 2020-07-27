import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

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

export default function SetLocation(props) {
  const classes = useStyles();
  const [name, setName] = React.useState();

  const submitForm = () => {
    props.dialog();
    props.setLocation(name);
  }
  return (
    <div>
      <Dialog open={true} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Zadejte lokalitu měření</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <TextField className={classes.textField} required label="Lokalita měření" name="name" onChange={event => {
              const { value } = event.target;
              setName(value);
            }} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.dialog}>
            Zrušit
          </Button>
          <Button variant="outlined" onClick={submitForm} color="primary">
            Nastavit
          </Button>
        </DialogActions>

      </Dialog>
    </div>
  )
}