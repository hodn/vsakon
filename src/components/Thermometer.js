import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SimpleMeter from './SimpleMeter';
import colors from '../colors';;


const useStyles = makeStyles({

    root: {

        
    },
    bar: {
        'margin-top': 20
    },

    icon: {
        height: '20px',
        width: '20px',
        color: colors.grey,
    },
});


function Thermometer(props) {

    const classes = useStyles();

    const colorSwitch = (temp) => {

        if (temp > -30 && temp < +30) {

            return colors.blue;
        } else if (temp >= +30 && temp < +35) {

            return colors.green;
        } else {
            return colors.yellow;
        }

    }

    const getTempDisplay = (temp) => {
        let percent = 0; // thermometer tops at 50 celsius

        if (temp !== null && temp >= 50) percent = 1;
        if (temp !== null && temp < 50 && temp > 0) percent = temp / 50;

        return percent;
    }
    
    return (

        <div>
          <Grid direction="column" alignItems="center" container>
                <Grid item className={classes.bar}>  <SimpleMeter  percent={getTempDisplay(props.tempSkin)} color={colorSwitch(props.tempSkin)}/> </Grid>
                <Grid item> {props.tempSkin} </Grid>
            </Grid>
        </div>

    );
}
export default Thermometer;