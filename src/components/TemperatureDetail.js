import React from 'react';
import NumericIndicator from '../components/basics/NumericIndicator';
import Grid from '@material-ui/core/Grid';
import Thermometer from './Thermometer';
import { VerticalGridLines, XAxis, YAxis, HorizontalGridLines, LineSeries, FlexibleWidthXYPlot } from 'react-vis';

// Detailed online data visualization of temperature parameters
export default function TemperatureDetail(passedProps) {
    let props = passedProps.initProps;

    return (
        <div>

            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={1}
            >
                <Grid xs={1} item><Thermometer icon settings={props.settings} temp={props.packet === null ? null : props.packet.basicData.tempSkin} height={130} width={18} top={35} /></Grid>

                <Grid xs={3} item><NumericIndicator parameter={"Skin"} value={props.packet === null ? "--" : props.packet.basicData.tempSkin} unit="°C" />
                    <NumericIndicator parameter={"Env"} value={props.packet === null ? "--" : props.packet.basicData.tempCloth} unit="°C" />
                    <NumericIndicator parameter={"Humidity"} value={props.packet === null ? "--" : props.packet.basicData.humidity} unit="%" />
                </Grid>

                <Grid xs={8} item>

                    <FlexibleWidthXYPlot

                        height={220}
                        xType="time"
                        yDomain={[0, props.settings ? props.settings.metersMax.temp : 50]}
                    >
                        <HorizontalGridLines />
                        <VerticalGridLines />
                        <LineSeries
                            data={props.tempSkinGraph} />
                        <XAxis />
                        <YAxis title="°C" />
                    </FlexibleWidthXYPlot>

                </Grid>

            </Grid>

        </div>
    );
}