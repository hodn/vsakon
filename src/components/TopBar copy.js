import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PowerIcon from '@material-ui/icons/Power';
import SaveIcon from '@material-ui/icons/Save';
import colors from '../colors';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: colors.main,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign: 'left'
  },
}));

export default function TopBar() {
  const classes = useStyles();

  return (
    <div>
      <AppBar className={classes.root} style={ {margin: 0}} position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" color="inherit">
            FLEXIGUARD
          </Typography>
          <PowerIcon/>
          <PowerIcon/>
          <SaveIcon/>
        </Toolbar>
      </AppBar>
    </div>
  );
}