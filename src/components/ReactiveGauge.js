import React from 'react';
import Gauge from './basics/Gauge';
import colors from '../colors';

function ReactiveGauge(props) {

    const colorSwitch = (hr, user) => {

        const hrRest = user ? parseInt(user.hrRest, 10) : 70;
        const hrMax = user ? parseInt(user.hrMax, 10) : 150;
        
        const lowerOptimum = (hrRest + 40) / 2;
        const upperOptimum = (hrMax + hrRest) / 2;
        
        if (hr >= lowerOptimum && hr <= upperOptimum) {

            return colors.green;
        } else if (hr < 40 || hr > hrMax) {

            return colors.red;
        } else {
            return colors.yellow;
        }

    }

    const parseHeartRate = (hr) => {

        if (hr !== null) {
            if (hr <= 2) return null; // Lead off
            if (hr === 3) return 0; // Lead on
            if (hr > 3) return hr;
        }else return " ";
    }

    return (


        <div>
            <Gauge value={parseHeartRate(props.hr)} max={220} width={props.width} height={props.height} color={colorSwitch(props.hr, props.user)} 
            left={props.left} top={props.top} margin={props.margin} valueFormatter={value => {
                if (value === null) {
                  return '-';
                }

                if (value === 0) {
                  return '+';
                }

                return value.toString();
              }}/>
        </div>

    );
}
export default ReactiveGauge;