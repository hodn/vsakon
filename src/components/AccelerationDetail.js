import React from 'react';
import AccelerationMeter from "./AccelerationMeter";
import Grid from '@material-ui/core/Grid';


export default function AccelerationDetail(passedProps) {
    const props = passedProps.initProps;
    return (
        <div>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={4}
            >


                <Grid item>
                    <AccelerationMeter axis="X" leftLabel="back" rightLabel="front" data={props.packet === null ? "-" : props.packet.basicData.accY} />
                    <AccelerationMeter axis="Y" leftLabel="left" rightLabel="right" data={props.packet === null ? "-" : props.packet.basicData.accY} />
                    <AccelerationMeter axis="Z" leftLabel="foot" rightLabel="head" data={props.packet === null ? "-" : props.packet.basicData.accZ} />
                </Grid>

            </Grid>


        </div>
    );
}