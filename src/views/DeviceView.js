import React from 'react';
import PerformanceDetail from '../components/PerformanceDetail';
import TemperatureDetail from '../components/TemperatureDetail';
import DeviceControl from '../components/DeviceControl';
import ReactiveGauge from "../components/ReactiveGauge";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import NodeDetail from '../components/NodeDetail';

export default function DeviceView(passedProps) {
    let props = passedProps.initProps;

    const useStyles = makeStyles({

        root: {


        },
        bar: {
            marginTop: props.top
        },

        paper: {
            padding: 20
        },
    });
    const classes = useStyles();


    return (
        <div>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={3}
            >

                <Grid item>
                    <Paper className={classes.paper} elevation={5}>
                        <ReactiveGauge hr={props.packet === null ? null : props.packet.basicData.heartRate} height={250} width={250} left={0} top={40} margin={-20} />
                    </Paper>
                </Grid>

                <Grid item>
                    <Paper className={classes.paper} elevation={5}><PerformanceDetail initProps={props} /></Paper>
                </Grid>

                <Grid item>
                    <Paper className={classes.paper} elevation={5}><TemperatureDetail initProps={props} /></Paper>
                </Grid>

                <Grid item>
                    <Paper className={classes.paper} elevation={5}><DeviceControl initProps={props} /></Paper>
                </Grid>

                <Grid item>
                    <Paper className={classes.paper} elevation={5}><NodeDetail initProps={props} /></Paper>
                </Grid>

            </Grid>
        </div>
    );
}