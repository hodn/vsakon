import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import colors from "../colors"

const { ipcRenderer } = window.require('electron');

class MapDeviceChip extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      packet: null,
      connected: false,
      user: null
    }

    this.checkDeviceConnection = this.checkDeviceConnection.bind(this);
    this.colorSwitch = this.colorSwitch.bind(this);

  }

  componentDidMount() {

    this._isMounted = true;
    
    const user = this.props.team ? this.props.team.members[this.props.devId - 1] : null;
    this._isMounted && this.setState((state, props) => ({
      user
    }))
    
    // Listener for data for the exact device
    ipcRenderer.on(this.props.devId.toString(), (event, arg) => {

      // Connection checker
      setTimeout(this.checkDeviceConnection, 6000);

      const packet = arg.packet;
      const connected = true;

      this._isMounted && this.setState((state, props) => ({
        packet,
        connected
      }))

      if(packet.locationData && packet.locationData.detected) this.props.setMarker(packet, this.state.user);

    })

  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
  }

  checkDeviceConnection() {

    // Already connected
    if (this.state.packet !== null) {

      const time = this.state.packet.basicData.timestamp;

      // No data for 6 seconds - disconnected state
      if (Date.now() - time > 5000) {

        this.props.removeMarker(this.props.devId)
        
        this._isMounted && this.setState((state, props) => ({
          connected: false,
          packet: null,
        }))

      }

    }


  }

  colorSwitch(packet, connected){
    if (!packet) return colors.grey;

    const isGpsUnit = packet.locationData ? true : false;
    const alarm = packet ? packet.deadMan : false;

    if (connected && isGpsUnit) {

        if (alarm) {
            return colors.red;
        }
        else if (packet.locationData.detected) {
            return colors.green;
        }
        else return colors.yellow;
    }
    else return colors.grey;
}

  // What the actual component renders
  render() {

    const { classes } = this.props;

    return (
      
      <div>
        <Chip variant="outlined" 
        avatar={<Avatar style={{ backgroundColor: this.colorSwitch(this.state.packet, this.state.connected), color: "black", fontWeight: "bold" }}> {this.props.devId} </Avatar>}
        label={this.state.user ? this.state.user.name + " " + this.state.user.surname : "User not loaded"} 
        onClick={() => this.props.focusOnDevice(this.state.packet)} />
      </div>

    );
  }

}


export default MapDeviceChip;

