import React from 'react';
import PerformanceDetail from '../components/PerformanceDetail';
import AccelerationDetail from '../components/AccelerationDetail';
import TemperatureDetail from '../components/TemperatureDetail';
import DeviceControl from '../components/DeviceControl';
import ReactiveGauge from "../components/ReactiveGauge";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import NodeDetail from '../components/NodeDetail';
import { VerticalGridLines, XAxis, YAxis, HorizontalGridLines, LineSeries, FlexibleWidthXYPlot } from 'react-vis';

export default function DeviceView(passedProps) {
    let props = passedProps.initProps;

    const useStyles = makeStyles({

        control: {


        },
        topRow: {
            height: 220,
            padding: 20
        },

        nodes: {
            padding: 15
        },

    });
    const classes = useStyles();


    return (
        <div>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={1}
            >

                <Grid xs={6} item>
                    <Paper className={classes.topRow} elevation={5}>
                        <Grid container>
                            <Grid item xs={4}>
                                <ReactiveGauge hr={props.packet === null ? null : props.packet.basicData.heartRate} user={props.user} height={250} width={250} left={0} top={40} margin={-20} />
                            </Grid>
                            <Grid xs={8} item>

                                <FlexibleWidthXYPlot

                                    height={200}
                                    xType="time"
                                    yDomain={[0, 220]}
                                    style={{ borderStyle: 'solid' }}
                                >
                                    <HorizontalGridLines />
                                    <VerticalGridLines />
                                    <LineSeries
                                        data={null} />
                                    <XAxis />
                                    <YAxis title="BPM" />
                                </FlexibleWidthXYPlot>

                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid xs={6} item>
                    <Paper className={classes.topRow} elevation={5}><PerformanceDetail initProps={props} /></Paper>
                </Grid>

                <Grid xs={6} item>
                    <Paper className={classes.topRow} elevation={5}><TemperatureDetail initProps={props} /></Paper>
                </Grid>

                <Grid xs={6} item>
                    <Paper className={classes.topRow} elevation={5}><AccelerationDetail initProps={props} /></Paper>
                </Grid>

                <Grid xs={12} item>
                    <Paper className={classes.nodes} elevation={5}><NodeDetail initProps={props} /></Paper>
                </Grid>

                <Grid xs={12} item>
                    <DeviceControl initProps={props} />
                </Grid>

            </Grid>
        </div>
    );
}