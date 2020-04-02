import React from 'react';
import Battery20 from '@material-ui/icons/Battery20';
import Battery30 from '@material-ui/icons/Battery30';
import Battery50 from '@material-ui/icons/Battery50';
import Battery80 from '@material-ui/icons/Battery80';
import BatteryFull from '@material-ui/icons/BatteryFull';
import BatteryAlert from '@material-ui/icons/BatteryAlert';


function BatteryIndicator(props) {
    
    if(props.batteryPercentage !== null){
        let battery = props.batteryPercentage;
        
        if (battery > 90) return <BatteryFull className={props.className}/> ;
        if (battery > 50 && battery <= 90) return <Battery80 className={props.className}/> ;
        if (battery > 30 && battery <= 50) return <Battery50 className={props.className}/> ;
        if (battery > 20 && battery <= 30) return <Battery30 className={props.className}/> ;
        if (battery > 13 && battery <= 20) return <Battery20 className={props.className}/> ;
        if (battery <= 13) return <BatteryAlert className={props.className}/> ;
    }else return <BatteryAlert className={props.className} style={ {visibility: 'hidden'}}/>;
   
}
export default BatteryIndicator;