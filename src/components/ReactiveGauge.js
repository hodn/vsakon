import React from 'react';
import Gauge from './Gauge';

function ReactiveGauge(props) {
    
    const colorSwitch = (hr) => {

        if (hr >= 50 && hr <= 110) {

            return "#7FFF00";
        } else if (hr < 40 || hr > 160) {

            return "#FF0000";
        } else {
            return "#FFFF00";
        }

    }

    return (


        <div>
            <Gauge value={props.hr} max={220} width={window.innerWidth * 0.078125} height={window.innerHeight * 0.12037} color={colorSwitch(props.hr)} />
        </div>

    );
}
export default ReactiveGauge;