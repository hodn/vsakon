import React from 'react';
import Gauge from './Gauge';
import Meter from './Meter';


function GaugeComponent(props) {
    
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
            <Gauge value={props.hr} max={220} width={200} height={200} color={colorSwitch(props.hr)} />
            <Meter percent={props.motionX / 200} animate={true} width={200}/>
        </div>

    );
}
export default GaugeComponent;