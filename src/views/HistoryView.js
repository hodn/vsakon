import React from 'react';
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
import HistoryDialog from "../components/HistoryDialog";
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
      from: null,
      to: null,
      records: [],
      activeRecord: null,
      showRemoveDialog: false,
      showEditDialog: false,
      selectedRow: null,
      selectedUser: null,
      devId: null,
      detailOpen: false,
      settings: null

    }

    this.onFromChange = this.onFromChange.bind(this);
    this.onToChange = this.onToChange.bind(this);
    this.setActiveRecord = this.setActiveRecord.bind(this);
    this.toggleRemoveDialog = this.toggleRemoveDialog.bind(this);
    this.toggleEditDialog = this.toggleEditDialog.bind(this);
    this.openDetailDialog = this.openDetailDialog.bind(this);
    this.closeDetailDialog = this.closeDetailDialog.bind(this);
    this.closeDetailDialog = this.closeDetailDialog.bind(this);
    this.openCsvDialog = this.openCsvDialog.bind(this);

  }

  componentDidMount() {

    this._isMounted = true;

    ipcRenderer.send("get-records"); // Gets all records from DB

    ipcRenderer.on('records-loaded', (event, arg) => {

      const records = arg;
      const lastRecord = records[records.length - 1];
      
      this._isMounted && this.setState((state, props) => ({
        records,
        activeRecord: lastRecord, // Set default record (in focus) - the latest one
        from: lastRecord ? lastRecord.start : new Date(),
        to: lastRecord ? (lastRecord.end ? lastRecord.end : new Date()) : new Date()
      })) 
    })

    ipcRenderer.send("get-settings"); // Gets settings from DB

    ipcRenderer.once("settings-loaded", (event, arg) => {

      const settings = arg;
      this._isMounted && this.setState({settings});
    })
  }

  componentWillUnmount() {

    ipcRenderer.removeAllListeners();

  }

  // Time boundaries change
  onFromChange(time) {
    this._isMounted && this.setState((state, props) => ({
      from: new Date(time)
    }))
  }

  onToChange(time) {
    this._isMounted && this.setState((state, props) => ({
      to: new Date(time)
    }))
  }

  // Change the default record - in focus
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

  // Opening the HistoryDialog - detailed historical data for selected unit
  openDetailDialog(devId) {
    this.setState({
      detailOpen: this.state.activeRecord ? true : false,
      selectedUser: this.state.activeRecord ? this.state.activeRecord.team.members[devId - 1] : null,
      devId
    });

    // Loads data from CSV if records exists
    this.state.activeRecord && ipcRenderer.send("get-history", {
      from: new Date(this.state.from).getTime(),
      to: new Date(this.state.to).getTime(),
      devId: devId,
      filePath: this.state.activeRecord.path
    });
  }

  closeDetailDialog() {
    this.setState({ detailOpen: false });
  }

  // Selecting CSV that is not in DB - custom load
  openCsvDialog() {
    ipcRenderer.send("open-dialog", "openFile");

    ipcRenderer.once('csv-path-loaded', (event, arg) => {

      let record = {
        path: arg.path.toString(),
        start: undefined,
        end: undefined,
        team: arg.team,
        note: arg.path
      }

      this.setState({ activeRecord: record });
    })
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
          <Grid item xs={9}> <HistoryUsersDetail record={this.state.activeRecord} openDetail={this.openDetailDialog} /> </Grid>
          <Grid item xs={12}><MaterialTable
            columns={[
              { title: 'Start', field: 'start', defaultSort: "desc", render: rowData => new Date(rowData.start).toLocaleString(), customSort: (a, b) => new Date(a.start) - new Date(b.start)}, // Sort by date - substraction
              { title: 'End', field: 'end', type: "datetime", render: rowData => rowData.end ? new Date(rowData.end).toLocaleString() : "Recording..." }, // Display Recording if the recording has no end
              { title: 'Team', field: 'team.name' },
              { title: 'Note', field: 'note' },
              { title: 'Path', field: 'path' },
              {
                title: 'Users', field: 'users', searchable: true, customFilterAndSearch: (value, rowData) => {
                  let surnames = [];
                  for (let index = 0; index < rowData.team.members.length; index++) {

                    surnames.push(rowData.team.members[index].surname);
                  }
                  return surnames.includes(value); // Searchable by team member names
               }, render: rowData => {

                  let surnames = [];
                  for (let index = 0; index < rowData.team.members.length; index++) {

                    surnames.push(rowData.team.members[index].surname);
                  }

                  return surnames.toString(); // Display all members' surnames
                }
              }

            ]}
            data={this.state.records}
            title="Records"
            options={
              { searchFieldStyle: { width: 200 }, sorting: true }
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
                onClick: (event) => this.openCsvDialog()
              }
            ]}
          /> </Grid>
        </Grid>
        <HistoryDialog
          openState={this.state.detailOpen}
          open={this.openDetailDialog}
          close={this.closeDetailDialog}
          devId={this.state.devId}
          user={this.state.selectedUser}
          settings={this.state.settings}
        />

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

