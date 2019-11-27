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
    mainWindow.maximize();
    // and load the index.html of the app.
    //mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
    //mainWindow.setMenuBarVisibility(false)
    mainWindow.loadURL('http://localhost:3000');

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
const Delimiter = require('@serialport/parser-delimiter');
const FlexParser = require('./helpers/flexParser');
const SettingsHandler = require('./helpers/settingsHandler');

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
    event.sender.send('settings-loaded', { dir: settingsHandler.settingsJSON.defaultDir, com: settingsHandler.settingsJSON.defaultCOM })
})

// List available ports on event from Renderer
ipcMain.on('list-ports', (event, arg) => {
    SerialPort.list().then(
        ports => ports.forEach(function (port) {
            event.sender.send('ports-listed', port.comName)
        }),
        err => console.error(err),
    )
})

ipcMain.on('clear-to-send', (event, arg) => {


    // Port init from user settings
    let port = new SerialPort(settingsHandler.settingsJSON.defaultCOM, {
        baudRate: 115200
    })

    port.on('open', function () {
        console.log("Connected");
    })

    port.on('close', function () {
        console.log("Disconnected");
    })

    // Pipe init and delimiter settings  
    const parser = port.pipe(new Delimiter({ delimiter: [0] }));

    // Switches the port into "flowing mode"
    parser.on('data', function (data) {

        //Converting hex to int array
        const rawPacket = Uint8Array.from(data);

        // Raw packets are parsed into JSON object
        const parsedPacket = FlexParser.parseFlexiData(rawPacket);

        console.log(parsedPacket.basicData.devId);


    });
})

