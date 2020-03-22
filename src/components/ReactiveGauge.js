import React from 'react';
import Gauge from './Gauge';
import SimpleMeter from './SimpleMeter';


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
            <Gauge value={props.hr} max={220} width={160} height={130} color={colorSwitch(props.hr)} />
        </div>

    );
}
export default ReactiveGauge;