import React from 'react';
import { Avatar } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Battery20 from '@material-ui/icons/Battery20';
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
        'margin': '5px',
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
        height: '35px',
        width: '35px',
        'margin': '5px',
    
    },
});


function DeviceStatus(props) {

    const switchColor = (props) => {

        let connection = props.connection === true;
        let alarmOn = props.data === null ? false : props.data.deadMan;

        console.log(alarmOn);
        
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
                <Grid item>  <Battery20 className={classes.battery} /> </Grid>
                <Grid item>  <GpsNotFixedIcon className={classes.icon} /> </Grid>
                <Grid item>  <SettingsInputComponentIcon className={classes.icon}  /> </Grid>
            </Grid>
        </div>

    );
}
export default DeviceStatus;