import React from 'react';
import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AutorenewIcon from '@material-ui/icons/Autorenew';
const { ipcRenderer } = window.require('electron');

export default function ResetMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        setAnchorEl(null);

        if(event === 'devices') ipcRenderer.send("sync-devices");
        if(event === 'receivers') ipcRenderer.send("connect-ports");
    };

    return (
        <div>
            <Fab onClick={handleClick} size="small" aria-label="reset" >
                <AutorenewIcon />
            </Fab>
            <Menu
                id="reset-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleClose('devices')}>Sync devices</MenuItem>
                <MenuItem onClick={() => handleClose('receivers')}>Find receivers</MenuItem>
            </Menu>
        </div>
    );
}