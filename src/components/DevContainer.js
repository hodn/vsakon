import React from 'react';
//import { TimeSeries } from 'react-smoothie';
const { ipcRenderer } = window.require('electron');

export class DevContainer extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this.checkDeviceConnection = this.checkDeviceConnection.bind(this);
    this.test = this.test.bind(this);

    this.state = {
      realTimeData: [],
      graphData: []
    }

  }

  componentDidMount() {

    this._isMounted = true;

    setInterval(this.checkDeviceConnection, 5000, this.state.realTimeData);

    ipcRenderer.send("clear-to-send");
    ipcRenderer.on('rt-data', (event, arg) => {

      const packet = arg;
      const rtData = this.state.realTimeData;
      rtData[packet.basicData.devId] = packet;

      const gData = this.state.graphData;
      const graphUnit = { x: packet.basicData.timestamp, y: packet.basicData.motionX };

      if (gData[packet.basicData.devId] === undefined) {
        gData[packet.basicData.devId] = [graphUnit];
      }
      else {

        gData[packet.basicData.devId].push(graphUnit);
        if (gData[packet.basicData.devId].length > 10) gData[packet.basicData.devId].splice(0, 1);
      }

      this._isMounted && this.setState((state, props) => ({
        realTimeData: rtData,
        graphData: gData
      }))

    })

  }

  componentWillUnmount() {

  }

  checkDeviceConnection(data) {

    if (data !== {}) {
      Object.keys(data).forEach(key => {

        const time = data[key].basicData.timestamp; // the value of the current key.

        if (Date.now() - time > 5000) {

          data[key].basicData.connected = 0;

          this._isMounted && this.setState((state, props) => ({
            realTimeData: data,
          }))

        }

      });

    }
    else {
      return;
    }



  }

  test(data) {

    Object.keys(data).forEach(key => {
      console.log(data[key]); // the value of the current key.
      return <p> {data[key].basicData.devId} </p >
    });

  }

  // What the actual component renders
  render() {

    return (
      <div>
        <ul>
          {this.state.realTimeData.map(item => (
            <li key={item.basicData.devId}>
              <div>{item.basicData.devId}</div>
              <div>{item.basicData.motionX}</div>
            </li>
          ))}
        </ul>
      </div>

    );


  }

}

