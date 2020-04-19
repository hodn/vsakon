import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import colors from '../colors';
const { ipcRenderer } = window.require('electron');


export default function DeviceControl(passedProps) {
  let props = passedProps.initProps;

  const registerEvent = (eventName) => {
    ipcRenderer.send("register-event", { event: eventName, devId: props.devId })
  }

  const showAlarmButton = (alarmState) => {
    if (alarmState) return (
      <Grid item><Button variant="contained" size="large" startIcon={<NotificationsOffIcon />} onClick={props.alarm} style={{ backgroundColor: colors.red }}>
        Alarm off
      </Button></Grid>
    )
  }

  const getEventButtons = (settings) => {

    const buttons = [];

    if (props.settings) {
      for (let index = 0; index < props.settings.eventNames.length; index++) {
        buttons.push(
          <Grid item><Button key={index} variant="contained" size="large" style={{ margin: 3, backgroundColor: colors.secondary, color: "white" }} onClick={registerEvent(props.settings.eventNames[index])}>
            {props.settings.eventNames[index]}
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