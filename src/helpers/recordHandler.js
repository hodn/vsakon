// Module for file I/O
const fs = require('fs');
// Module for CSV
const csvWriter = require('csv-write-stream');
const csvParser = require('csv-parser');
const path = require('path');

module.exports = class RecordHandler {
    constructor(settings) {
        this.directory = settings.csvDirectory,
            this.components = settings.csvComponents,
            this.writer = null,
            this.filePath = null,
            this.recording = false
    }

    // Loads user settings file if exists or creates new one with default values
    createCsvWriter(recordingStart) {

        const date = recordingStart.toISOString().split("T");
        const time = recordingStart.toTimeString().split(":")

        const fileName = date[0] + time[0] + time[1] + ".csv";
        this.filePath = path.join(this.directory, fileName);
        this.writer = csvWriter({
            separator: ';',
            newline: '\n',
            headers: undefined
        })

        this.writer.sendHeaders = fs.existsSync(this.filePath) ? false : true;

        this.writer.pipe(fs.createWriteStream(this.filePath, { flags: 'a' }));

        var that = this;
        setTimeout(function () {
            that.readFromCsv();
        }, 15000);
    }

    // Change the state of recording
    setRecording() {

        this.recording = !this.recording;

        if (this.recording === true) this.createCsvWriter(new Date());
        if (this.recording === false) this.stopWriteToCsv();
    }

    writeToCsv(packet) {
        this.writer.write(this.formatToCsv(packet))
    }

    stopWriteToCsv() {

        this.writer.end()
    }

    formatToCsv(packet) {

        const convert = (value) => this.dotToComma(value);
        let basic = packet.basicData;

        Object.keys(basic).forEach(function (key) {
            basic[key] = convert(basic[key]);
        })

        return basic;
    }

    dotToComma(value) {
        return value.toString().replace(/\./g, ',');
    }

    readFromCsv(path = this.filePath) {

        fs.createReadStream(path)
            .pipe(csvParser({ separator: ';' }))
            .on('data', (data) => console.log(data))
            .on('end', () => {
                console.log("end");
            });
    }
}
