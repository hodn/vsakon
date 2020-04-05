import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
//import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DeviceStatus from './DeviceStatus';
import DeviceView from '../views/DeviceView';
import colors from '../colors';

const useStyles = makeStyles(theme => ({

  appBar: {
    position: 'relative',
  },

  avatar: {
    height: 30,
    width: 30,
    fontSize: 15,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: 'black',
    borderColor: 'black',
    borderStyle: 'solid'
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeviceDialog(props) {
  const classes = useStyles();

  const switchColor = (props) => {

    let connection = props.connected === true;
    let alarmOn = props.packet === null ? false : props.packet.deadMan;
            
    if (connection) {
        
        if (alarmOn) {
            return colors.red;
        }else {
            return colors.green;
        }

    } else {

        return colors.grey;
    }



}

  return (
    <div>
      <Dialog style={{padding: 10}} fullScreen open={props.open} TransitionComponent={Transition}>
        <AppBar style={{ backgroundColor: switchColor(props), margin: 0 }} className={classes.appBar}>
          <Toolbar>
          <DeviceStatus direction={"row"} devId={props.devId} connected={props.connected} packet={props.packet} name={"Miroslav Novotný"}/>
            <IconButton color="inherit" onClick={props.close} style={{ marginLeft: "auto", color:"black" }} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <DeviceView initProps={props}/>
        </DialogContent>
      </Dialog>
    </div>
  );
}
