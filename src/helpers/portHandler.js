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

        // Configuring parser for reading from port
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

        // Opening the port
        const open = () => this.port.open(function (err) {
            if (err) {
                setTimeout(open, delay);
                //console.log(com + " not open")
            }

        })

        open();

        // If open - inform Renderer
        this.port.on('open', function () {
            console.log("Connected " + com); // should send to Renderer --- remove this line
        });

        // If closed - inform Renderer
        this.port.on('close', function () {
            console.log("Disconnected " + com); // should send to Renderer --- remove this line
            setTimeout(open, delay);
        });

    }

    getData() {

        let event = this.event;
        const sync = () => this.sendSync();

        this.getParser().then(parser => {

            // Connecting port after configuring the parser
            this.connect();

            // No data for 10 seconds after connecting port -> restart connection
            let dataFlowing = false;
            const check = () => this.checkDataFlow(dataFlowing);
            setTimeout(check, 10000)

            // Listener for data on the port
            parser.on('data', function (data) {

                dataFlowing = true;
                
                try {
                    //Converting hex to int array
                    const rawPacket = Uint8Array.from(data);

                    // Raw packets are parsed into JSON object via FlexParser lib
                    const parsedPacket = FlexParser.parseFlexiData(rawPacket);

                    // Packet is sent to the Renderer
                    event.reply(parsedPacket.basicData.devId.toString(), parsedPacket);

                } catch (error) {
                    //console.log(error.message)

                    // Devices out of sync - sending invalid data format
                    if (error.message === "Invalid data format") {

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
       
        let com = this.com
        // Closing the port - connect method automatically attempts to reconnect afterwards
        this.port.close(function (err) {
            if (err) {

                console.log(com + " not closed");

            } else {
                console.log("Restarting connection " + com);
            }
        })

    }

    sendSync() {

        this.invalidDataCount += 1;

        let stopArray = new Uint8Array([255, 251, 255, 1, 1, 1, 255, 0]);
        let syncArray = new Uint8Array([255, 251, 255, 2, 2, 2, 255, 0]);

        let port = this.port;

        // Send sync signal and flush port
        const sendSyncSignal = () => port.write(syncArray, function (err) {

            if (err) {

                throw Error(port + " not synced")

            } else {
                // Sync packet written
                console.log("Syncing")
                port.flush(function (err) {
                    if (err) {

                        throw Error(port + " not flushed")

                    }
                })
            }
        })

        // Stop and flush port -> call sendSyncSignal function
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

        // If there are 3 invalid packets in the row - sync devices & reconnect the port
        if (this.invalidDataCount >= 3) {

            this.invalidDataCount = 0;
            stopAndSync();

        }


    }

    checkDataFlow(dataFlowing){

        const restart = () => this.restartPort();
        
        if(dataFlowing === false){

            restart()
        }

    }

}
