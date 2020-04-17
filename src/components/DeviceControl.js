import React from 'react';
import Button from '@material-ui/core/Button';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import colors from '../colors';
const { ipcRenderer } = window.require('electron');


export default function DeviceControl(passedProps) {
  let props = passedProps.initProps;

  const registerEvent = () => {
    ipcRenderer.send("register-event", {event: "test", devId: props.devId})
  }

  return (
    <div style={{marginLeft: "auto"}}>
      
          <Button variant="contained" size="large" startIcon={<NotificationsOffIcon />} onClick={props.alarm} style={{ backgroundColor: colors.red }}>
            Alarm off
        </Button>  <br/>
      
          <Button variant="contained" size="large" style={{ margin: 3,backgroundColor: colors.secondary, color: "white" }} onClick={registerEvent}>
            Event 1
        </Button> 
        
          <Button variant="contained" size="large" style={{ margin: 3,backgroundColor: colors.secondary, color: "white" }}>
            Event 2
        </Button> <br/>
      
          <Button variant="contained" size="large" style={{ margin: 3,backgroundColor: colors.secondary, color: "white" }}>
            Event 3
        </Button>
       
          <Button variant="contained" size="large" style={{ margin: 3,backgroundColor: colors.secondary, color: "white" }}>
            Event 4
        </Button>
       
    </div>
  );
}