import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import colors from '../colors';;


export default function DeviceControl(passedProps) {
  let props = passedProps.initProps;

  return (
    <div style={{ width: 200 }}>
      <Grid direction="row" justify="center" alignItems="center" container spacing={2}>
        <Grid item xs={12}>
          <Button variant="contained" startIcon={<NotificationsOffIcon />} onClick={props.alarm} style={{ backgroundColor: colors.red }}>
            Alarm off
        </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" style={{ backgroundColor: colors.secondary }}>
            Event 1
        </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" style={{ backgroundColor: colors.secondary }}>
            Event 2
        </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" style={{ backgroundColor: colors.secondary }}>
            Event 3
        </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" style={{ backgroundColor: colors.secondary }}>
            Event 4
        </Button>
        </Grid>
      </Grid>
    </div>
  );
}