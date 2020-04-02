import React from 'react';
import Paper from '@material-ui/core/Paper';
import ReactiveGauge from "../components/ReactiveGauge";
import PerformanceMeter from "../components/PerformanceMeter";
import AccelerationMeter from "../components/AccelerationMeter";

export default function DeviceView(passedProps) {
    //const [anchorEl, setAnchorEl] = React.useState(null);
    let props = passedProps.initProps;
    

    return (
        <div>
            <Paper>
            <ReactiveGauge hr={props.packet === null ? null : props.packet.basicData.heartRate} height={200} width={200} />
            <PerformanceMeter activity={props.packet === null ? null : props.packet.basicData.activity}/>
            <AccelerationMeter data={props.packet === null ? null : props.packet.basicData}/>
            </Paper>
        </div>
    );
}