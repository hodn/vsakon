import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SegmentedMeter from './basics/SegmentedMeter';
import FlashOnIcon from '@material-ui/icons/FlashOn';
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


function AccelerationMeter(props) {

    const classes = useStyles();

    const getActivityDisplay = (activity) => {
        
        if (activity !== null) {
            if (activity >= 50) return 1; // maximum of the meter is 50 
            if (activity < 50) return activity / 50; // into percent
        }else return 0;
    }

    return (

        <div>
          <Grid direction="column" alignItems="center" container>
                <Grid item className={classes.bar}>  < SegmentedMeter percent={getActivityDisplay(props.activity)} color={colors.green}/> </Grid>
                <Grid item> <FlashOnIcon className={classes.icon}/> </Grid>
            </Grid>
        </div>

    );
}
export default PerformanceMeter;