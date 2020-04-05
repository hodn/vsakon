import React from 'react';
import NumericIndicator from './basics/NumericIndicator';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Thermometer from './Thermometer';
import PerformanceMeter from "../components/PerformanceMeter";


export default function NodeDetail(passedProps) {
    let props = passedProps.initProps;

    return (
        <div>

            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={2}
            >

                <Grid item>
                    <Chip size="small" variant="outlined" label="1" />
                    <NumericIndicator variant={"subtitle1"} parameter={"Env"} value={props.packet === null ? "--" : props.packet.basicData.tempCloth} unit="°C" />
                    <NumericIndicator variant={"subtitle1"} parameter={"Hum"} value={props.packet === null ? "--" : props.packet.basicData.humidity} unit="%" />
                </Grid>
                <Grid item> <PerformanceMeter icon activity={props.packet === null ? null : props.packet.basicData.activity} height={50} width={10} top={10} />  </Grid>
                <Grid item> <Thermometer showTemp temp={props.packet === null ? null : props.packet.basicData.tempSkin} height={50} width={10} top={10} />  </Grid>
            </Grid>
        </div>
    );
}