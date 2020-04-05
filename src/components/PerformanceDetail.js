import React from 'react';
import Chip from '@material-ui/core/Chip';
import PerformanceMeter from "../components/PerformanceMeter";
import AccelerationMeter from "../components/AccelerationMeter";
import NumericIndicator from '../components/basics/NumericIndicator';
import Grid from '@material-ui/core/Grid';


export default function PerformanceDetail(passedProps) {
    let props = passedProps.initProps;

    return (
        <div>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={2}
            >

                <Grid item> <PerformanceMeter icon activity={props.packet === null ? null : props.packet.basicData.activity} height={130} width={18} top={10}/> </Grid>

                <Grid item>
                    <NumericIndicator justify={"flex-start"} parameter={"SP"} value={80} unit="%" />
                    <NumericIndicator justify={"flex-start"} parameter={"EE"} value={4.5} unit="W/kg" />
                    <NumericIndicator justify={"flex-start"} parameter={"ACT"} value={props.packet === null ? 0 : props.packet.basicData.activity} unit="nat" />
                    <Chip label="80 kg" variant="outlined" size="small"/>
                    <Chip label="24 y.o." variant="outlined" size="small"/>
                    <Chip label="31 ml/min/kg" variant="outlined" size="small"/>
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