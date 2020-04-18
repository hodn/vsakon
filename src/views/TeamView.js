import React from 'react';
import { forwardRef } from 'react';
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import AddUserDialog from "../components/AddUserDialog";
import EditUserDialog from "../components/EditUserDialog";
import EditTeamDialog from "../components/EditTeamDialog";
import AddTeamDialog from "../components/AddTeamDialog";
import DeleteDialog from "../components/DeleteDialog";
import ChangeActiveTeamDialog from "../components/ChangeActiveTeamDialog";
import colors from "../colors";
import Rotate90DegreesCcwIcon from '@material-ui/icons/Rotate90DegreesCcw';
const { ipcRenderer } = window.require('electron');

export class TeamView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      users: [],
      teams: [],
      defUser: null,
      defTeam: null,
      selectedRow: null,
      activeTeam: null,
      showAddUserDialog: false,
      showEditUserDialog: false,
      showDeleteDialog: false,
      showAddTeamDialog: false,
      showEditTeamDialog: false,
      showChangeActiveTeamDialog: false
    }

    this.toggleAddUserDialog = this.toggleAddUserDialog.bind(this);
    this.toggleAddTeamDialog = this.toggleAddTeamDialog.bind(this);
    this.toggleEditUserDialog = this.toggleEditUserDialog.bind(this);
    this.toggleEditTeamDialog = this.toggleEditTeamDialog.bind(this);
    this.toggleDeleteDialog = this.toggleDeleteDialog.bind(this);
    this.toggleChangeActiveTeamDialog = this.toggleChangeActiveTeamDialog.bind(this);


  }

  componentDidMount() {

    this._isMounted = true;
    ipcRenderer.send("get-teams");

    ipcRenderer.on('teams-loaded', (event, arg) => {

      const teams = arg.teams;
      const users = arg.users;
      const defUser = arg.defUser;
      const defTeam = arg.defTeam;
      const activeTeam = arg.activeTeam;

      this._isMounted && this.setState((state, props) => ({
        users,
        teams,
        defUser,
        defTeam,
        activeTeam
      }))
    })

  }

  componentWillUnmount() {

    ipcRenderer.removeAllListeners();

  }

  toggleAddUserDialog() {

    this._isMounted && this.setState((state, props) => ({
      showAddUserDialog: !state.showAddUserDialog
    }))

  }

  toggleEditUserDialog(user) {

    this._isMounted && this.setState((state, props) => ({
      showEditUserDialog: !state.showEditUserDialog,
      selectedRow: user
    }))

  }

  toggleDeleteDialog(item) {

    this._isMounted && this.setState((state, props) => ({
      showDeleteDialog: !state.showDeleteDialog,
      selectedRow: item
    }))

  }

  toggleAddTeamDialog() {

    this._isMounted && this.setState((state, props) => ({
      showAddTeamDialog: !state.showAddTeamDialog
    }))
  }

  toggleEditTeamDialog(team) {

    this._isMounted && this.setState((state, props) => ({
      showEditTeamDialog: !state.showEditTeamDialog,
      selectedRow: team
    }))

  }

  toggleChangeActiveTeamDialog() {
    this._isMounted && this.setState((state, props) => ({
      showChangeActiveTeamDialog: !state.showChangeActiveTeamDialog,
    }))
  }


  render() {

    return (

      <div>
        <Grid spacing={2} container>
          <Grid xs={12} item>
            <MaterialTable
              columns={[
                { title: 'Name', field: 'name' },
                { title: 'Note', field: 'note' }
              ]}
              data={this.state.teams}
              title={this.state.activeTeam === null ? "Teams" : "Teams | " + this.state.activeTeam.name}
              options={
                { searchFieldStyle: { width: 200 } }
              }

              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Edit team',
                  onClick: (event, rowData) => this.toggleEditTeamDialog(rowData)
                },
                {
                  tooltip: 'Delete team',
                  icon: 'delete',
                  onClick: (evt, data) => this.toggleDeleteDialog(data)
                },
                {
                  icon: 'add',
                  iconProps: { style: { color: colors.secondary } },
                  tooltip: 'Add team',
                  isFreeAction: true,
                  onClick: (event) => this.toggleAddTeamDialog()
                },
                {
                  icon: forwardRef((props, ref) => <Rotate90DegreesCcwIcon style={{ color: colors.secondary }} {...props} ref={ref} />),
                  iconProps: { style: { color: colors.secondary } },
                  tooltip: 'Change active team',
                  isFreeAction: true,
                  onClick: (event) => this.toggleChangeActiveTeamDialog()
                }
              ]}
            />
          </Grid>

          <Grid xs={12} item>
            <MaterialTable
              columns={[
                { title: 'Name', field: 'name' },
                { title: 'Surname', field: 'surname' },
                { title: 'Note', field: 'note' },
                { title: 'Weight', field: 'weight' },
                { title: 'Height', field: 'height' },
                { title: 'Age', field: 'age' }

              ]}
              data={this.state.users}
              title="Users"
              options={
                { searchFieldStyle: { width: 200 } }
              }
              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Edit user',
                  onClick: (event, rowData) => this.toggleEditUserDialog(rowData)
                },
                {
                  tooltip: 'Delete user',
                  icon: 'delete',
                  onClick: (evt, data) => this.toggleDeleteDialog(data)
                },
                {
                  icon: 'add',
                  iconProps: { style: { color: colors.secondary } },
                  tooltip: 'Add user',
                  isFreeAction: true,
                  onClick: (event) => this.toggleAddUserDialog()
                }
              ]}
            />
          </Grid>

        </Grid>

        {this.state.showAddUserDialog && <AddUserDialog user={this.state.defUser} handleDialog={this.toggleAddUserDialog} />}
        {this.state.showEditUserDialog && <EditUserDialog user={this.state.selectedRow} handleDialog={this.toggleEditUserDialog} />}
        {this.state.showDeleteDialog && <DeleteDialog item={this.state.selectedRow} handleDialog={this.toggleDeleteDialog} />}
        {this.state.showAddTeamDialog && <AddTeamDialog team={this.state.defTeam} users={this.state.users} handleDialog={this.toggleAddTeamDialog} />}
        {this.state.showEditTeamDialog && <EditTeamDialog team={this.state.selectedRow} users={this.state.users} handleDialog={this.toggleEditTeamDialog} />}
        {this.state.showChangeActiveTeamDialog && <ChangeActiveTeamDialog
          recording={this.props.recording}
          teams={this.state.teams}
          activeTeam={this.state.activeTeam}
          handleDialog={this.toggleChangeActiveTeamDialog} />}

      </div>

    );


  }

}

