import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';
import { DateTimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import MaterialTable from 'material-table';
import RemoveRecordDialog from "../components/RemoveRecordDialog";
import EditRecordDialog from "../components/EditRecordDialog";
import colors from "../colors";
const { ipcRenderer } = window.require('electron');

export class HistoryView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      heartRateGraph: [],
      time: new Date(),
      records: [],
      activeRecord: null,
      showRemoveDialog: false,
      showEditDialog: false,
      selectedRow: null

    }

    this.onChange = this.onChange.bind(this);
    this.setActiveRecord = this.setActiveRecord.bind(this);
    this.toggleRemoveDialog = this.toggleRemoveDialog.bind(this);
    this.toggleEditDialog = this.toggleEditDialog.bind(this);

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

  setActiveRecord(rowData) {

    this._isMounted && this.setState((state, props) => ({
      activeRecord: rowData
    }))
  }

  toggleRemoveDialog(rowData) {
    this._isMounted && this.setState((state, props) => ({
      showRemoveDialog: !state.showRemoveDialog,
      selectedRow: rowData
    }))
  }

  toggleEditDialog(rowData) {
    this._isMounted && this.setState((state, props) => ({
      showEditDialog: !state.showEditDialog,
      selectedRow: rowData
    }))
  }

  // What the actual component renders
  render() {

    return (

      <div>

        <p>{this.state.activeRecord ? this.state.activeRecord.team.name : "XXX"}</p>
        <MaterialTable
          columns={[
            { title: 'Start', field: 'start', type: "datetime", defaultSort: "desc" },
            { title: 'End', field: 'end', type: "datetime"},
            { title: 'Team', field: 'team.name' },
            { title: 'Note', field: 'note' },
            { title: 'Path', field: 'path' },
            { title: 'Users', field: 'surnames' }

          ]}
          data={this.state.records}
          title="Records"
          options={
            { searchFieldStyle: { width: 200 } }
          }
          actions={[
            {
              icon: 'check',
              tooltip: 'Select record',
              iconProps: { style: { color: colors.secondary } },
              onClick: (event, rowData) => this.setActiveRecord(rowData)
            },
            {
              icon: 'edit',
              tooltip: 'Edit record',
              onClick: (event, rowData) => this.toggleEditDialog(rowData)
            },
            {
              tooltip: 'Delete record',
              icon: 'delete',
              onClick: (evt, data) => this.toggleRemoveDialog(data)
            },
            {
              icon: 'add',
              iconProps: { style: { color: colors.secondary } },
              tooltip: 'Read CSV file',
              isFreeAction: true,
              onClick: (event) => this.toggleAddUserDialog()
            }
          ]}
        />

        {this.state.showEditDialog && <EditRecordDialog item={this.state.selectedRow} handleDialog={this.toggleEditDialog} />}¨
        {this.state.showRemoveDialog && <RemoveRecordDialog item={this.state.selectedRow} handleDialog={this.toggleRemoveDialog} />}
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

