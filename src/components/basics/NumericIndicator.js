import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import colors from '../../colors';

export default function NumericIndicator(props) {

    return (
        <div>
            <Grid justify="center" direction="row" alignItems="center" container>
                <Grid item > <Typography variant="h6" style={{ color: colors.secondary, marginRight: 5 }}>{props.parameter}:  </Typography> </Grid>
                <Grid item > <Typography variant="h6"> {props.value + " " + props.unit}  </Typography> </Grid>
            </Grid>
        </div>
    );
}