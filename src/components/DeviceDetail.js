import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import colors from '../colors';

const useStyles = makeStyles(theme => ({
  
    appBar: {
    position: 'relative',
    backgroundColor: colors.main
  },
  title: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeviceDetail(props) {
  const classes = useStyles();

  return (
    <div>
      <Dialog fullScreen open={props.open} TransitionComponent={Transition}>
        <AppBar style={{margin: 0}} className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.close} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              13
            </Typography>
            <Button autoFocus color="inherit">
              Turn off alarm
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
