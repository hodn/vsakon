// SerialPort init
const SerialPort = require('serialport');
const Delimiter = require('@serialport/parser-delimiter');

module.exports = class PortHandler {
    constructor(com, event) {
        this.com = com;
        this.interval = null;
        this.port = null;
        this.event = event;
    }

    // Returns parser for selected port
    async getParser() {

        // Configuring parser for reading from port
        this.port = new SerialPort(this.com, {
            baudRate: 115200,
            autoOpen: false
        });

        const parser = this.port.pipe(new Delimiter({ delimiter: '\n' })); //'\n'

        return await parser;

    }

    // (Re)opening the port
    connect(delay = 2000) {

        let com = this.com;
        let event = this.event;

        // Not connected state - how often to attempt to connect
        this.interval = delay;

        // Opening the port - recursion if not opened
        const open = () => this.port.open(function (err) {
            if (err) {
                setTimeout(open, delay);
                //console.log(com + " not open")
            }

        })

        open();

        // If open - inform Renderer
        this.port.on('open', function () {
            console.log("Connected " + com);
            let portState = { port: com, state: "opened" };
            event.sender.send('port-state', portState); // Send the state to Renderer
        });

        // If closed - inform Renderer
        this.port.on('close', function () {
            console.log("Disconnected " + com);
            let portState = { port: com, state: "closed" };
            event.sender.send('port-state', portState); // Send the state to Renderer
            setTimeout(open, delay);
        });

    }

    // Sends command for Vsakon unit
    sendCommand(command) {

        // Send sync signal and flush port
        this.port.write(command, function (err) {

            if (err) {

                console.error(port + " action not done: " + command)

            } else {
                // Sync packet written
                port.flush(function (err) {
                    if (err) {

                        console.error(port + " not flushed")

                    }
                })
            }
        })




    }

}
