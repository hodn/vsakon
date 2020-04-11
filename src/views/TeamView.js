import React from 'react';
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import AddUserDialog from "../components/AddUserDialog";
import EditUserDialog from "../components/EditUserDialog";
import AddTeamDialog from "../components/AddTeamDialog";
import DeleteDialog from "../components/DeleteDialog";
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
      selectedRow: null,
      activeTeam: null,
      addUserDialog: false,
      editUserDialog: false,
      deleteDialog: false,
      addTeamDialog: false
    }

    this.showAddUserDialog = this.showAddUserDialog.bind(this);
    this.showAddTeamDialog = this.showAddTeamDialog.bind(this);
    this.showEditUserDialog = this.showEditUserDialog.bind(this);
    this.showDeleteDialog = this.showDeleteDialog.bind(this);

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
     selectedRow: user
    }))

  }

  showDeleteDialog(item){
    
    this._isMounted && this.setState((state, props) => ({
      deleteDialog: !state.deleteDialog,
      selectedRow: item
     }))
 
  }

  showAddTeamDialog(){
    
    this._isMounted && this.setState((state, props) => ({
      addTeamDialog: !state.addTeamDialog
     }))
  }


  render() {

    return (

      <div>
        <Grid spacing={2} container>
          <Grid xs={8} item>
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
                  onClick: (evt, data) => this.showDeleteDialog(data)
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
                  onClick: (evt, data) => this.showDeleteDialog(data)
                },
                {
                  icon: 'add',
                  iconProps: {style: {color: colors.secondary}},
                  tooltip: 'Add team',
                  isFreeAction: true,
                  onClick: (event) => this.showAddTeamDialog()
                }
              ]}
            />
          </Grid>
        </Grid>

        {this.state.addUserDialog && <AddUserDialog user={this.state.defUser} handleDialog={this.showAddUserDialog}/>}
        {this.state.editUserDialog && <EditUserDialog user={this.state.selectedRow} handleDialog={this.showEditUserDialog}/>}
        {this.state.deleteDialog && <DeleteDialog item={this.state.selectedRow} handleDialog={this.showDeleteDialog}/>}
        {this.state.addTeamDialog && <AddTeamDialog team={this.state.defTeam} users={this.state.users} handleDialog={this.showAddTeamDialog}/>}
      </div>

    );


  }

}

