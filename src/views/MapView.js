import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MapDeviceChip from '../components/MapDeviceChip';
import L from 'leaflet';
import colors from '../colors';
const { ipcRenderer } = window.require('electron');

delete L.Icon.Default.prototype._getIconUrl;

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
  const [zoom, setZoom] = React.useState(10);
  const [activeTeam, setActiveTeam] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);

  React.useEffect(() => {

    ipcRenderer.send("get-active-team");
    ipcRenderer.on("active-team-loaded", (event, arg) => {
      setActiveTeam(arg);
    })

    return () => {
      ipcRenderer.removeAllListeners();
    }
  }, [])

  const setMarker = (packet, user) => {
    console.log(user)
    let newMarkers = [...markers];
    const devId = packet.basicData.devId;
    const position = [packet.locationData.latMins, packet.locationData.longMins];

    newMarkers[devId - 1] = (<Marker position={position} icon={getIcon(devId)}>
      <Popup>
        <h3>{user.name} {user.surname} </h3>
         Lat: {packet.locationData.latMins} <br/>
        Long: {packet.locationData.longMins}<br/>
         Fix: {packet.locationData.fix}<br/>
         Sat: {packet.locationData.sat}<br/>
         H: {packet.locationData.alt}<br/>
         HDOP: {packet.locationData.dilution}<br/>
      </Popup>
    </Marker>)

    setMarkers(newMarkers);
  }

  const getIcon = (devId) => {

    return new L.Icon({
      iconUrl: require('../markerIcons/number_' + devId.toString() + '.png'),
      iconRetinaUrl: require('../markerIcons/number_' + devId.toString() + '.png'),
      iconSize: new L.Point(32, 37),
    })
  }

  const removeMarker = (devId) => {
    let newMarkers = [...markers];
    newMarkers[devId - 1] = null;
    setMarkers(newMarkers);
  }

  const focusOnDevice = (packet) => {
    if (packet && packet.locationData && packet.locationData.detected) {
      const position = [packet.locationData.latMins, packet.locationData.longMins];
      setCenter(position);
      setZoom(30);
    }
  }

  const getDeviceChips = () => {

    let chips = [];

    for (let i = 0; i < 30; i++) {

      chips.push(
        <Grid xs={2} key={"item" + i} item>
          <MapDeviceChip devId={i + 1} team={activeTeam} setMarker={setMarker} removeMarker={removeMarker} focusOnDevice={focusOnDevice} />
        </Grid>
      );
    }

    return chips;
  }


  return (
    <div>
      <Paper style={{ marginBottom: 10 }}>
        <Map style={{ width: '100%', height: 740 * (window.innerHeight / 1080) }} center={center} zoom={zoom}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />

          {markers.map((marker) => {
            return marker;
          })}

        </Map>
      </Paper>

      <Paper elevation={3} style={{ padding: 15 }}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={1}
        >
          {getDeviceChips().map((component) => {
            return component;
          })}

        </Grid>
      </Paper>


    </div >
  );
}
