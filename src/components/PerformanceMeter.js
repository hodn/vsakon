import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SimpleMeter from './basics/SimpleMeter';
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


function PerformanceMeter(props) {

    const classes = useStyles();

    const getActivityDisplay = (activity) => {
        
        const maxScale = 100;

        if (activity !== null) {
            if (activity >= maxScale) return 1; // maximum scale 
            if (activity < maxScale) return activity / maxScale; // into percent
        }else return 0;
    }

    return (

        <div>
          <Grid direction="column" alignItems="center" container>
                <Grid item className={classes.bar}>  <SimpleMeter percent={getActivityDisplay(props.activity)} color={colors.secondary}/> </Grid>
                {props.icon && <Grid item> <FlashOnIcon className={classes.icon}/> </Grid>}
            </Grid>
        </div>

    );
}
export default PerformanceMeter;