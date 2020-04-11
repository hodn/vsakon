import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
const { ipcRenderer } = window.require('electron');

export default function DeleteDialog(props) {
  
  const submitForm = () => {
    props.handleDialog();
    const collection = props.item.weight === undefined ? "teams" : "users"
    ipcRenderer.send("delete-teams", {collection, id: props.item.id});
    ipcRenderer.send("get-teams");
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
            Would you like to delete {props.item.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleDialog}>
            Cancel
          </Button>
          <Button onClick={submitForm} style={{color:"red"}} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
