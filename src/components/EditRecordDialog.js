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
const { ipcRenderer } = window.require('electron');

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

export default function EditRecordDialog(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState(props.item);
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const submitForm = () => {
    props.handleDialog();
    ipcRenderer.send("update-item", {collection: "records", data: values});
    ipcRenderer.send("get-records");
  }

  return (
    <div>
      <Dialog open={true} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit record</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <TextField className={classes.textField} label="Note" name="note" value={values.note} onChange={handleChange('note')} />
            <TextField className={classes.textField} required multiline label="Path" name="path" value={values.path} onChange={handleChange('path')} />
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleDialog}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={submitForm} style={{color: colors.secondary}}>
            Edit
          </Button>
        </DialogActions>
       
      </Dialog>
    </div>
  )
}