import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import colors from '../colors';
const { ipcRenderer } = window.require('electron');


export default function DeviceControl(passedProps) {
  let props = passedProps.initProps;

  // Sends the registered event to be written to CSV
  const registerEvent = (eventName) => {
    ipcRenderer.send("register-event", { event: eventName, devId: props.devId }) 
  }

  // If alarm is on - show Turn off button
  const showAlarmButton = (alarmState) => {
    if (alarmState) return (
      <Grid item><Button variant="contained" size="large" startIcon={<NotificationsOffIcon />} onClick={props.alarm} style={{ backgroundColor: colors.red, marginRight: 5 }}>
        Alarm off
      </Button></Grid>
    )
  }

  // Dynamically generate event buttons from DB
  const getEventButtons = (settings) => {

    const buttons = [];

    if (props.settings) {
      for (let index = 0; index < props.settings.eventNames.length; index++) {
        buttons.push(
          <Grid key={index} item><Button variant="contained" size="large" style={{ margin: 3, backgroundColor: colors.secondary, color: "white" }} onClick={() => registerEvent(settings.eventNames[index])}>
            {settings.eventNames[index]}
          </Button></Grid>
        )

      }
    }

    return buttons;
  }

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >

        {showAlarmButton(props.packet ? props.packet.deadMan : false)}

        {getEventButtons(props.settings).map(button => {
          return button;

        })}
      </Grid>
    </div>
  );
}