import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SimpleMeter from './SimpleMeter';
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
    return (

        <div>
          <Grid direction="column" alignItems="center" container>
                <Grid item className={classes.bar}>  <SimpleMeter  color='#a5d6a7'/> </Grid>
                <Grid item> <FlashOnIcon className={classes.icon}/> </Grid>
            </Grid>
        </div>

    );
}
export default PerformanceMeter;