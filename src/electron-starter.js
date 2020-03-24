// Module to include electron
const electron = require('electron');
// Module for file paths
const path = require('path');
// Module for hot reload 
require('electron-reload')(__dirname, { electron: require('${__dirname}/../../node_modules/electron') });
// Module to control application life.
const app = electron.app;
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
    mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

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

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {

        // If the windows is closed while recording, save the CSV record and clear the array
        /* if (recordingON === true) {
            saveRecord(csvRecord)
            csvRecord = [];
        } */

        app.quit();

    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    //electron.dialog.showErrorBox(error.message, error.message + ". Please, check if the settings are correct.");
    console.log(error);
})
process.on('uncaughtException', error => {
    //electron.dialog.showErrorBox(error.message, "App has encountered an error - " + error.message);
    console.log(error);
})

//////////////////////////////////////// Parsing data from COM port ////////////////////////////////////////
// Module for IPC with Renderer
const ipcMain = electron.ipcMain;
// SerialPort init
const SerialPort = require('serialport');
// Delimiter init for data packets
const SettingsHandler = require('./helpers/settingsHandler');
const PortHandler = require('./helpers/portHandler');

const settingsHandler = new SettingsHandler("user-settings.txt");
settingsHandler.loadSettings();


ipcMain.on('change-dir', (event, arg) => {

    electron.dialog.showOpenDialog({
        properties: ["openDirectory"],
    }, function (files) {
        if (files !== undefined) {
            const newDir = files.toString();
            settingsHandler.changeDir(newDir);
        }

    })

})

ipcMain.on('change-com', (event, arg) => {

    const newCOM = arg;
    settingsHandler.changeCOM(newCOM);
})

ipcMain.on('settings-info', (event, arg) => {
    event.sender.send('settings-loaded', { dir: settingsHandler.settings.defaultDir, com: settingsHandler.settings.defaultCOM })
})

// List available ports on event from Renderer (more detailed identification might be needed - i.e. mouse identified as receiver)
ipcMain.on('list-ports', (event, arg) => {
    SerialPort.list().then(
        ports => ports.forEach(function (port) {
            event.sender.send('ports-listed', port.comName)
            //console.log(port);
        }),
        err => console.error(err),
    )
})


// Listens for app start
ipcMain.on('clear-to-send', (event, arg) => {

    // Import of Flexparser & DataManager lib
    const FlexParser = require('./helpers/flexParser');
    const PacketHandler = require('./helpers/packetHandler')

    // Port and state management init
    let packetHandler = new PacketHandler(event);

    // (Re)connect receivers
    ipcMain.on('connect-ports', (event, arg) => {

         // Returns all Flexiguard receivers - ports
    SerialPort.list().then(ports => {

        const flexiGuardPorts = [];

        ports.forEach(port => {
            if (port.manufacturer === "FTDI") {
                flexiGuardPorts.push(port.comName)
            }
        })

        return flexiGuardPorts
    },
        err => console.error(err),
    ).then(selectedPorts => {

        // For every Flexiguard port
        selectedPorts.forEach(port => {
            const ph = new PortHandler(port);
            
            // Get data from port - init parser, connect and data
            ph.getParser().then(parser => {

                // Connecting (opening) port after the parser was configured
                ph.connect();

                // No data for 10 seconds after connecting port -> restart connection on receiver
                // const restart = () => ph.restartPort();
                // const initDataInterval = setInterval(restart, 10000);

                // Listener for data from port
                parser.on('data', function (data) {

                    // Removing the initial restart interval after first data packet
                    // if (initDataInterval !== undefined) clearInterval(initDataInterval);

                    try {
                        //Converting hex to int array
                        const rawPacket = Uint8Array.from(data);

                        // Raw packets are parsed into JSON object via FlexParser lib
                        const parsedPacket = FlexParser.parseFlexiData(rawPacket);
                        // Packet stored for timeseries and sent to Renderer
                        packetHandler.storeData(parsedPacket);


                    } catch (error) {
                        //console.log(error.message)

                        // Devices out of sync - sending invalid data format
                        if (error.message === "Invalid data format") {

                            try {
                                ph.sendSync();
                            } catch (error) {
                                console.log(error);
                            }
                        }

                    }
                })


            });

            // User turns off the alarm (arg = deviceId)
            ipcMain.on("remove-alarm", (event, arg) => {

                try {

                    ph.removeAlarm(arg);
                    console.log("alarm: " + arg)

                } catch (error) {
                    console.log(error);
                }
            })


        })


    })
    
    })




})



