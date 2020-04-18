import React from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SimpleMeter from './basics/SimpleMeter';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import colors from '../colors';;

function Thermometer(props) {

    const useStyles = makeStyles({

        root: {
    
            
        },
        bar: {
            marginTop: props.top
        },
    
        icon: {
            height: 20,
            width: 20,
            color: colors.grey,
        },
    });
    const classes = useStyles();

    const colorSwitch = (temp, settings) => {

        const lowerOptimum = settings ? settings.optimalTemp[0] : 30;
        const upperOptimum = settings ? settings.optimalTemp[1] : 35;
        
        if (temp < lowerOptimum) {

            return colors.blue;
        } else if (temp >= lowerOptimum && temp <= upperOptimum) {

            return colors.green;
        } else {
            return colors.yellow;
        }

    }

    const getTempDisplay = (temp) => {
        let percent = 0; // thermometer tops at 50 celsius
        const maxScale = 50;

        if (temp !== null && temp >= maxScale) percent = 1;
        if (temp !== null && temp < maxScale && temp > 0) percent = temp / maxScale;

        return percent;
    }
    
    return (

        <div>
          <Grid direction="column" alignItems="center" container>
                <Grid item className={classes.bar}>  <SimpleMeter  percent={getTempDisplay(props.temp)} color={colorSwitch(props.temp, props.settings)} height={props.height} width={props.width}/> </Grid>
                {props.showTemp && <Grid item> <Typography variant="subtitle1"> {props.temp === null ? "-" : props.temp} </Typography></Grid>}
                {props.icon && <Grid item> <WhatshotIcon className={classes.icon}/> </Grid>}
            </Grid>
        </div>

    );
}
export default Thermometer;