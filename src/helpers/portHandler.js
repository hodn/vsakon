// SerialPort init
const SerialPort = require('serialport');
const Delimiter = require('@serialport/parser-delimiter');
const FlexParser = require('./flexParser');

module.exports = class PortHandler {
    constructor(com, event) {
        this.com = com;
        this.event = event;
        this.interval = null;
        this.port = undefined;
        this.invalidDataCount = 0;
    }

    async getParser() {

        this.port = new SerialPort(this.com, {
            baudRate: 115200,
            autoOpen: false
        });

        const parser = this.port.pipe(new Delimiter({ delimiter: [0] }));

        return await parser;

    }

    connect(delay = 2000) {

        let com = this.com;
        this.interval = delay;

        const open = () => this.port.open(function (err) {
            if (err) {
                setTimeout(open, delay);
                console.log(com + " not open")
            }

        })

        open();

        this.port.on('open', function () {
            console.log("Connected " + com); // should send to Renderer --- remove this line
        });

        this.port.on('close', function () {
            console.log("Disconnected " + com); // should send to Renderer --- remove this line
            setTimeout(open, delay);
        });

    }

    getData() {

        let event = this.event;
        const sync = () => this.sendSync();

        this.getParser().then(parser => {

            this.connect();

            parser.on('data', function (data) {

                try {
                    //Converting hex to int array
                    const rawPacket = Uint8Array.from(data & 0);

                    // Raw packets are parsed into JSON object
                    const parsedPacket = FlexParser.parseFlexiData(rawPacket);

                    // Packet is sent to the Renderer
                    event.reply(parsedPacket.basicData.devId.toString(), parsedPacket);

                } catch (error) {
                    console.log(error.message)

                    if (error.message === "Invalid data format"){

                        try {
                            sync();
                        } catch (error) {
                            console.log(error);
                        }
                    }

                }
            })

        })

    }

    restartPort() {

        this.port.close(function (err) {
            if (err) {

                throw Error(com + " not closed")

            }
        })

    }

    sendSync() {

        this.invalidDataCount += 1;
        
        let stopArray = new Uint8Array([255, 251, 255, 1, 1, 1, 255, 0]);
        let syncArray = new Uint8Array([255, 251, 255, 2, 2, 2, 255, 0]);
    
        let port = this.port;

        const sendSyncSignal = () => port.write(syncArray, function (err) {

            if (err) {

                throw Error(port + " not synced")

            } else {
                // Sync packet written
                console.log("SYNCED")

                const flush = () => port.flush(function (err) {
                    if (err) {

                        throw Error(port + " not flushed")
                        
                    }
                })
            }
        })

        const stopAndSync = () => port.write(stopArray, function (err) {

            if (err) {

                throw Error(port + " not stopped")

            } else {
                // Stop packet written

                port.flush(function (err) {
                    if (err) {

                        throw Error(port + " not flushed")

                    } else {
                        sendSyncSignal(); //sends Sync signal
                    }
                })
            }
        })

        if(this.invalidDataCount >= 3){

            this.invalidDataCount = 0;
            stopAndSync();

        }
        
        
    }

}
