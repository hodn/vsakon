// Module for file I/O
const fs = require('fs');

module.exports = class SettingsHandler {
    constructor(file) {
        this.file = file;
        this.settingsJSON = {
            defaultDir: "",
            defaultCOM: ""
        }
    }

    // Loads user settings file if exists or creates new one with default values
    loadSettings() {

        if (fs.existsSync(this.file)) {
            
            try{
                
                const load = fs.readFileSync(this.file, { encoding: 'utf-8' }); 
                const set = load.split(",");
                const loadedSettings = {
                        defaultDir: set[1],
                        defaultCOM: set[0]
                };
                
                this.settingsJSON = loadedSettings;

            }catch(err){

                electron.dialog.showErrorBox(err.message, "App has encountered an error - " + err.message);

            }      
            
        }
        else {

            this.settingsJSON.defaultDir = app.getPath('documents');
        }
    }

    saveSettings() {

        const settings = this.settingsJSON.defaultCOM + "," + this.settingsJSON.defaultDir
        fs.writeFile(this.file, settings, function (err) {

            if (err) throw err;

        })
    }

    changeDir(dir) {
        this.settingsJSON.defaultDir = dir;
    }

    changeCOM(com) {
        this.settingsJSON.defaultCOM = com;
    }
}
