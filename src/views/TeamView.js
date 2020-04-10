import React from 'react';
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';

export class TeamView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      devComponents: []

    }
  }

  componentDidMount() {

    this._isMounted = true;
  }

  componentWillUnmount() {

  }

  // What the actual component renders
  render() {

    return (

      <div>
        <Grid direction="row" spacing={3} container>
          <Grid xs={5} item>
            <MaterialTable
              columns={[
                { title: 'Name', field: 'name' },
                { title: 'Surname', field: 'surname' },
                { title: 'Note', field: 'note', type: 'numeric' }
              ]}
              data={[{ name: 'Mehmet', surname: 'Baran', note: "Captain"}]}
              title="Users"
              options={
                {searchFieldStyle: {width: 200}}
              }
              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Edit team',
                  onClick: (event, rowData) => alert("You saved " + rowData.name)
                },
                {
                  tooltip: 'Delete user',
                  icon: 'delete',
                  onClick: (evt, data) => alert('You want to delete ' + data.length + ' rows')
                }
              ]}
            />
          </Grid>

          <Grid xs={4} item>
            <MaterialTable
               columns={[
                { title: 'Name', field: 'name' },
                { title: 'Note', field: 'note', type: 'numeric' }
              ]}
              data={[{ id: "asdfasd", name: 'General Team', note: 'Firefighters 001'}, { id: "asdfasd", name: 'General Team', note: 'Firefighters 001'}]}
              title="Teams"
              options={
                {searchFieldStyle: {width: 200}}
              }
              
              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Edit team',
                  onClick: (event, rowData) => alert("You saved " + rowData.name)
                },
                {
                  tooltip: 'Delete selected team',
                  icon: 'delete',
                  onClick: (evt, data) => alert(data)
                }
              ]}
            />
          </Grid>
        </Grid>
      </div>

    );


  }

}

