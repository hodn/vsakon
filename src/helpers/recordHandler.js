// Module for file I/O
const fs = require('fs');
// Module for CSV
const csvWriter = require('csv-write-stream');
const path = require('path');
const electron = require('electron');

module.exports = class RecordHandler {
    constructor() {
            this.writer = null,
            this.filePath = null
    }

    // Loads user settings file if exists or creates new one with default values - CSV write init
    createCsvWriter(measurementName, locationName) {

        const fileName = locationName + "_"  + measurementName + "_" + new Date().toLocaleDateString() + ".csv";
        this.filePath = path.join(electron.app.getPath("documents"), fileName);
        this.writer = csvWriter({
            separator: ';',
            newline: '\n',
        })

        this.writer.sendHeaders = fs.existsSync(this.filePath) ? false : true; // Dont create headers if file already created

        this.writer.pipe(fs.createWriteStream(this.filePath, { flags: 'a' }));
    }


    writeToCsv(packet) {


        if (!fs.existsSync(this.filePath)) throw {type: "writeToCsv", message:"Source CSV removed."}
        try {
                        
            this.writer.write(this.formatToCsv(packet));

        } catch (err){
            console.log(err);
            throw {type: "writeToCsv", message:"Writing error"};
        }


    }

    // Flattening the JSON
    formatToCsv(packet) {

        const convert = (value) => this.dotToComma(value);

        Object.keys(packet).forEach(function (key) {
            packet[key] = convert(packet[key]);
        })

        return packet;
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
