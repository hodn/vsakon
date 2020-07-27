// Module for file I/O
const fs = require('fs');
// Module for CSV
const csvWriter = require('csv-write-stream');
const path = require('path');
const electron = require('electron');
const ipcMain = electron.ipcMain;

module.exports = class RecordHandler {
    constructor() {
            this.writer = null,
            this.filePath = null
    }

    // Loads user settings file if exists or creates new one with default values - CSV write init
    createCsvWriter() {

        const date = recordingStart.toISOString().split("T");
        const time = recordingStart.toTimeString().split(":");

        const fileName = date[0] + "-" + time[0] + time[1] + ".csv";
        this.filePath = path.join(this.directory, fileName);
        this.writer = csvWriter({
            separator: ';',
            newline: '\n',
            headers: this.createHeaders()
        })

        this.writer.sendHeaders = fs.existsSync(this.filePath) ? false : true; // Dont create headers if file already created

        this.writer.pipe(fs.createWriteStream(this.filePath, { flags: 'a' }));
    }


    writeToCsv(packet) {


        if (!fs.existsSync(this.filePath)) throw {type: "writeToCsv", message:"Source CSV removed."}
        try {
            
            if (packet.deadMan === false) packet.deadMan = ""; // Display empty instead of false in the CSV
            
            this.writer.write(this.formatToCsv(packet));

        } catch{
            throw {type: "writeToCsv", message:"Writing error"};
        }


    }

    // Creating header for new CSV with user settings
    createHeaders() {

        const basic = ["timestamp", "devId", "heartRate", "tempSkin", "tempCloth", "humidity", "activity", "accX", "accY", "accZ", "batteryVoltage", "batteryPercentage", "port", "deadMan", "event"];
        const performance = ["stehlik", "ee"];
        const location = ["latMins", "longMins", "fix", "sat", "hdop", "hgh"];
        let node = [];

        // Nodes
        for (let index = 0; index < 9; index++) {
            const unit = ["tempSkin_" + index.toString(), "humidity_" + index.toString(), "tempCloth_" + index.toString(), "motionX_" + index.toString(), "motionY_" + index.toString(), "motionZ_" + index.toString(), "activity_" + index.toString()];
            node = node.concat(unit);
        }

        // User settings - which to add
        let headers = basic;
        if (this.components.performanceData === true) headers = headers.concat(performance);
        if (this.components.locationData === true) headers = headers.concat(location);
        if (this.components.nodeData === true) headers = headers.concat(node);

        return headers;
    }

    // Flattening the JSON
    formatToCsv(packet) {

        const convert = (value) => this.dotToComma(value);

        let csvWriteString = {};
        Object.assign(csvWriteString, packet.basicData, { deadMan: packet.deadMan });
        if (packet.performanceData !== null && this.components.performanceData === true) Object.assign(csvWriteString, packet.performanceData);
        if (packet.locationData !== null && this.components.locationData === true) Object.assign(csvWriteString, packet.locationData);
        if (packet.nodeData !== null && this.components.nodeData === true) Object.assign(csvWriteString, packet.nodeData);

        Object.keys(csvWriteString).forEach(function (key) {
            csvWriteString[key] = convert(csvWriteString[key]);
        })

        return csvWriteString;
    }

    // Categorizing the data - nesting JSON
    formatFromCsv(packet) {

        const convert = (value) => this.commaToDot(value);

        const basicData = {
            timestamp: convert(packet.timestamp),
            devId: convert(packet.devId),
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

        const deadMan = packet.deadMan === "true" ? true : false;
    
        const locationData = convert(packet.latMins) ? {
            latMins: convert(packet.latMins),
            longMins: convert(packet.longMins),
            fix: convert(packet.fix),
            sat: convert(packet.sat),
            hdop: convert(packet.hdop),
            hgh: convert(packet.hgh),
        } : null;

        let nodeData = {};

        if (packet["tempSkin_1"]) {
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

    // to Czech locale
    dotToComma(value) {
        return value.toString().replace(/\./g, ',');
    }

    // from Czech locale
    commaToDot(value) {
                
        let convertedValue = value ? parseFloat(value.replace(',', '.').replace(' ', '')) : 0;

        return convertedValue;
    }
}
