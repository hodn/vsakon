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
                throw Error(com + " not open")
            }

        })

        open();

        this.port.on('open', function () {
            console.log("Connected " + com);
        });

        this.port.on('close', function () {
            console.log("Disconnected " + com);
            setTimeout(open, delay);
        });

    }

    getData() {

        let event = this.event

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

                    if (error.message === "Invalid data format") {

                        // send sync signal()-> (badData after X times - reconnect)
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

}

