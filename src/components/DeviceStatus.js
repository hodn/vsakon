import React from 'react';
import { Avatar } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BatteryIndicator from './BatteryIndicator';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import Typography from '@material-ui/core/Typography';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import Tooltip from '@material-ui/core/Tooltip';
import colors from '../colors';

function DeviceStatus(props) {

    
    const useStyles = makeStyles({

        root: {
    
            borderStyle: 'solid',
        },
        avatar: {
            height: props.height? 30 * props.height : 30,
            width: props.width? 30 * props.width : 30,
            fontSize: props.width? 15 * props.width : 15,
            fontWeight: 'bold',
            margin: props.width? 8 * props.width : 8,
            backgroundColor: 'transparent',
            color: 'black',
            borderColor: 'black',
            borderStyle: 'solid'
        },
        icon: {
            height: props.height? 20 * props.height : 20,
            width: props.width? 20 * props.width : 20,
            margin: props.width? 5 * props.width : 5,
            color: "black"
        },
    
        battery: {
            height: props.height? 30 * props.height : 30,
            width: props.width? 30 * props.width : 30,
            margin: props.width? 5 * props.width : 5,
            color: "black"
        },
        name: {
            color: "black",
            marginLeft: 5
        }
    });
    
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

    const checkNodes = (props) => {
        if (props.packet !== null && props.packet.nodeData !== null) {
            return "visible";
        } else return "hidden";
    }

    const getGpsIcon = (props) => {
        if (props.packet !== null && props.packet.locationData !== null) {

            if (props.packet.locationData.detected) return <GpsFixedIcon className={classes.icon} />
            else return <GpsNotFixedIcon className={classes.icon} />
        } else return <GpsNotFixedIcon className={classes.icon} style={{ visibility: "hidden" }} />
    }

    const classes = useStyles();
    return (

        <div style={{ backgroundColor: switchColor(props)}}>
            <Grid direction={props.direction} alignItems="center" container>
                <Grid item>
                    <Tooltip title={props.packet === null ? "No receiver" : props.packet.basicData.port}>
                        <Avatar className={classes.avatar}>{props.devId}</Avatar>
                    </Tooltip>
                </Grid>
                <Grid item>  <BatteryIndicator className={classes.battery} batteryPercentage={getBatteryPercentage(props)} /> </Grid>
                <Grid item>   {getGpsIcon(props)}  </Grid>
                <Grid item>  <SettingsInputComponentIcon className={classes.icon} style={{ visibility: checkNodes(props) }} /> </Grid>
                {props.name && <Grid item>  <Typography className={classes.name} variant="h6" >{" | " + props.name}</Typography> </Grid>}
            </Grid>
        </div>

    );
}
export default DeviceStatus;