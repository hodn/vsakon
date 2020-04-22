import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SimpleMeter from './basics/SimpleMeter';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import colors from '../colors';

function StehlikMeter(props) {

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

    const getStehlikDisplay = (stehlik, settings) => {

        const maxScale = settings ? settings.metersMax.stehlik : 180;;

        if (stehlik !== null) {
            if (stehlik >= maxScale) return 1; // maximum scale 
            if (stehlik < maxScale) return stehlik / maxScale; // into percent
        } else return 0;
    }

    const colorSwitch = (stehlik) => {

        if (stehlik < 100) return colors.blue;
        else if (stehlik >= 100 && stehlik < 130) return colors.green;
        else if (stehlik >= 130 && stehlik < 150) return colors.yellow;
        else if (stehlik >= 150) return colors.red;

    }

    return (

        <div>
            <Grid direction="column" alignItems="center" container>
                <Grid item className={classes.bar}>
                    <SimpleMeter percent={getStehlikDisplay(props.stehlik, props.settings)} height={props.height} width={props.width} color={colorSwitch(props.stehlik)} />
                </Grid>
                {props.icon && <Grid item> <FlashOnIcon className={classes.icon} /> </Grid>}
            </Grid>
        </div>

    );
}
export default StehlikMeter;