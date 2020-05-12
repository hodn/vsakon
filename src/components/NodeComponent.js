import React from 'react';
import NumericIndicator from './basics/NumericIndicator';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Thermometer from './Thermometer';
import PerformanceMeter from "./PerformanceMeter";

// Unique component for each additional node of device unit
export default function NodeComponent(props) {

    const nodeId = props.nodeId.toString();
    let disconnected = props.nodeData === null || props.nodeData["connected_" + nodeId] === false;

    return (

        <div style={{ width: 90 }}>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={1}
            >

                <Grid item xs={12}> <Chip size="small" variant="outlined" label={props.nodeId} /> </Grid>
                <Grid item> <PerformanceMeter icon activity={disconnected ? null : props.nodeData["activity_" + nodeId]} settings={props.settings} height={50} width={10} top={5} />  </Grid>
                <Grid item> <Thermometer showTemp temp={disconnected ? null : props.nodeData["tempSkin_" + nodeId]} settings={props.settings} height={50} width={10} top={5} />  </Grid>
                <Grid item>
                    <NumericIndicator variant={"subtitle1"} parameter={"Env"} value={disconnected ? "--" : props.nodeData["tempCloth_" + nodeId]} unit="°C" />
                    <NumericIndicator variant={"subtitle1"} parameter={"Hum"} value={disconnected ? "--" : props.nodeData["humidity_" + nodeId]} unit="%" />
                </Grid>

            </Grid>
        </div>
    );
}