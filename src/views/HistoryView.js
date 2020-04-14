import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';
import { DateTimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
const { ipcRenderer } = window.require('electron');

export class HistoryView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      heartRateGraph: [],
      time: new Date()

    }

    this.onChange = this.onChange.bind(this);

  }

  componentDidMount() {

    this._isMounted = true;
    ipcRenderer.send("get-history");

    ipcRenderer.on("history-parsed", (event, arg) => {
      console.log(arg.heartRate.length)
      this._isMounted && this.setState((state, props) => ({
        heartRateGraph: arg.heartRate
      }))

    })
  }

  componentWillUnmount() {

  }

  onChange() {
    return
  }

  // What the actual component renders
  render() {

    return (

      <div>
        <XYPlot
          width={500}
          height={220}
          xType="time"
          yDomain={[0, 220]}
        >
          <HorizontalGridLines />
          <LineSeries
            data={this.state.heartRateGraph} />
          <XAxis />
          <YAxis title="BPM" />
        </XYPlot>
        
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            autoOk
            ampm={false}
            value={this.state.time}
            onChange={this.onChange}
            label="From"
            openTo="minutes"
          />

          <DateTimePicker
            autoOk
            ampm={false}
            value={this.state.time}
            onChange={this.onChange}
            label="To"
            openTo="minutes"
          />
        </MuiPickersUtilsProvider>
      </div>


    );


  }

}

