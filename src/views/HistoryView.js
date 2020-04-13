import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';
const { ipcRenderer } = window.require('electron');

export class HistoryView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      heartRateGraph: []

    }
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

  // What the actual component renders
  render() {

    return (

      <div>
        XXX
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
      </div>


    );


  }

}

