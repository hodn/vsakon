import React from 'react';
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import colors from "../colors";
const { ipcRenderer } = window.require('electron');

export class TeamView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      users: [],
      teams: []

    }
  }

  componentDidMount() {

    this._isMounted = true;
    ipcRenderer.send("get-teams");

    ipcRenderer.once('teams-loaded', (event, arg) => {

      const teams = arg.teams;
      const users = arg.users;

      this._isMounted && this.setState((state, props) => ({
        users,
        teams
      }))
    })

  }

  componentWillUnmount() {

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
                  onClick: (event, rowData) => alert("You saved " + rowData.name)
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
                  onClick: (event) => alert("You want to add a new row")
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
      </div>

    );


  }

}

