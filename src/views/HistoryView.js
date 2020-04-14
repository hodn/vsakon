import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';
import { DateTimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import MaterialTable from 'material-table';
import colors from "../colors";
const { ipcRenderer } = window.require('electron');

export class HistoryView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      heartRateGraph: [],
      time: new Date(),
      records:[],
      activeRecord: null

    }

    this.onChange = this.onChange.bind(this);
    this.setActiveRecord = this.setActiveRecord.bind(this);

  }

  componentDidMount() {

    this._isMounted = true;
    // ipcRenderer.send("get-history"); this will be initiated by on click of the device

    /* ipcRenderer.on("history-parsed", (event, arg) => {
      console.log(arg.heartRate.length)
      this._isMounted && this.setState((state, props) => ({
        heartRateGraph: arg.heartRate
      })) this will be for the dialog

    })*/

    ipcRenderer.send("get-records");

    ipcRenderer.on('records-loaded', (event, arg) => {

      const records = arg;

      records.forEach(record => {

        const surnames = [];
        
        for (let index = 0; index < record.team.members.length; index++) {
          
            surnames.push(record.team.members[index].surname)          
        }

        record.surnames = surnames.toString()
        
      });

      this._isMounted && this.setState((state, props) => ({
        records,
        activeRecord: records[records.length - 1]
      }))
    })
  }

  componentWillUnmount() {

  }

  onChange() {
    return
  }

  setActiveRecord(rowData){
    
    this._isMounted && this.setState((state, props) => ({
      activeRecord: rowData
    }))
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
    <p>{this.state.activeRecord ? this.state.activeRecord.team.name : "XXX"}</p>
        <MaterialTable
              columns={[
                { title: 'Start', field: 'start' },
                { title: 'Team', field: 'team.name' },
                { title: 'Note', field: 'note' },
                { title: 'Path', field: 'path' },
                { title: 'Users', field: 'surnames' }
                
              ]}
              data={this.state.records}
              title="Records"
              options={
                { searchFieldStyle: { width: 200 }}
              }
              actions={[
                {
                  icon: 'check',
                  tooltip: 'Select record',
                  iconProps: {style: {color: colors.secondary}},
                  onClick: (event, rowData) => this.setActiveRecord(rowData)
                },
                {
                  icon: 'edit',
                  tooltip: 'Edit note',
                  onClick: (event, rowData) => this.toggleEditUserDialog(rowData)
                },
                {
                  tooltip: 'Delete user',
                  icon: 'delete',
                  onClick: (evt, data) => this.toggleDeleteDialog(data)
                },
                {
                  icon: 'add',
                  iconProps: {style: {color: colors.secondary}},
                  tooltip: 'Read CSV',
                  isFreeAction: true,
                  onClick: (event) => this.toggleAddUserDialog()
                }
              ]}
            />
      </div>


    );


  }

}

