import React from 'react';
import { Avatar } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BatteryIndicator from './BatteryIndicator';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import Typography from '@material-ui/core/Typography';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import Tooltip from '@material-ui/core/Tooltip';
import colors from '../colors';


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
        color: "black"
    },

    battery: {
        height: 30,
        width: 30,
        margin: 5,
        color: "black"
    },
    name: {
        color: "black",
        marginLeft: 5
    }
});


function DeviceStatus(props) {

    const switchColor = (props) => {

        let connection = props.connected === true;
        let alarmOn = props.packet === null ? false : props.packet.deadMan;

        if (connection) {

            if (alarmOn) {
                return colors.red;
            } else {
                return colors.green;
            }

        } else {

            return colors.grey;
        }



    }

    const getBatteryPercentage = (props) => {
        if (props.packet !== null) {
            return props.packet.basicData.batteryPercentage;
        } else return null;
    }

    const checkGps = (props) => {
        if (props.packet !== null && props.packet.locationData !== null) {
            return "visible";
        } else return "hidden";
    }

    const checkNodes = (props) => {
        if (props.packet !== null && props.packet.nodeData !== null) {
            return "visible";
        } else return "hidden";
    }

    const classes = useStyles();
    return (

        <div style={{ backgroundColor: switchColor(props) }}>
            <Grid direction={props.direction} alignItems="center" container>
                <Grid item>
                    <Tooltip title={props.packet === null? "No receiver" : props.packet.basicData.port}>
                        <Avatar className={classes.avatar}>{props.devId}</Avatar>
                    </Tooltip>
                </Grid>
                <Grid item>  <BatteryIndicator className={classes.battery} batteryPercentage={getBatteryPercentage(props)} /> </Grid>
                <Grid item>  <GpsNotFixedIcon className={classes.icon} style={{ visibility: checkGps(props) }} /> </Grid>
                <Grid item>  <SettingsInputComponentIcon className={classes.icon} style={{ visibility: checkNodes(props) }} /> </Grid>
                {props.name && <Grid item>  <Typography className={classes.name} variant="h6" >{" | " + props.name}</Typography> </Grid>}
            </Grid>
        </div>

    );
}
export default DeviceStatus;