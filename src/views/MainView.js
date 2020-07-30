import React from 'react';
import { VerticalGridLines, XAxis, YAxis, HorizontalGridLines, LineSeries, FlexibleWidthXYPlot } from 'react-vis';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import colors from '../colors';
import PropTypes from 'prop-types';
const { ipcRenderer } = window.require('electron');

const styles = {
  graph: {
    margin: 5,
    padding: 5
  },

  card: {
    margin: 5,
    padding: 10,
    height: 200
  },
  button: {
    width: 310,
    height: 80,
    margin: 5
  }
};

// Main view - online visualization of all units
class MainView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      coeffs: [],
      secs: [],
      soak: 0,
      locationFlags: [],
      location: null,
      start: null,
      end: null,
      measurementLocation: ""

    }

    this.getHistoricalData = this.getHistoricalData.bind(this);
    this.controlSoaker = this.controlSoaker.bind(this);
    this.saveAndReset = this.saveAndReset.bind(this);
  }

  componentDidMount() {

    this._isMounted = true;

    ipcRenderer.on('online-data', (event, arg) => {
      this.setState({
        coeffs: arg.coeffs,
        secs: arg.secs,
        soak: arg.soak,
        location: {lat: arg.measurementLocationLat, lon: arg.measurementLocationLon}
      })

    })
  }

  componentWillUnmount() {

    ipcRenderer.removeAllListeners();

  }

  getHistoricalData(minus) {

    const coeffRecord = this.state.coeffs[this.state.coeffs.length - 1 - minus]
    const secRecord = this.state.secs[this.state.secs.length - 1 - minus]
    const soak = this.state.soak - minus > 0 ? this.state.soak - minus : ""
    const previousCoeffRecord = this.state.coeffs[this.state.coeffs.length - 2 - minus]

    const coeff = coeffRecord ? coeffRecord.y : 0
    const sec = secRecord ? secRecord : 0
    const delta = previousCoeffRecord ? ((coeff / previousCoeffRecord.y) * 100 - 100).toFixed(2) : 0

    return { soak, coeff, sec, delta };

  }

  controlSoaker(command) {
    ipcRenderer.send("soak-control", command);

    if(command === "start"){
      this.setState({ start: new Date().getHours() + ":"+ (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()});
    }

    if(command === "stop"){
      this.setState({ end: new Date().getHours() + ":"+ (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()});
    }

  }

  saveAndReset(){

    ipcRenderer.send("save-reset", {start: this.state.start, end: this.state.end, name: this.state.measurementLocation})

    const locationFlag = {name: this.state.measurementLocation, location: this.state.location}

    this.setState({
      locationFlags:[...this.state.locationFlags, locationFlag],
      coeffs: [],
      secs: [],
      soak: 0,
      location: null,
      start: null,
      end: null,
      measurementLocation: ""
    });

  }

// What the actual component renders
render() {

  const { classes } = this.props;

  return (

    <div>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Paper className={classes.graph}>
            <FlexibleWidthXYPlot

              height={370}
              xType="time"
            >
              <HorizontalGridLines />
              <VerticalGridLines />
              <LineSeries
                data={this.state.coeffs} />
              <XAxis />
              <YAxis title="Koeficient vsaku" />
            </FlexibleWidthXYPlot>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper className={classes.card}>
            <Typography>
              Koeficient vsaku
            </Typography>
            <Typography variant="h3" style={{ marginBottom: 15 }}>
              {this.state.coeffs.length === 0 ? "0" : this.state.coeffs[this.state.coeffs.length - 1].y}
            </Typography>

            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="stretch"
            >
              <Grid item xs={2}>
                <div>
                  <Typography>
                    Vsak
            </Typography>
                  <Typography variant="h4">
                    {this.state.soak}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div>
                  <Typography>
                    Trvání
            </Typography>
                  <Typography variant="h4">
                    {this.state.secs.length === 0 ? "0" : this.state.secs[this.state.secs.length - 1]} s
                  </Typography>

                </div>
              </Grid>
              <Grid item xs={6}>
                <div>
                  <Typography>
                    Delta
            </Typography>
                  <Typography variant="h4">
                    {this.getHistoricalData(0).delta} %
                  </Typography>

                </div>
              </Grid>
            </Grid>

          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper className={classes.card}>
            <Typography>
              Poslední vsaky
            </Typography>
            <Table>
              <TableBody>
                <TableRow key={1}>
                  <TableCell component="th" scope="row">
                    {this.getHistoricalData(1).soak}
                  </TableCell>
                  <TableCell align="right"> {this.getHistoricalData(1).coeff}</TableCell>
                  <TableCell align="right">{this.getHistoricalData(1).sec} s</TableCell>
                  <TableCell align="right">{this.getHistoricalData(1).delta} %</TableCell>
                </TableRow>

                <TableRow key={2}>
                  <TableCell component="th" scope="row">
                    {this.getHistoricalData(2).soak}
                  </TableCell>
                  <TableCell align="right"> {this.getHistoricalData(2).coeff}</TableCell>
                  <TableCell align="right">{this.getHistoricalData(2).sec} s</TableCell>
                  <TableCell align="right"> {this.getHistoricalData(2).delta} %</TableCell>
                </TableRow>

                <TableRow key={3}>
                  <TableCell component="th" scope="row">
                    {this.getHistoricalData(3).soak}
                  </TableCell>
                  <TableCell align="right"> {this.getHistoricalData(3).coeff}</TableCell>
                  <TableCell align="right">{this.getHistoricalData(3).sec} s</TableCell>
                  <TableCell align="right">  {this.getHistoricalData(3).delta} %</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>

        </Grid>

        <Grid item xs={4}>
          <Paper className={classes.card}>
            <Typography>
              Začátek
            </Typography>
            <Typography variant="h5">
              {this.state.start ? this.state.start : "XX:XX"}
              </Typography>
            <Typography>
              Konec
            </Typography>
            <Typography variant="h5">
            {this.state.end ? this.state.end : "XX:XX"}
            </Typography>
            <TextField
              required
              color="secondary"
              id="outlined-required"
              label="Označení místa měření"
              variant="outlined"
              value={this.state.measurementLocation} 
              onChange={event => {
                const { value } = event.target;
                this.setState({ measurementLocation: value });
              }}
              style={{ marginTop: 20, width: "90%" }}
            />
          </Paper>
        </Grid>


        <Grid item xs={12}>
          <Button className={classes.button} style={{ backgroundColor: colors.green, color: "white" }} variant="contained" size="large" onClick={() => this.controlSoaker("start")}>Start</Button>
          <Button className={classes.button} style={{ backgroundColor: colors.red, color: "white" }} variant="contained" size="large" onClick={() => this.controlSoaker("stop")}>Stop</Button>
          <Button className={classes.button} variant="contained" color="secondary" size="large">Mapa</Button>
          {this.state.coeffs.length > 0 && this.state.end !== null && this.state.measurementLocation !== "" && <Button className={classes.button} variant="contained" color="primary" size="large" onClick={() => this.saveAndReset()}>Uložit a pokračovat</Button>}
        </Grid>

      </Grid>
    </div>


  );


}

}

MainView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainView);
