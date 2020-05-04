import React from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import colors from "../colors"

// Component for each device unit in HistoryView - opens HistoryDialog
export default function HistoryDetail(props) {
    
    const members = props.record ? props.record.team.members : null;
    
    // Get user for each device unit and render
    const getUsers = () => {

        let users = [];

        for (let i = 0; i < 30; i++) {

            users.push(
                <Grid xs={2} key={"item" + i} item>
                    <Chip variant="outlined" avatar={<Avatar style={{ backgroundColor: colors.secondary, color: "white" }} >{i + 1}</Avatar>} 
                    label={members ? (members[i].name + " " + members[i].surname): "User not loaded"} onClick={() => props.openDetail(i+1)}/>
                </Grid>
            );
        }

        return users;
    }


    return (
        <div>
            <Paper elevation={3} style={{padding: 15}}>
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