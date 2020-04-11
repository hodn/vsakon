import React from 'react';
import NumericIndicator from './basics/NumericIndicator';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Thermometer from './Thermometer';
import PerformanceMeter from "./PerformanceMeter";

export default function NodeComponent(props) {

    const nodeId = props.nodeId.toString();
    let disconnected = props.nodeData === null || props.nodeData["connected_" + nodeId] === false;
    
    return(

        <div>
            <Grid
                container
                direction="row"s
                justify="center"
                alignItems="center"
                spacing={1}
            >

                <Grid item>
                    <Chip size="small" variant="outlined" label={props.nodeId} />
                    <NumericIndicator variant={"subtitle1"} parameter={"Env"} value={disconnected ? "--" : props.nodeData["tempCloth_" + nodeId]} unit="°C" />
                    <NumericIndicator variant={"subtitle1"} parameter={"Hum"} value={disconnected ? "--" : props.nodeData["humidity_" + nodeId]} unit="%" />
                </Grid>
                <Grid item> <PerformanceMeter icon activity={disconnected  ? null : props.nodeData["activity_" + nodeId]} height={50} width={10} top={5} />  </Grid>
                <Grid item> <Thermometer showTemp temp={disconnected ? null : props.nodeData["tempSkin_" + nodeId]} height={50} width={10} top={10} />  </Grid>
            </Grid>
        </div>
    );
}