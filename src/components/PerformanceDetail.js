import React from 'react';
import Chip from '@material-ui/core/Chip';
import ReactiveGauge from "../components/ReactiveGauge";
import PerformanceMeter from "../components/PerformanceMeter";
import AccelerationMeter from "../components/AccelerationMeter";
import NumericIndicator from '../components/basics/NumericIndicator';
import Grid from '@material-ui/core/Grid';


export default function PerformanceDetail(passedProps) {
    let props = passedProps.initProps;

    return (
        <div style={{borderStyle: "solid"}}>
            <Grid
                container
                direction="row"
                justify="start"
                alignItems="center"
                spacing={4}
            >
                <Grid item>
                    <Chip label="80 kg" variant="outlined" />
                    <Chip label="24 y.o." variant="outlined" />
                    <Chip label="31 ml/min/kg" variant="outlined" />
                    <ReactiveGauge hr={props.packet === null ? null : props.packet.basicData.heartRate} height={250} width={250} left={10} top={30} margin={-20} />
                </Grid>

                <Grid item> <PerformanceMeter icon activity={props.packet === null ? null : props.packet.basicData.activity} height={130} width={18} /> </Grid>

                <Grid item>
                    <NumericIndicator align={"start"} parameter={"SP"} value={80} unit="%" />
                    <NumericIndicator align={"start"} parameter={"EE"} value={4.5} unit="W/kg" />
                    <NumericIndicator align={"start"} parameter={"ACT"} value={props.packet === null ? 0 : props.packet.basicData.activity} unit="nat" />
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