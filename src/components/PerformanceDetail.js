import React from 'react';
import Chip from '@material-ui/core/Chip';
import PerformanceMeter from "../components/PerformanceMeter";
import StehlikMeter from "../components/StehlikMeter";
import AccelerationMeter from "../components/AccelerationMeter";
import NumericIndicator from '../components/basics/NumericIndicator';
import Grid from '@material-ui/core/Grid';


export default function PerformanceDetail(passedProps) {
    const props = passedProps.initProps;
    const performanceDataAvailable =  props.packet === null ? false : (props.packet.performanceData !== null)

    return (
        <div>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={4}
            >

                <Grid item> <PerformanceMeter icon activity={props.packet === null ? null : props.packet.basicData.activity} height={130} width={18} top={10} /> </Grid>
                <Grid item>
                    <StehlikMeter
                        icon
                        stehlik={performanceDataAvailable ? props.packet.performanceData.stehlik : null}
                        height={130}
                        width={18}
                        top={10} />
                </Grid>

                <Grid item>
                    <NumericIndicator justify={"flex-start"} parameter={"SP"} value={performanceDataAvailable ? props.packet.performanceData.stehlik : "--"} unit="%" />
                    <NumericIndicator justify={"flex-start"} parameter={"EE"} value={performanceDataAvailable ? props.packet.performanceData.ee : "--"} unit="W/kg" />
                    <NumericIndicator justify={"flex-start"} parameter={"Activity"} value={props.packet === null ? "--" : props.packet.basicData.activity} unit="nat" />
                    <Chip label="80 kg" variant="outlined" size="small" />
                    <Chip label="24 y.o." variant="outlined" size="small" />
                    <Chip label="31 ml/min/kg" variant="outlined" size="small" />
                </Grid>

                <Grid item>
                    <AccelerationMeter axis="X" leftLabel="back" rightLabel="front" data={props.packet === null ? "-" : props.packet.basicData.accY} />
                    <AccelerationMeter axis="Y" leftLabel="left" rightLabel="right" data={props.packet === null ? "-" : props.packet.basicData.accY} />
                    <AccelerationMeter axis="Z" leftLabel="foot" rightLabel="head" data={props.packet === null ? "-" : props.packet.basicData.accZ} />
                </Grid>

            </Grid>


        </div>
    );
}