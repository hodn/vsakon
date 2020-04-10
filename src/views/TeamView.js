import React from 'react';
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import AddUserDialog from "../components/AddUserDialog";
import EditUserDialog from "../components/EditUserDialog";
import colors from "../colors";
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
      addUserDialog: false,
      editUserDialog: false,
      selectedUser: null
    }

    this.showAddUserDialog = this.showAddUserDialog.bind(this);
    this.showEditUserDialog = this.showEditUserDialog.bind(this);

  }

  componentDidMount() {

    this._isMounted = true;
    ipcRenderer.send("get-teams");

    ipcRenderer.on('teams-loaded', (event, arg) => {

      const teams = arg.teams;
      const users = arg.users;
      const defUser = arg.defUser;
      const defTeam = arg.defTeam;

      this._isMounted && this.setState((state, props) => ({
        users,
        teams,
        defUser,
        defTeam
      }))
    })

  }

  componentWillUnmount() {

  }

  showAddUserDialog(){
    
    this._isMounted && this.setState((state, props) => ({
     addUserDialog: !state.addUserDialog
    }))

  }

  showEditUserDialog(user){
    
    this._isMounted && this.setState((state, props) => ({
     editUserDialog: !state.editUserDialog,
     selectedUser: user
    }))

  }


  render() {

    return (

      <div>
        <Grid direction="row" spacing={3} container>
          <Grid xs={5} item>
            <MaterialTable
              columns={[
                { title: 'Name', field: 'name' },
                { title: 'Surname', field: 'surname' },
                { title: 'Note', field: 'note' }
              ]}
              data={this.state.users}
              title="Users"
              options={
                { searchFieldStyle: { width: 200 }}
              }
              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Edit user',
                  onClick: (event, rowData) => this.showEditUserDialog(rowData)
                },
                {
                  tooltip: 'Delete user',
                  icon: 'delete',
                  onClick: (evt, data) => alert('You want to delete ' + data.length + ' rows')
                },
                {
                  icon: 'add',
                  iconProps: {style: {color: colors.secondary}},
                  tooltip: 'Add user',
                  isFreeAction: true,
                  onClick: (event) => this.showAddUserDialog()
                }
              ]}
            />
          </Grid>

          <Grid xs={4} item>
            <MaterialTable
              columns={[
                { title: 'Name', field: 'name' },
                { title: 'Note', field: 'note' }
              ]}
              data={this.state.teams}
              title="Teams"
              options={
                { searchFieldStyle: { width: 200 } }
              }

              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Edit team',
                  onClick: (event, rowData) => alert("You saved " + rowData.name)
                },
                {
                  tooltip: 'Delete team',
                  icon: 'delete',
                  onClick: (evt, data) => alert(data)
                },
                {
                  icon: 'add',
                  iconProps: {style: {color: colors.secondary}},
                  tooltip: 'Add team',
                  isFreeAction: true,
                  onClick: (event) => alert("You want to add a new row")
                }
              ]}
            />
          </Grid>
        </Grid>

        {this.state.addUserDialog && <AddUserDialog user={this.state.defUser} handleDialog={this.showAddUserDialog}/>}
        {this.state.editUserDialog && <EditUserDialog user={this.state.selectedUser} handleDialog={this.showEditUserDialog}/>}
      </div>

    );


  }

}

