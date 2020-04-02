import React from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import SegmentedMeter from './basics/SegmentedMeter';
import colors from '../colors';;


const useStyles = makeStyles({

    bar: {
        marginLeft: 5,
        marginRight: 5
    },
});


function AccelerationMeter(props) {

    const classes = useStyles();

    const getActivityDisplay = (activity) => {

        if (activity !== null) {
            if (activity >= 50) return 1; // maximum of the meter is 50 
            if (activity < 50) return activity / 50; // into percent
        } else return 0;
    }

    return (

        <div>
            <Typography variant="subtitle2" style={{ textAlign: "center" }}> back | front </Typography>
            <Grid justify="center" direction="row" alignItems="center" container>
                <Grid item className={classes.bar}>  <SegmentedMeter percent={getActivityDisplay(props.activity)} color={colors.green} rotation={180}/> </Grid>
                <Grid item className={classes.bar}>  <SegmentedMeter percent={getActivityDisplay(props.activity)} color={colors.green}/> </Grid>
            </Grid>
        </div>

    );
}
export default AccelerationMeter;