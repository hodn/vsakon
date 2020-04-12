// Module for file I/O
const fs = require('fs');
// Module for CSV
const csvWriter = require('csv-write-stream');
const csvParser = require('csv-parser');
const path = require('path');

module.exports = class RecordHandler {
    constructor(db) {
        this.directory = db.getSettings().csvDirectory,
            this.components = db.getSettings().csvComponents,
            this.db = db,
            this.writer = null,
            this.filePath = null,
            this.recordId = null,
            this.recording = false
    }

    // Loads user settings file if exists or creates new one with default values
    createCsvWriter(recordingStart) {

        const date = recordingStart.toISOString().split("T");
        const time = recordingStart.toTimeString().split(":");

        const fileName = date[0] + "-" + time[0] + time[1] + ".csv";
        this.filePath = path.join(this.directory, fileName);
        this.writer = csvWriter({
            separator: ';',
            newline: '\n',
            headers: this.createHeaders()
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
        const date = new Date();

        if (this.recording === true) {

            this.createCsvWriter(date);
            this.recordId = this.db.addRecord(date.toLocaleString(), this.filePath); // Make a new DB record
        }
        else {
            this.db.updateRecord(this.recordId, { end: date.toLocaleString() }); // Add end time to DB record
            this.recordId = null;
            this.writer.end()
        }
    }

    writeToCsv(packet) {

        let csvWriteString = {};
        Object.assign(csvWriteString, packet.basicData, {deadMan: packet.deadMan});
        if (packet.performanceData !== null && this.components.performanceData === true) Object.assign(csvWriteString, packet.performanceData);
        if (packet.locationData !== null && this.components.locationData === true) Object.assign(csvWriteString, packet.locationData);
        if (packet.nodeData !== null && this.components.nodeData === true) Object.assign(csvWriteString, packet.nodeData);

        this.writer.write(this.formatToCsv(csvWriteString))
    }

    formatToCsv(packet) {

        const convert = (value) => this.dotToComma(value);

        Object.keys(packet).forEach(function (key) {
            packet[key] = convert(packet[key]);
        })

        return packet;
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

    createHeaders(){

        const basic = ["timestamp","devId","heartRate","tempSkin","tempCloth","humidity","activity","accX","accY","accZ","batteryVoltage","batteryPercentage","port","deadMan"];
        const performance = ["stehlik","ee"];
        const location =  ["latMins","longMins","fix","sat","dilution","alt","detected"];
        let node = [];
        
        for (let index = 0; index < 9; index++) {
            const unit = ["connected_" + index.toString(),"tempSkin_" + index.toString(), "humidity_" + index.toString(),"tempCloth_" + index.toString(),"motionX_" + index.toString(),"motionY_" + index.toString(),"motionZ_" + index.toString(),"activity_" + index.toString()];
            node = node.concat(unit);
        }

        let headers = basic;
        if (this.components.performanceData === true) headers = headers.concat(performance);
        if (this.components.locationData === true) headers = headers.concat(location);
        if (this.components.nodeData === true) headers = headers.concat(node);
        
        return headers;
    }
}
