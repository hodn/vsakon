import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
const { ipcRenderer } = window.require('electron');

export default function RemoveRecordDialog(props) {
  
  const submitForm = () => {
    props.handleDialog();
    ipcRenderer.send("delete-item", {collection: "records", id: props.item.id});
    ipcRenderer.send("get-records");
  }

  return (
    <div>
      <Dialog
        open={true}
        onClose={props.handleDialog}
      >
        <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
  Would you like to remove this record of {props.item.team.name} from {new Date(props.item.start).toLocaleString()}? The source file will not be affected.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleDialog}>
            Cancel
          </Button>
          <Button onClick={submitForm} style={{color:"red"}} autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
