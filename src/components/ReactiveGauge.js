import React from 'react';
import Gauge from './Gauge';
import colors from '../colors';

function ReactiveGauge(props) {
    
    const colorSwitch = (hr) => {

        if (hr >= 50 && hr <= 110) {

            return colors.green;
        } else if (hr < 40 || hr > 160) {

            return colors.red;
        } else {
            return colors.yellow;
        }

    }

    return (


        <div>
            <Gauge value={props.hr} max={220} width={150} height={140} color={colorSwitch(props.hr)} />
        </div>

    );
}
export default ReactiveGauge;