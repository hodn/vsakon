import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import colors from "../colors"
const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles(theme => ({

    paper: {
        padding: 20,
        marginBottom: 15
    },
    heading: {
        marginBottom: 10
    }

}));

export default function DeviceMapChip(props) {
    const [packet, setPacket] = React.useState(null);
    const [connected, setConnected] = React.useState(false);
    const user = props.team ? props.team.members[props.devId - 1] : null;

    const colorSwitch = (packet, connected) => {
        console.log(packet)
        if(!packet) return colors.grey;
        
        const isGpsUnit = packet.locationData ? true : false;
        const alarm = packet ? packet.deadMan : false;

        if (connected && isGpsUnit) {
            
            if (alarm){
                return colors.red;
            }
            else if (packet.locationData.detected){
                return colors.green;
            } 
            else return colors.yellow;
        }
        else return colors.grey;
    }

    const checkConnection = (packet) => {
        
        if (packet) {

            const time = packet.basicData.timestamp;
      
            // No data for 6 seconds - disconnected state
            if (Date.now() - time > 5000) {
                setConnected(false);
            }
        }
    }

    React.useEffect(() => {

        ipcRenderer.on(props.devId.toString(), (event, arg) => {
            setPacket(arg.packet);
            setConnected(true);
            setTimeout(checkConnection, 6000, arg.packet);
        });

        return () => {
            ipcRenderer.removeAllListeners();
        }
    }, [])


    return (
        <div>

            <Chip variant="outlined" avatar={<Avatar style={{ backgroundColor: colorSwitch(packet, connected), color: "black", fontWeight: "bold" }} > {props.devId} </Avatar>}
                label={user ? user.name + " " + user.surname : "User not loaded"} />

        </div>
    );
}
