import React from 'react';
import NumericIndicator from '../components/basics/NumericIndicator';
import Grid from '@material-ui/core/Grid';
import Thermometer from './Thermometer';


export default function TemperatureDetail(passedProps) {
    let props = passedProps.initProps;

    return (
        <div>

            <Grid
                container
                direction="row"
                justify="start"
                alignItems="center"
                spacing={4}
            >
                <Grid item><Thermometer icon temp={props.packet === null ? null : props.packet.basicData.tempSkin} height={130} width={18} /></Grid>
                
                <Grid item><NumericIndicator align={"start"} parameter={"Skin"} value={props.packet === null ? "--" : props.packet.basicData.tempSkin} unit="°C" />
                    <NumericIndicator align={"start"} parameter={"Environment"} value={props.packet === null ? "--" : props.packet.basicData.tempCloth} unit="°C" />
                    <NumericIndicator align={"start"} parameter={"Humidity"} value={props.packet === null ? "--" : props.packet.basicData.humidity} unit="%" />
                </Grid>

            </Grid>

        </div>
    );
}