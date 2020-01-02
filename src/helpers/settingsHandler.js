// Module for file I/O
const fs = require('fs');

module.exports = class SettingsHandler {
    constructor(file) {
        this.file = file;
        this.settings = {
            defaultDir: "",
            defaultCOM1: "",
            defaultCOM2: ""
        }
    }

    // Loads user settings file if exists or creates new one with default values
    loadSettings() {

        if (fs.existsSync(this.file)) {

            try {

                const load = fs.readFileSync(this.file, { encoding: 'utf-8' });
                const set = load.split(",");
                const loadedSettings = {
                    defaultDir: set[2],
                    defaultCOM2: set[1],
                    defaultCOM1: set[0]
                };

                this.settings = loadedSettings;

            } catch (err) {

                electron.dialog.showErrorBox(err.message, "App has encountered an error - " + err.message);

            }

        }
        else {

            this.settings.defaultDir = app.getPath('documents');
            this.settings.defaultCOM1 = "COM1";
            this.settings.defaultCOM2 = "COM2";
        }
    }

    saveSettings() {

        const fileContent = this.settings.defaultCOM1 + "," + this.settings.defaultCOM2 + "," + this.settings.defaultDir
        fs.writeFile(this.file, fileContent, function (err) {

            if (err) throw err;

        })
    }


}
