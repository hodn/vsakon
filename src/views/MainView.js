import React from 'react';
import { VerticalGridLines, XAxis, YAxis, HorizontalGridLines, LineSeries, FlexibleWidthXYPlot } from 'react-vis';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
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
    height: "100%"
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
      location: null,
      start: null,
      end: null

    }

    this.getHistoricalData = this.getHistoricalData.bind(this);
  }

  componentDidMount() {

    this._isMounted = true;

    ipcRenderer.on('online-data', (event, arg) => {
      this.setState({
        coeffs: arg.coeffs,
        secs: arg.secs,
        soak: arg.soak,
        location: arg.measurementLocation,
        start: arg.measurementStart,
        end: arg.measurementEnd
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
    const coeff = coeffRecord ? coeffRecord.y : 0
    const sec = secRecord ? secRecord : 0

    return { soak, coeff, sec };

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
          alignItems="stretch"
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

          <Grid item xs={2}>
            <Paper className={classes.card}>
              <Typography>
                Start
            </Typography>
              <Typography variant="h5">
                16:30
              </Typography>
              <Typography>
                Konec
            </Typography>
              <Typography variant="h5">
                ---
            </Typography>
            </Paper>
          </Grid>


          <Grid item xs={4}>
            <Paper className={classes.card}>
              <Typography>
                Koeficient vsaku
            </Typography>
              <Typography variant="h3" style={{marginBottom: 15}}>
                {this.state.coeffs.length === 0 ? "0" : this.state.coeffs[this.state.coeffs.length - 1].y}
              </Typography>

               <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="stretch"
              >
                <Grid item xs={4}>
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
                <Grid item xs={4}>
                <div>
                  <Typography>
                    Delta
            </Typography>
                  <Typography variant="h4">
                    12 %
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
                      <TableCell align="right"> 54 %</TableCell>
                    </TableRow>

                    <TableRow key={2}>
                      <TableCell component="th" scope="row">
                        {this.getHistoricalData(2).soak}
                      </TableCell>
                      <TableCell align="right"> {this.getHistoricalData(2).coeff}</TableCell>
                      <TableCell align="right">{this.getHistoricalData(2).sec} s</TableCell>
                      <TableCell align="right"> 54 %</TableCell>
                    </TableRow>

                    <TableRow key={3}>
                      <TableCell component="th" scope="row">
                        {this.getHistoricalData(3).soak}
                      </TableCell>
                      <TableCell align="right"> {this.getHistoricalData(3).coeff}</TableCell>
                      <TableCell align="right">{this.getHistoricalData(3).sec} s</TableCell>
                      <TableCell align="right"> 54 %</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>

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
