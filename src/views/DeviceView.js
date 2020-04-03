import React from 'react';
import Paper from '@material-ui/core/Paper';
import ReactiveGauge from "../components/ReactiveGauge";
import PerformanceMeter from "../components/PerformanceMeter";
import AccelerationMeter from "../components/AccelerationMeter";

export default function DeviceView(passedProps) {
    let props = passedProps.initProps;
    

    return (
        <div>
            <Paper>
            <ReactiveGauge hr={props.packet === null ? null : props.packet.basicData.heartRate} height={250} width={250} left={10} top={10} margin={-20} />
            <AccelerationMeter axis="X" leftLabel="back" rightLabel="front" data={props.packet === null ? 0 : props.packet.basicData.accX}/>
            <AccelerationMeter axis="Y" leftLabel="left" rightLabel="right" data={props.packet === null ? 0 : props.packet.basicData.accY}/>
            <AccelerationMeter axis="Z" leftLabel="foot" rightLabel="head" data={props.packet === null ? 0 : props.packet.basicData.accZ}/>
            <PerformanceMeter icon activity={props.packet === null ? null : props.packet.basicData.activity} height={150} width={15}/>
            </Paper>
        </div>
    );
}