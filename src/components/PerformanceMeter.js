import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SimpleMeter from './basics/SimpleMeter';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import colors from '../colors';

function PerformanceMeter(props) {

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

    const getActivityDisplay = (activity, settings) => {
        
        const maxScale = settings ? settings.metersMax.activity : 100;

        if (activity !== null) {
            if (activity >= maxScale) return 1; // maximum scale 
            if (activity < maxScale) return activity / maxScale; // into percent
        }else return 0;
    }

    return (

        <div>
          <Grid direction="column" alignItems="center" container>
                <Grid item className={classes.bar}>  <SimpleMeter percent={getActivityDisplay(props.activity, props.settings)} height={props.height} width={props.width} color={colors.green}/> </Grid>
                {props.icon && <Grid item> <AccessibilityIcon className={classes.icon}/> </Grid>}
            </Grid>
        </div>

    );
}
export default PerformanceMeter;