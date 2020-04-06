// Module for file I/O
const fs = require('fs');
// Module for CSV
const csvWriter = require('csv-write-stream');
const path = require('path');

module.exports = class RecordHandler {
    constructor(app) {
        this.directory = app.getPath('desktop'),
        this.writer = csvWriter({
                separator: ';',
                newline: '\n',
                headers: undefined,
                sendHeaders: true
        })
    }

    // Loads user settings file if exists or creates new one with default values
    createCsvWriter(recordingStart) {

        const date = recordingStart.toISOString().split(":");

        const fileName = date[0] + date[1] + ".csv";
        const filePath = path.join(this.directory, fileName);
        this.writer.sendHeaders = fs.existsSync(filePath) ? false : true;

        this.writer.pipe(fs.createWriteStream(filePath, { flags: 'a' }));
    }

    writeToCsv(packet) {
        this.writer.write(packet.basicData)
    }

    stopWriteToCsv() {

        this.writer.end()
    }


}
