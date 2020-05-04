import React from 'react';
import Chip from '@material-ui/core/Chip';
import PerformanceMeter from "../components/PerformanceMeter";
import StehlikMeter from "../components/StehlikMeter";
import NumericIndicator from '../components/basics/NumericIndicator';
import Grid from '@material-ui/core/Grid';
import { VerticalGridLines, XAxis, YAxis, HorizontalGridLines, LineSeries, FlexibleWidthXYPlot } from 'react-vis';

// Display of performance data 
export default function PerformanceDetail(passedProps) {
    const props = passedProps.initProps;
    const performanceDataAvailable = props.packet === null ? false : (props.packet.performanceData !== null)

    return (
        <div>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={1}
            >

                <Grid xs={1} item> <PerformanceMeter icon activity={props.packet === null ? null : props.packet.basicData.activity} settings={props.settings} height={130} width={18} top={30} /> </Grid>
                <Grid xs={1} item>
                    <StehlikMeter
                        icon
                        stehlik={performanceDataAvailable ? props.packet.performanceData.stehlik : null}
                        settings={props.settings}
                        height={130}
                        width={18}
                        top={30} />
                </Grid>

                <Grid xs={3} item>
                    <NumericIndicator justify={"flex-start"} parameter={"SP"} value={performanceDataAvailable ? props.packet.performanceData.stehlik : "--"} unit="%" />
                    <NumericIndicator justify={"flex-start"} parameter={"EE"} value={performanceDataAvailable ? props.packet.performanceData.ee : "--"} unit="W/kg" />
                    <NumericIndicator justify={"flex-start"} parameter={"Activity"} value={props.packet === null ? "--" : props.packet.basicData.activity} unit="nat" />
                    <Chip label={props.user !== null ? props.user.weight + " kg" : null} variant="outlined" size="small" />
                    <Chip label={props.user !== null ? props.user.age + " y.o." : null} variant="outlined" size="small" />
                    <Chip label={props.user !== null ? (props.user.vMax / props.user.weight).toFixed(0) + " ml/min/kg" : null} variant="outlined" size="small" />
                </Grid>

                <Grid xs={7} item>

                    <FlexibleWidthXYPlot

                        height={220}
                        xType="time"
                        yDomain={[0, props.settings? props.settings.metersMax.activity * 3 : 500]}
                    >
                        <HorizontalGridLines />
                        <VerticalGridLines />
                        <LineSeries
                            data={props.activityGraph} />
                        <XAxis />
                        <YAxis title="nat" />
                    </FlexibleWidthXYPlot>

                </Grid>
            </Grid>


        </div>
    );
}