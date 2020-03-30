module.exports = class fileHandler {
    constructor(app) {
        this.app = app,
        this.settingsDir = app.getPath('desktop'),
        this.recordDir = app.getPath('desktop')
    }

    ha(){
        return this.settingsDir
    }

    
}