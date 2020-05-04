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
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries, DiscreteColorLegend } from 'react-vis';
import colors from '../colors';


const { ipcRenderer } = window.require('electron');
const useStyles = makeStyles(theme => ({

  appBar: {
    position: 'relative',
    backgroundColor: colors.secondary
  },
  closeButton: {
    marginLeft: "auto",
    color: "white"
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
  paper: {
    padding: 10
  },

  paperLarge: {
    height: 300 * window.innerHeight / 1080,
    padding: 10
  }

}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Loads historical graphs for specified device unit
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
  const [showProgress, setProgress] = React.useState(true);

  React.useEffect(() => {
    
    // Data loaded from CSV record
    ipcRenderer.on("history-parsed", (event, arg) => {

      setHeartRate(arg.heartRate);
      setActivity(arg.activity);
      setAccX(arg.accX);
      setAccY(arg.accY);
      setAccZ(arg.accZ);
      setTempSkin(arg.tempSkin);
      setTempCloth(arg.tempCloth);
      setHumidity(arg.humidity);

      setProgress(false);
    })

    return () => {
      ipcRenderer.removeAllListeners();
    }
  }, [])

  // Stop the CSV parsing and reset the graphs - dialog closed
  const resetAndClose = () => {
    props.close();

    ipcRenderer.send("stop-history-read");

    setHeartRate([]);
    setActivity([]);
    setAccX([]);
    setAccY([]);
    setAccZ([]);
    setTempSkin([]);
    setTempCloth([]);
    setHumidity([]);
    setProgress(true);

  }

  return (
    <div>
      <Dialog style={{ padding: 10 }} fullScreen open={props.openState} TransitionComponent={Transition}>
        <AppBar style={{ margin: 0 }} className={classes.appBar}>
          <Toolbar>
            <Avatar className={classes.avatar}>{props.devId}</Avatar>
            <Typography variant="h6"> {props.user ? props.user.name : "--"} {props.user ? props.user.surname : "--"} </Typography>
            <IconButton color="inherit" onClick={() => resetAndClose()} className={classes.closeButton} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12}>
              <Chip variant="outlined" label={props.user ? (props.user.age + " y.o.") : "--"} />
              <Chip variant="outlined" label={props.user ? (props.user.weight + " kg") : "--"} />
              <Chip variant="outlined" label={props.user ? (props.user.height + " cm") : "--"} />
              <Chip variant="outlined" label={props.user ? (props.user.hrRest + " BPM REST") : "--"} />
              <Chip variant="outlined" label={props.user ? (props.user.hrRef + " BPM REF") : "--"} />
              <Chip variant="outlined" label={props.user ? (props.user.hrMax + " BPM MAX") : "--"} />
              <Chip variant="outlined" label={props.user ? (props.user.vMax + " ml/min") : "--"} />
              <Chip variant="outlined" label={props.user ? props.user.gender : "--"} />
              {showProgress && <LinearProgress style={{ colorPrimary: colors.red }} />}
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Typography variant="h6"> Heart rate </Typography>
                <FlexibleWidthXYPlot

                  height={230 * window.innerHeight / 1080}
                  xType="time"
                  yDomain={[0, 220]}
                >
                  <HorizontalGridLines />
                  <VerticalGridLines />
                  <LineSeries
                    data={heartRate} />
                  <XAxis />
                  <YAxis title="BPM" />
                </FlexibleWidthXYPlot>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Typography variant="h6"> Activity </Typography>
                <FlexibleWidthXYPlot

                  height={230 * window.innerHeight / 1080}
                  xType="time"
                  yDomain={[0, props.settings ? props.settings.metersMax.activity * 3 : 500]}
                >
                  <HorizontalGridLines />
                  <VerticalGridLines />
                  <LineSeries
                    data={activity} />
                  <XAxis />
                  <YAxis title="nat" />
                </FlexibleWidthXYPlot>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paperLarge}>
                <Grid container>
                  <Grid item xs={5}><Typography variant="h6"> Acceleration </Typography> </Grid>
                  <Grid item><DiscreteColorLegend
                    colors={[
                      colors.yellow,
                      colors.red,
                      colors.green
                    ]}
                    items={[
                      'Axis X',
                      'Axis Y',
                      'Axis Z',
                    ]}
                    orientation="horizontal"
                  /></Grid>
                </Grid>

                <FlexibleWidthXYPlot

                  height={230 * window.innerHeight / 1080}
                  xType="time"
                  yDomain={props.settings ? [-props.settings.metersMax.acc, +props.settings.metersMax.acc] : [-1, 1]}
                >
                  <HorizontalGridLines />
                  <VerticalGridLines />
                  <LineSeries
                    data={accX}
                    color={colors.yellow} />
                  <LineSeries
                    data={accY}
                    color={colors.red} />
                  <LineSeries
                    data={accZ}
                    color={colors.green} />
                  <XAxis />
                  <YAxis title="G" />
                </FlexibleWidthXYPlot>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paperLarge}>
                <Typography variant="h6"> Temperature - skin </Typography>
                <FlexibleWidthXYPlot
                  height={250 * window.innerHeight / 1080}
                  xType="time"
                  yDomain={[0, props.settings ? props.settings.metersMax.temp : 50]}
                >
                  <HorizontalGridLines />
                  <VerticalGridLines />
                  <LineSeries
                    data={tempSkin} />
                  <XAxis />
                  <YAxis title="°C" />
                </FlexibleWidthXYPlot>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Typography variant="h6"> Temperature - environment </Typography>
                <FlexibleWidthXYPlot
                  height={230 * window.innerHeight / 1080}
                  xType="time"
                  yDomain={[0, props.settings ? props.settings.metersMax.temp * 2 : 100]}
                >
                  <HorizontalGridLines />
                  <VerticalGridLines />
                  <LineSeries
                    data={tempCloth} />
                  <XAxis />
                  <YAxis title="°C" />
                </FlexibleWidthXYPlot>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Typography variant="h6"> Humidity </Typography>
                <FlexibleWidthXYPlot

                  height={230 * window.innerHeight / 1080}
                  xType="time"
                  yDomain={[0, 100]}
                >
                  <HorizontalGridLines />
                  <VerticalGridLines />
                  <LineSeries
                    data={humidity} />
                  <XAxis />
                  <YAxis title="%" />
                </FlexibleWidthXYPlot>
              </Paper>
            </Grid>

          </Grid>
        </DialogContent>
      </Dialog>
    </div >
  );
}
