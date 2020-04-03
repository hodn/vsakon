import React from 'react';
import PerformanceDetail from '../components/PerformanceDetail';
import TemperatureDetail from '../components/TemperatureDetail';
import DeviceControl from '../components/DeviceControl';

export default function DeviceView(passedProps) {
    let props = passedProps.initProps;
    

    return (
        <div>
            <PerformanceDetail initProps={props}/>
            <TemperatureDetail initProps={props}/>
            <DeviceControl initProps={props}/>
        </div>
    );
}