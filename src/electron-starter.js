// Module to include electron
const electron = require('electron');
// Module for file paths
const path = require('path');
// Module for hot reload 
//require('electron-reload')(__dirname, { electron: require('${__dirname}/../../node_modules/electron') });
// Module to control application life.
const app = electron.app;
// Detects if in development env
const isDev = require('electron-is-dev');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    //mainWindow.setFullScreen(true);
    mainWindow.maximize();
    // and load the index.html of the app.
    //mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
    mainWindow.setMenuBarVisibility(false)
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    electron.dialog.showErrorBox("Error", error.message);
})
process.on('uncaughtException', error => {
    electron.dialog.showErrorBox("Error", error.message);
})

//////////////////////////////////////// Parsing data from COM port ////////////////////////////////////////
// Module for IPC with Renderer
const ipcMain = electron.ipcMain;

// Listens for app start
ipcMain.on('clear-to-send', (event, arg) => {

    // Helpers init
    const FlexParser = require('./helpers/flexParser');
    const SerialPort = require('serialport');
    const PacketHandler = require('./helpers/packetHandler');
    const PortHandler = require('./helpers/portHandler');
    const RecordHandler = require('./helpers/recordHandler');
    const DatabaseHandler = require('./helpers/databaseHandler');

    // Init of the database
    const databaseHandler = new DatabaseHandler(app);
    databaseHandler.initDb();
    const portHandlers = [];

    // State management init
    const packetHandler = new PacketHandler(event, databaseHandler);
    const recordHandler = new RecordHandler(databaseHandler);
    // Listener for (re)connect receivers - on start and on demand from user
    /* ipcMain.on('connect-ports', (event, arg) => {

        // Returns all Flexiguard receivers - ports
        SerialPort.list().then(ports => {

            const flexiGuardPorts = [];

            ports.forEach(port => {
                if (port.manufacturer === "FTDI") {
                    flexiGuardPorts.push(port.path);
                }
            })

            event.sender.send('ports-found', flexiGuardPorts);
            return flexiGuardPorts;
        },
            err => console.error(err),
        ).then(selectedPorts => {

            // For every Flexiguard port
            for (let index = 0; index < selectedPorts.length; index++) {
                const port = selectedPorts[index];
                const portHandler = new PortHandler(port, event);
                portHandlers.push(portHandler); // for further user actions with different listneres than connect-ports (alarm, sync) - eaching connection is unique, even for the same port

                // Get data from port - init parser, connect and data
                portHandler.getParser().then(parser => {

                    // Connecting (opening) port after the parser was configured
                    portHandler.connect();

                    // Listener for data from port
                    parser.on('data', function (data) {

                        try {
                            //Converting hex to int array
                            console.log(data.toString());

                        } catch (error) {
                            console.log(error.message);

                        }
                    })


                });




            }



        })

    }) */

    ipcMain.on('connect-ports', (event, arg) => {

        var fs = require('fs'),
            readline = require('readline');

        var rd = readline.createInterface({
            input: fs.createReadStream('C:/Users/Hoang/Documents/20200722145706.log'),
            output: process.stdout,
            console: false
        });

        rd.on('line', function (line) {
            packetHandler.readCOM(line);
        });
    })

    // Quit and stop recording when all windows are closed 
    app.on('window-all-closed', function () {

        if (recordHandler.recording) recordHandler.setRecording();
        app.quit();

    });

    // Toggle recording state
    ipcMain.on("set-recording", (event, arg) => {

        recordHandler.setRecording();

    })

    // Get cached data and user profiles
    ipcMain.on("online-view-mounted", (event, arg) => {

        packetHandler.sendState();
        packetHandler.sendUserProfiles();
    })

    // Get/update teams for visualization on change
    ipcMain.on("get-teams", (event, arg) => {

        const teams = databaseHandler.getAllTeams(false);
        const users = databaseHandler.getAllUsers();
        const defTeam = databaseHandler.getDefaultTeam(false);
        const activeTeam = databaseHandler.getSelectedTeam(true);
        const defUser = databaseHandler.getDefaultUser();

        packetHandler.profiles = databaseHandler.getSelectedTeam(false).members; // Update the profiles for online data

        const data = { teams, users, defTeam, defUser, activeTeam }

        event.sender.send("teams-loaded", data)

    })

    // Add user or a team
    ipcMain.on("add-teams", (event, arg) => {

        databaseHandler.addUserOrTeam(arg.data, arg.collection)

    })

    ipcMain.on("update-item", (event, arg) => {

        if (arg.data.tableData !== undefined) {
            let data = arg.data;
            delete data.tableData;
            databaseHandler.updateItem(arg.data.id, data, arg.collection)
        }
        else databaseHandler.updateItem(arg.data.id, arg.data, arg.collection)

    })

    ipcMain.on("delete-item", (event, arg) => {

        databaseHandler.deleteItem(arg.id, arg.collection);

    })

    ipcMain.on("update-settings", (event, arg) => {
        databaseHandler.updateSettings(arg);
        if (arg.selectedTeam) packetHandler.profiles = databaseHandler.getSelectedTeam(false).members;
        if (arg.graphLength) packetHandler.graphLength = databaseHandler.getSettings().graphLength;
        if (arg.csvDirectory) recordHandler.directory = databaseHandler.getSettings().csvDirectory;
        if (arg.csvComponents) recordHandler.components = databaseHandler.getSettings().csvComponents;

    })

    ipcMain.on("get-settings", (event, arg) => {

        const settings = databaseHandler.getSettings();
        event.sender.send("settings-loaded", settings)
    })

    // Load history from a CSV file
    ipcMain.on("get-history", (event, arg) => {

        recordHandler.readFromCsv(arg.from, arg.to, arg.filePath, arg.devId, event)

    })

    // Get all records
    ipcMain.on("get-records", (event, arg) => {

        const data = databaseHandler.getAllRecords();

        event.sender.send("records-loaded", data)

    })

    // Open select dialog - directory or file
    ipcMain.on("open-dialog", (event, arg) => {

        const { dialog } = require('electron');
        dialog.showOpenDialog({
            filters: [
                { name: 'Records', extensions: ['csv'] }],
            properties: [arg] // folder or file - from UI
        }).then(chosenPath => {

            let path = chosenPath.filePaths;
            const team = databaseHandler.getDefaultTeam();
            team.name = "Custom load"; // if CSV record not in DB

            event.sender.send("csv-path-loaded", { path, team });
        })



    })

    // Event registration for CSV writing
    ipcMain.on("register-event", (event, arg) => {

        const devSlot = arg.devId - 1;
        const eventName = arg.event;

        packetHandler.events[devSlot] = eventName;
    })

    // User turns off the alarm (arg = deviceId)
    ipcMain.on("remove-alarm", (event, arg) => {

        try {

            // Send the remove alarm signal from one receiver at a time
            for (let index = 0; index < portHandlers.length; index++) {
                const alarmOff = () => portHandlers[index].removeAlarm(arg);
                const delay = index * 50;
                setTimeout(alarmOff, delay);
            }

        } catch (error) {
            console.log(error);
        }
    })

    // Sync all devices
    ipcMain.on("sync-devices", (event, arg) => {

        const userForcedSync = true; // not because of automatic invalid packet detection

        for (let index = 0; index < portHandlers.length; index++) {
            const delay = index * 50; // avoiding collision of broadcast
            portHandlers[index].sendSync(userForcedSync, delay);

        }

    })

})



