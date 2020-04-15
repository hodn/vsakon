import React from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

export default function HistoryDetail(props) {

    const getUsers = () => {

        let users = [];

        for (let i = 0; i < 30; i++) {

            users.push(<Grid key={"item" + i} item> <Chip avatar={<Avatar>{i + 1}</Avatar>} label="Clickable" onClick={console.log("MAMA")} /> </Grid>);
        }

        return users;
    }


    return (
        <div>
            <Paper elevation={3}>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={1}
                >
                    {getUsers().map((component) => {
                        return component;
                    })}

                </Grid>
            </Paper>

        </div>
    );
}