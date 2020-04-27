// SerialPort init
const SerialPort = require('serialport');
const Delimiter = require('@serialport/parser-delimiter');

module.exports = class PortHandler {
    constructor(com, event) {
        this.com = com;
        this.interval = null;
        this.port = null;
        this.invalidDataCount = 0;
        this.event = event;
    }

    // Returns parser for selected port
    async getParser() {

        // Configuring parser for reading from port
        this.port = new SerialPort(this.com, {
            baudRate: 115200,
            autoOpen: false
        });

        const parser = this.port.pipe(new Delimiter({ delimiter: [0] }));

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

        const helperPort = this.port;

        // If open - inform Renderer
        this.port.on('open', function () {
            console.log("Connected " + com); 
            let portState = {port: com, state: "opened"};
            helperPort.read();
            event.sender.send('port-state', portState); // Send the state to Renderer
        });

        // If closed - inform Renderer
        this.port.on('close', function () {
            console.log("Disconnected " + com); 
            let portState = {port: com, state: "closed"};
            event.sender.send('port-state', portState); // Send the state to Renderer
            setTimeout(open, delay);
        });

    }

    // Consider re-implementation
    restartPort() {
        let com = this.com;
        // Closing the port - connect method automatically attempts to reconnect afterwards
        this.port.close(function (err) {
            if (err) {

                console.log(com + " not closed");

            } else {
                console.log("Restarting connection " + com);
            }
        })

    }

    // Sends syncing signal to all devices - all ports
    sendSync(forced, delay) {

        this.invalidDataCount += 1;

        const stopArray = new Uint8Array([255, 251, 255, 1, 1, 1, 255, 0]);
        const syncArray = new Uint8Array([255, 251, 255, 2, 2, 2, 255, 0]);

        const port = this.port;

        // Stop and flush port -> call sendSyncSignal function
        const stopAndSync = () => port.write(stopArray, function (err) {

            if (err) {

                console.error(port + " not stopped")

            } else {
                // Stop packet written

                port.flush(function (err) {
                    if (err) {

                        console.error(port + " not flushed")

                    } else {
                        setTimeout(function() {
                            sendSyncSignal(port);
                        }, 50); //sends Sync signal
                    }
                })
            }
        })

        // Send sync signal and flush port
        const sendSyncSignal = (port) => port.write(syncArray, function (err) {

            if (err) {

                console.error(port + " not synced")

            } else {
                // Sync packet written
                console.log("Syncing")
                port.flush(function (err) {
                    if (err) {

                        console.error(port + " not flushed")

                    }
                })
            }
        })

        // If there are 3 invalid packets in the row or user-force sync -> sync devices & reconnect the port
        if (this.invalidDataCount >= 3 || forced) {

            this.invalidDataCount = 0;
            setTimeout(stopAndSync, delay)

        }


    }

    // Removes alarm for device
    removeAlarm(devId) {

        let alarmArray = new Uint8Array([255, 251, devId, 10, 10, 10, 255, 0]);
        let port = this.port

        port.write(alarmArray, function (err) {

            if (err) {

                console.error(devId + " alarm not removed")

            } else {
                // Alarm off packet written
                console.log("Removed alarm: " + devId);
                port.drain(function (err) {
                    if (err) {

                        console.error(port + " not drained")

                    }
                })
            }
        })
    }

}
