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

        borderStyle: 'solid',
    },
    avatar: {
        height: 30,
        width: 30,
        fontSize: 15,
        fontWeight: 'bold',
        margin: 8,
        backgroundColor: 'transparent',
        color: 'black',
        borderColor: 'black',
        borderStyle: 'solid'
    },
    icon: {
        height: 20,
        width: 20,
        margin: 5,
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

    const getBatteryPercentage = (props) => {
        if(props.data !== null){
            return props.data.basicData.batteryPercentage;
        }else return null;
    }

    const checkGps = (props) => {
        if(props.data !== null && props.data.locationData !== null){
            return "visible";
        }else return "hidden";
    }

    const checkNodes = (props) => {
        if(props.data !== null && props.data.nodeData !== null){
            return "visible";
        }else return "hidden";
    }

    const classes = useStyles();
    return (

        <div style={ {backgroundColor: switchColor(props)}}>
            <Grid direction="column" alignItems="center" container>
                <Grid item>  <Avatar className={classes.avatar}>{props.devId}</Avatar> </Grid>
                <Grid item>  <BatteryIndicator className={classes.battery} batteryPercentage={getBatteryPercentage(props)} /> </Grid>
                <Grid item>  <GpsNotFixedIcon className={classes.icon} style={ {visibility: checkGps(props)}} /> </Grid>
                <Grid item>  <SettingsInputComponentIcon className={classes.icon} style={ {visibility: checkNodes(props)}}/> </Grid>
            </Grid>
        </div>

    );
}
export default DeviceStatus;