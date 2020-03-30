import React from 'react';
import { Avatar } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BatteryIndicator from './BatteryIndicator';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import colors from '../colors';;


const useStyles = makeStyles({

    root: {

        'border-style': 'solid',
    },
    avatar: {
        height: 30,
        width: 30,
        'font-size': 15,
        'font-weight': 'bold',
        margin: 8,
        'background-color': 'transparent',
        'color': 'black',
        'border-color': 'black',
        'border-style': 'solid'
    },
    icon: {
        height: '20px',
        width: '20px',
        'margin': '5px',
    },

    battery: {
        height: 30,
        width: 30,
        margin: 5,
    
    },
});


function DeviceStatus(props) {

    const switchColor = (props) => {

        let connection = props.connection === true;
        let alarmOn = props.data === null ? false : props.data.deadMan;
                
        if (connection) {
            
            if (alarmOn) {
                return colors.red;
            }else {
                return colors.green;
            }

        } else {

            return colors.grey;
        }



    }

    const classes = useStyles();
    return (

        <div style={ {backgroundColor: switchColor(props)}}>
            <Grid direction="column" alignItems="center" container>
                <Grid item>  <Avatar className={classes.avatar}>{props.devId}</Avatar> </Grid>
                <Grid item>  <BatteryIndicator className={classes.battery} batteryPercentage={props.data === null ? null : props.data.basicData.batteryPercentage} /> </Grid>
                <Grid item>  <GpsNotFixedIcon className={classes.icon} /> </Grid>
                <Grid item>  <SettingsInputComponentIcon className={classes.icon}  /> </Grid>
            </Grid>
        </div>

    );
}
export default DeviceStatus;