import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import L from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function MapDialog(props) {
    const classes = useStyles();
    const [center, setCenter] = React.useState([50.06986, 14.42462]);
    const [markers, setMarkers] = React.useState([]);

    const getCurrentLocationTag = () => {
        if (props.location) {
            setCenter([props.location.lat, props.location.lon]);
            return (<Marker key={"0A"} position={center} icon={getIcon(0)}> </Marker>)
        }
    }

    const getMarkers = (flags) => {

        const markers = [];

        for (let index = 0; index < flags.length; index++) {
            
            newMarkers.push(
            <Marker key={index} position={flags[index].location.lat, flags[index].location.lon} icon={getIcon(index + 1)}>
                <Popup>
                    <h3>{flags[index].name}</h3>
                </Popup>
            </Marker>
            )

        }

        setMarkers(newMarkers);
    }

    const getIcon = (number) => {

        return new L.Icon({
            iconUrl: require('../markerIcons/number_' + number.toString() + '.png'),
            iconRetinaUrl: require('../markerIcons/number_' + number.toString() + '.png'),
            iconSize: new L.Point(32, 37),
        })
    }

    return (
        <div>
            <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar} color="secondary">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Mapa
            </Typography>
                        <IconButton edge="start" color="inherit" onClick={props.handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <DialogContent>
                    <Map style={{ width: '100%', height: '100%' }} center={center} zoom={20}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        {getCurrentLocationTag()}
                        {getMarkers(props.flags)}
                    </Map>
                </DialogContent>
            </Dialog>
        </div>
    );
}