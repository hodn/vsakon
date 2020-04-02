import React from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import SegmentedMeter from './basics/SegmentedMeter';
import colors from '../colors';;


const useStyles = makeStyles({

    root: {
        marginTop: 10
    },
    
    bar: {
        marginLeft: 5,
        marginRight: 5
    },
});


function AccelerationMeter(props) {

    const classes = useStyles();
    
    
    const getNegativeDisplay = (acceleration) => {

        const maxScale = -10;
        
        if(acceleration < 0){
            if (acceleration <= maxScale) return 1; // maximum scale 
            if (acceleration > maxScale) return acceleration / maxScale; // into percent
        }else return 0;

    }

    const getPositiveDisplay = (acceleration) => {

        const maxScale = 10;
        
        if(acceleration >= 0){
            if (acceleration >= maxScale) return 1; // maximum scale 
            if (acceleration < maxScale) return acceleration / maxScale; // into percent
        }else return 0;
    }

    

    return (

        <div classes={classes.root}>
            <Typography border={1} variant="h6" style={{ textAlign: "center"}}> {props.axis}: {props.data} G </Typography>
            <Grid border={1} justify="center" direction="row" alignItems="center" container>
                <Grid item className={classes.bar}>  <SegmentedMeter percent={getNegativeDisplay(props.data)} color={colors.secondary} rotation={180} /> </Grid>
                <Grid item className={classes.bar}>  <SegmentedMeter percent={getPositiveDisplay(props.data)} color={colors.secondary} /> </Grid>
            </Grid>
            <Typography variant="subtitle2" style={{ textAlign: "center", color: colors.secondary }}>{props.leftLabel}  |  {props.rightLabel} </Typography>
        </div>

    );
}
export default AccelerationMeter;