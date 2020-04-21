import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Paper from '@material-ui/core/Paper';
import MapDeviceChip from '../components/MapDeviceChip';
import L from 'leaflet';
import colors from '../colors';
const { ipcRenderer } = window.require('electron');

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const useStyles = makeStyles(theme => ({

  paper: {
    padding: 20,
    marginBottom: 15
  },
  heading: {
    marginBottom: 10
  }

}));

export default function MapView(props) {
  const [center, setCenter] = React.useState([50.06986, 14.42462]);
  const [activeTeam, setActiveTeam] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);

  const setMarker = (packet, user) => {
    console.log("MARKE")
  }

  const removeMarker = (devId) => {
    console.log(devId)
  }

  const focusOnDevice = (packet) => {
    console.log(packet.deadMan)
  }

  React.useEffect(() => {
    
    ipcRenderer.send("get-active-team");
    ipcRenderer.on("active-team-loaded", (event, arg) => {
      
      setActiveTeam(arg);
    })
    
    return () => {
      ipcRenderer.removeAllListeners();
    }
  }, [])


  return (
    <div>
      <Paper style={{ padding: 10 }}>
        <Map style={{ width: '100%', height: '600px' }} center={center} zoom={10}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={center}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        </Map>
      </Paper>

      <MapDeviceChip devId={29} team={activeTeam} setMarker={setMarker} removeMarker={removeMarker} focusOnDevice={focusOnDevice}/>
    </div>
  );
}
