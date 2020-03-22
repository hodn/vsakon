import React from 'react';
import { Avatar } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Battery20 from '@material-ui/icons/Battery20';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';


const useStyles = makeStyles({

    root: {

        'border-style': 'solid',
    },
    icon: {
        height: '25px',
        width: '25px',
        'font-size': '100%',
        'margin': '10px 3px 3px 3px',
        padding: '3px'
    }

});


function DeviceStatus(props) {

    const colorSwitch = (hr) => {

        if (hr >= 50 && hr <= 110) {

            return "#7FFF00";
        } else if (hr < 40 || hr > 160) {

            return "#FF0000";
        } else {
            return "#FFFF00";
        }

    }

    const classes = useStyles();
    return (

        <div>
            <Grid container>
                <Grid item>  <Avatar className={classes.icon}>12</Avatar> </Grid>
                <Grid item>  <Battery20 className={classes.icon} /> </Grid>
                <Grid item>  <GpsNotFixedIcon className={classes.icon} /> </Grid>
                <Grid item>  <SettingsInputComponentIcon className={classes.icon} /> </Grid>
            </Grid>
        </div>

    );
}
export default DeviceStatus;