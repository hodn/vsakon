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
            this.recording = false,
            this.test = null;
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
    }

    // Change the state of recording
    setRecording() {

        this.recording = !this.recording;
        const date = new Date();
        this.test = Date.now();

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

        this.writer.write(this.formatToCsv(packet));
        /*if (packet.basicData.timestamp - this.test < 3000){
            for (let index = 0; index < 4000; index++) {
                csvWriteString.timestamp = (3000 * index) + parseInt(csvWriteString.timestamp); 
                this.writer.write(this.formatToCsv(csvWriteString))
            }
        }*/
    }

    formatToCsv(packet) {

        const convert = (value) => this.dotToComma(value);

        Object.keys(packet).forEach(function (key) {
            packet[key] = convert(packet[key]);
        })

        let csvWriteString = {};
        Object.assign(csvWriteString, packet.basicData, { deadMan: packet.deadMan });
        if (packet.performanceData !== null && this.components.performanceData === true) Object.assign(csvWriteString, packet.performanceData);
        if (packet.locationData !== null && this.components.locationData === true) Object.assign(csvWriteString, packet.locationData);
        if (packet.nodeData !== null && this.components.nodeData === true) Object.assign(csvWriteString, packet.nodeData);

        return csvWriteString;
    }

    formatFromCsv(packet) {

        const convert = (value) => this.commaToDot(value);

        const basicData = {
            timestamp: convert(packet.timestamp),
            devId: packet.devId,
            heartRate: convert(packet.heartRate),
            tempSkin: convert(packet.tempSkin),
            tempCloth: convert(packet.tempCloth),
            humidity: convert(packet.humidity),
            activity: convert(packet.activity),
            accX: convert(packet.accX),
            accY: convert(packet.accY),
            accZ: convert(packet.accZ),
            // breathRate: packet.breathRate,
            batteryVoltage: convert(packet.batteryVoltage),
            batteryPercentage: convert(packet.batteryPercentage),
            port: packet.port
        }

        const performanceData = packet.stehlik ? {
            stehlik: convert(packet.stehlik),
            ee: convert(packet.ee)
        } : null;

        const deadMan = packet.deadMan;

        const locationData= packet.detected ? {
            latMins: convert(packet.latMins),
            longMins: convert(packet.longMins),
            fix: convert(packet.fix),
            sat: convert(packet.sat),
            dilution: convert(packet.dilution),
            alt: convert(packet.alt),
            detected: packet.detected
        } : null;

        let nodeData = {};

        if (packet["connected_3"]) {
            for (let i = 0; i < 9; i++) {
                nodeData["connected_" + i.toString()] = packet["connected_" + i.toString()];
                nodeData["tempSkin_" + i.toString()] = convert(packet["tempSkin_" + i.toString()]);
                nodeData["tempCloth_" + i.toString()] = convert(packet["tempCloth_" + i.toString()]);
                nodeData["humidity_" + i.toString()] = convert(packet["humidity_" + i.toString()]);
                nodeData["motionX_" + i.toString()] = convert(packet["motionX_" + i.toString()]);
                nodeData["motionY_" + i.toString()] = convert(packet["motionY_" + i.toString()]);
                nodeData["motionZ_" + i.toString()] = convert(packet["motionZ_" + i.toString()]);
                nodeData["activity_" + i.toString()] = convert(packet["activity_" + i.toString()]);
            }
        } else nodeData = null;

        const parsedData = {
            basicData,
            deadMan,
            locationData,
            nodeData,
            performanceData
        };

        return parsedData;
    }   

    dotToComma(value) {
        return value.toString().replace(/\./g, ',');
    }

    commaToDot(value) {
        let convertedValue = parseFloat(value.replace(',', '.').replace(' ', ''));

        return convertedValue ? convertedValue : 0;
    }

    readFromCsv() {

        let readStream = fs.createReadStream("C:\\Users\\Hoang\\Desktop\\2020-04-12-1927.csv")
            .pipe(csvParser({ separator: ';' }))
            .on('data', (data) => {

                console.log(this.formatFromCsv(data))
                readStream.destroy()


            })
            .on('end', () => {
                console.log("END");
            });
    }

    createHeaders() {

        const basic = ["timestamp", "devId", "heartRate", "tempSkin", "tempCloth", "humidity", "activity", "accX", "accY", "accZ", "batteryVoltage", "batteryPercentage", "port", "deadMan"];
        const performance = ["stehlik", "ee"];
        const location = ["latMins", "longMins", "fix", "sat", "dilution", "alt", "detected"];
        let node = [];

        for (let index = 0; index < 9; index++) {
            const unit = ["connected_" + index.toString(), "tempSkin_" + index.toString(), "humidity_" + index.toString(), "tempCloth_" + index.toString(), "motionX_" + index.toString(), "motionY_" + index.toString(), "motionZ_" + index.toString(), "activity_" + index.toString()];
            node = node.concat(unit);
        }

        let headers = basic;
        if (this.components.performanceData === true) headers = headers.concat(performance);
        if (this.components.locationData === true) headers = headers.concat(location);
        if (this.components.nodeData === true) headers = headers.concat(node);

        return headers;
    }
}
