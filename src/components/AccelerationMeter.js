import React from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import SegmentedMeter from './basics/SegmentedMeter';
import NumericIndicator from './basics/NumericIndicator';
import colors from '../colors';


function AccelerationMeter(props) {

    const useStyles = makeStyles({

        root: {
            
        },
        
        bar: {
            marginLeft: 5,
            marginRight: 5
        },
    });
    
    const classes = useStyles();
    
    // Helper functions for calculating the fill of the meter
    const getNegativeDisplay = (acceleration, settings) => {

        const maxScale = settings ? (settings.metersMax.acc * -1) : (-10);
        
        if(acceleration < 0){
            if (acceleration <= maxScale) return 1; // maximum scale 
            if (acceleration > maxScale) return acceleration / maxScale; // into percent
        } else return 0;

    }

    const getPositiveDisplay = (acceleration, settings) => {

        const maxScale = settings ? settings.metersMax.acc : 10;
        
        if(acceleration >= 0){
            if (acceleration >= maxScale) return 1; // maximum scale 
            if (acceleration < maxScale) return acceleration / maxScale; // into percent
        } else return 0;
    }

    

    return (

        <div className={classes.root}>
            <NumericIndicator align={"center"} parameter={props.axis} value={props.data} unit="G"/>
            <Typography variant="body2" style={{color: colors.secondary, textAlign: "center"}}>{props.leftLabel}  |  {props.rightLabel} </Typography>
            <Grid justify="center" direction="row" alignItems="center" container>
                <Grid item className={classes.bar}>  <SegmentedMeter percent={getNegativeDisplay(props.data, props.settings)} color={colors.secondary} rotation={180} /> </Grid>
                <Grid item className={classes.bar}>  <SegmentedMeter percent={getPositiveDisplay(props.data, props.settings)} color={colors.secondary} /> </Grid>
            </Grid>
            
        </div>

    );
}
export default AccelerationMeter;