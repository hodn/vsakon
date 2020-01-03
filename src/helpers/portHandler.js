// SerialPort init
const SerialPort = require('serialport');
const Delimiter = require('@serialport/parser-delimiter');
const FlexParser = require('./flexParser');

module.exports = class PortHandler {
    constructor(com) {
        this.com = com;
        this.interval = null;
    }

    async connect(delay = 2000) {

        this.interval = delay;
        const com = this.com;

        let port = new SerialPort(this.com, {
            baudRate: 115200,
            autoOpen: false
        });

        const open = () => port.open(function (err) {
            if (err) {
                setTimeout(open, delay);
                return //console.log('Error opening port: ', err.message)
            }
          
          })

        open();

        port.on('open', function () {
            //console.log("Connected " + com);
        });

        port.on('close', function () {
            //console.log("Disconnected " + com);
            setTimeout(open, delay);
        });

        const parser = port.pipe(new Delimiter({ delimiter: [0] }));

        return await parser;        
        
    }


}
