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

// Listens for app start
ipcMain.on('clear-to-send', (event, arg) => {

    // Helpers init
    const FlexParser = require('./helpers/flexParser');
    const SerialPort = require('serialport');
    const PacketHandler = require('./helpers/packetHandler');
    const PortHandler = require('./helpers/portHandler');
    const RecordHandler = require('./helpers/recordHandler');

    // State management init
    let packetHandler = new PacketHandler(event);
    let recordHandler = new RecordHandler(app);
    
    // Listener for (re)connect receivers - on start and on demand from user
    ipcMain.on('connect-ports', (event, arg) => {

        // Returns all Flexiguard receivers - ports
        SerialPort.list().then(ports => {

            const flexiGuardPorts = [];

            ports.forEach(port => {
                if (port.manufacturer === "FTDI") {
                    flexiGuardPorts.push(port.comName);
                }
            })

            event.reply('ports-found', flexiGuardPorts);
            return flexiGuardPorts;
        },
            err => console.error(err),
        ).then(selectedPorts => {

            // For every Flexiguard port
            selectedPorts.forEach(port => {

                const portHandler = new PortHandler(port, event);

                // Get data from port - init parser, connect and data
                portHandler.getParser().then(parser => {

                    // Connecting (opening) port after the parser was configured
                    portHandler.connect();
                    // Listener for data from port
                    parser.on('data', function (data) {

                        try {
                            //Converting hex to int array
                            const rawPacket = Uint8Array.from(data);

                            // Raw packets are parsed into JSON object via FlexParser lib
                            const parsedPacket = FlexParser.parseFlexiData(rawPacket);
                            // Packet stored for timeseries and sent to Renderer
                            const storedPacket = packetHandler.storeAndSendState(parsedPacket);
                            
                            if(storedPacket && recordHandler.recording) recordHandler.writeToCsv(parsedPacket);
                        
                        } catch (error) {
                            console.log(error.message)

                            // Devices out of sync - sending invalid data format
                            if (error.message === "Invalid data format") {

                                try {
                                    portHandler.sendSync();
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

                        portHandler.removeAlarm(arg);
                        console.log("alarm: " + arg)

                    } catch (error) {
                        console.log(error);
                    }
                })


            })


        })

    })

    ipcMain.on("set-recording", (event, arg) => {

        recordHandler.setRecording();

    })

    ipcMain.on("main-view-mounted", (event, arg) => {

        packetHandler.resendState();

    })



})



