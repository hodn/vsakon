import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';
import colors from '../colors';

const { ipcRenderer } = window.require('electron');
const useStyles = makeStyles(theme => ({

  appBar: {
    position: 'relative',
    backgroundColor: colors.secondary
  },
  closeButton:{
    marginLeft: "auto", 
    color:"white" 
  },
  avatar: {
    height: 30,
    width: 30,
    fontSize: 15,
    fontWeight: 'bold',
    margin: 8,
    marginRight: 30,
    backgroundColor: 'transparent',
    color: 'white',
    borderColor: 'white',
    borderStyle: 'solid'
},

}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HistoryDialog(props) {
  const classes = useStyles();
  const [heartRate, setHeartRate] = React.useState([]);
  const [activity, setActivity] = React.useState([]);
  const [accX, setAccX] = React.useState([]);
  const [accY, setAccY] = React.useState([]);
  const [accZ, setAccZ] = React.useState([]);
  const [tempSkin, setTempSkin] = React.useState([]);
  const [tempCloth, setTempCloth] = React.useState([]);
  const [humidity, setHumidity] = React.useState([]);

  React.useEffect(() => {
    ipcRenderer.on("history-parsed", (event, arg) => {
      
      setHeartRate(arg.heartRate);
      setActivity(arg.activity);
      setAccX(arg.accX);
      setAccY(arg.accY);
      setAccZ(arg.accZ);
      setTempSkin(arg.tempSkin);
      setTempCloth(arg.tempCloth);
      setHumidity(arg.humidity)
    })
  
    return () => {
      ipcRenderer.removeAllListeners();
    }
  }, [])
  
  return (
    <div>
      <Dialog style={{padding: 10}} fullScreen open={props.openState} TransitionComponent={Transition}>
        <AppBar style={{margin: 0 }} className={classes.appBar}>
          <Toolbar>
          <Avatar className={classes.avatar}>{props.devId}</Avatar> 
          <Typography variant="h6"> {props.user ? props.user.name : "--"} {props.user ? props.user.surname : "--"} </Typography>
            <IconButton color="inherit" onClick={props.close} className={classes.closeButton} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
        <Chip variant="outlined" label= {props.user ? (props.user.age + " " + "y.o.") : "--"}/>
        <Chip variant="outlined" label= {props.user ? (props.user.weight + " " + "kg") : "--"}/>
        <Chip variant="outlined" label= {props.user ? (props.user.height + " " + "cm") : "--"}/>
        <Chip variant="outlined" label= {props.user ? (props.user.hrRest + " " + "BPM REST") : "--"}/>
        <Chip variant="outlined" label= {props.user ? (props.user.hrRef + " " + "BPM REF") : "--"}/>
        <Chip variant="outlined" label= {props.user ? (props.user.hrMax + " " + "BPM MAX") : "--"}/>
        <Chip variant="outlined" label= {props.user ? (props.user.vMax + " " + "ml/min") : "--"}/>
        <Chip variant="outlined" label={props.user ? props.user.gender : "--"}/>
        <XYPlot
            width={500}
            height={220}
            xType="time"
            yDomain={[0, 220]}
          >
            <HorizontalGridLines />
            <LineSeries
              data={heartRate} />
            <XAxis />
            <YAxis title="BPM" />
          </XYPlot>


        </DialogContent>
      </Dialog>
    </div>
  );
}
