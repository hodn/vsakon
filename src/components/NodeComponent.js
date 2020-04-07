import React from 'react';
import NumericIndicator from './basics/NumericIndicator';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Thermometer from './Thermometer';
import PerformanceMeter from "./PerformanceMeter";

export default function NodeComponent(props) {

    let disconnected = props.nodeData === null || props.nodeData[props.nodeId].connected === false;

    return (
        <div>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={1}
            >

                <Grid item>
                    <Chip size="small" variant="outlined" label={props.nodeId} />
                    <NumericIndicator variant={"subtitle1"} parameter={"Env"} value={disconnected ? "--" : props.nodeData[props.nodeId].tempCloth} unit="°C" />
                    <NumericIndicator variant={"subtitle1"} parameter={"Hum"} value={disconnected ? "--" : props.nodeData[props.nodeId].humidity} unit="%" />
                </Grid>
                <Grid item> <PerformanceMeter icon activity={disconnected  ? null : props.nodeData[props.nodeId].activity} height={50} width={10} top={5} />  </Grid>
                <Grid item> <Thermometer showTemp temp={disconnected ? null : props.nodeData[props.nodeId].tempSkin} height={50} width={10} top={10} />  </Grid>
            </Grid>
        </div>
    );
}