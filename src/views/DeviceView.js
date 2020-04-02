import React from 'react';
import Paper from '@material-ui/core/Paper';
import ReactiveGauge from "../components/ReactiveGauge";
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import PerformanceMeter from "../components/PerformanceMeter";
import AccelerationMeter from "../components/AccelerationMeter";

export default function DeviceView(passedProps) {
    let props = passedProps.initProps;
    

    return (
        <div>
            <Paper>
            <Typography variant="h6">Miroslav Novotný</Typography>
            <Chip label="24 let" variant="outlined" />
            <Chip label="80 kg" variant="outlined" />
            <Chip label="31 ml/min/kg" variant="outlined" />
            <ReactiveGauge hr={props.packet === null ? null : props.packet.basicData.heartRate} height={200} width={200} />
            <AccelerationMeter axis="X" leftLabel="back" rightLabel="front" data={props.packet === null ? 0 : props.packet.basicData.accX}/>
            <AccelerationMeter axis="Y" leftLabel="left" rightLabel="right" data={props.packet === null ? 0 : props.packet.basicData.accY}/>
            <AccelerationMeter axis="Z" leftLabel="foot" rightLabel="head" data={props.packet === null ? 0 : props.packet.basicData.accZ}/>
            <PerformanceMeter activity={props.packet === null ? null : props.packet.basicData.activity}/>
            </Paper>
        </div>
    );
}