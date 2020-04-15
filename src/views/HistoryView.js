import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';
import { DateTimePicker } from "@material-ui/pickers";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import MaterialTable from 'material-table';
import RemoveRecordDialog from "../components/RemoveRecordDialog";
import EditRecordDialog from "../components/EditRecordDialog";
import HistoryUsersDetail from "../components/HistoryUsersDetail";
import colors from "../colors";
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
const { ipcRenderer } = window.require('electron');

const styles = {

  infoContainer: {
    padding: 15
  },
  pickers: {
    margin: 5,
  },
  recordInfo: {
    margin: 5
  },
};

class HistoryView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      heartRateGraph: [],
      from: null,
      to: null,
      records: [],
      activeRecord: null,
      showRemoveDialog: false,
      showEditDialog: false,
      selectedRow: null

    }

    this.onFromChange = this.onFromChange.bind(this);
    this.onToChange = this.onToChange.bind(this);
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

      this._isMounted && this.setState((state, props) => ({
        records,
        activeRecord: records[records.length - 1],
        from: records[records.length - 1].start,
        to: records[records.length - 1].end ? records[records.length - 1].end : new Date(),
      }))
    })
  }

  componentWillUnmount() {

    ipcRenderer.removeAllListeners();

  }

  onFromChange(time) {
    this._isMounted && this.setState((state, props) => ({
      from: time
    }))
  }

  onToChange(time) {
    this._isMounted && this.setState((state, props) => ({
      to: time
    }))
  }

  setActiveRecord(rowData) {

    this._isMounted && this.setState((state, props) => ({
      activeRecord: rowData,
      from: rowData.start,
      to: rowData.end ? rowData.end : new Date()
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

    const { classes } = this.props;
    return (

      <div>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={3}>
            <Paper elevation={3} className={classes.infoContainer}>
              <div className={classes.recordInfo}>
                <Typography variant="h5"> {this.state.activeRecord ? this.state.activeRecord.team.name : "No record"} </Typography>
                <Typography style={{ marginBottom: 10 }} variant="subtitle2"> {this.state.activeRecord ? this.state.activeRecord.note ? this.state.activeRecord.note : "---" : "---"} </Typography>
                <Typography variant="body2"> Start: {this.state.activeRecord ? new Date(this.state.activeRecord.start).toLocaleString() : "---"} </Typography>
                <Typography variant="body2"> End: {this.state.activeRecord ? this.state.activeRecord.end ? new Date(this.state.activeRecord.end).toLocaleString() : "---" : "---"} </Typography>
                <Divider style={{ marginBottom: 10 }} />
              </div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                  autoOk
                  ampm={false}
                  value={this.state.from}
                  onChange={this.onFromChange}
                  label="From"
                  openTo="minutes"
                  className={classes.pickers}
                />

                <DateTimePicker
                  autoOk
                  ampm={false}
                  value={this.state.to}
                  onChange={this.onToChange}
                  label="To"
                  openTo="minutes"
                  className={classes.pickers}
                />
              </MuiPickersUtilsProvider>
            </Paper>
          </Grid>
          <Grid item xs={9}> <HistoryUsersDetail record={this.state.activeRecord}/> </Grid>
          <Grid item xs={12}><MaterialTable
            columns={[
              { title: 'Start', field: 'start', type: "datetime", defaultSort: "desc", render: rowData => new Date(rowData.start).toLocaleString() },
              { title: 'End', field: 'end', type: "datetime", render: rowData => rowData.end ? new Date(rowData.end).toLocaleString() : "Recording..." },
              { title: 'Team', field: 'team.name' },
              { title: 'Note', field: 'note' },
              { title: 'Path', field: 'path' },
              {
                title: 'Users', field: 'users', render: rowData => {

                  let surnames = [];
                  for (let index = 0; index < rowData.team.members.length; index++) {

                    surnames.push(rowData.team.members[index].surname);
                  }

                  return surnames.toString();
                }
              }

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
                icon: 'save',
                iconProps: { style: { color: colors.secondary } },
                tooltip: 'Read CSV file',
                isFreeAction: true,
                onClick: (event) => this.toggleAddUserDialog()
              }
            ]}
          /> </Grid>
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
        </Grid>
        {this.state.showEditDialog && <EditRecordDialog item={this.state.selectedRow} handleDialog={this.toggleEditDialog} />}
        {this.state.showRemoveDialog && <RemoveRecordDialog item={this.state.selectedRow} handleDialog={this.toggleRemoveDialog} />}
      </div>

    );


  }

}

HistoryView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HistoryView);

