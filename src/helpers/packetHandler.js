const RecordHandler = require('./recordHandler');

module.exports = class PacketHandler {
    constructor(event, app) {
        this.event = event,
            this.packets = [],
            this.activityGraphs = [],
            this.heartRateGraphs = [],
            this.recordHandler = new RecordHandler(app);
            this.recording = false,
            this.recordingStart = null;
    }

    // Storing the state and sending the data to Renderer
    storeAndSendState(packet) {

        const devSlot = packet.basicData.devId - 1;

        // First packet stored
        if (this.packets[devSlot] === undefined) {
            this.packets[devSlot] = packet;
        
        } // If the packet is newer than the stored one - avoiding collision of receivers 
        else if (this.packets[devSlot].basicData.timestamp < packet.basicData.timestamp){
            this.packets[devSlot] = packet;

        }

        // Because 2 and 3 are special values for measuring state of the sensor
        let specialHeartRatePacket = packet;
        if (specialHeartRatePacket.basicData.heartRate < 4) specialHeartRatePacket.basicData.heartRate = 0;

        this.appendToGraph(packet, this.activityGraphs, 'activity');
        this.appendToGraph(specialHeartRatePacket, this.heartRateGraphs, 'heartRate');

        this.sendData(packet.basicData.devId); // send to Renderer

        if (this.recording === true) this.recordHandler.writeToCsv(packet);
    }

    // Sending the packet to the renderer
    sendData(devId) {
        
        const devSlot = devId - 1;

        const packet = this.packets[devSlot];
        const activityGraph = this.activityGraphs[devSlot];
        const heartRateGraph = this.heartRateGraphs[devSlot];

        const data = {
            packet,
            activityGraph,
            heartRateGraph
        };

        this.event.reply(devId.toString(), data);
    }

    // Resending the state to components that unmounted - mainly in MainView
    resendState(){
        
        this.packets.forEach(packet => {

            if (packet !== undefined && Date.now() - packet.basicData.timestamp < 2500) {

                this.sendData(packet.basicData.devId);

            }
            
        });

    }

    // Appending the data for timeseries
    appendToGraph(packet, graphSet, valueName) {

        const dataPoint = { x: packet.basicData.timestamp, y: packet.basicData[valueName] };
        const devSlot = packet.basicData.devId - 1;

        // If first data for the device
        if (graphSet[devSlot] === undefined) {

            graphSet[devSlot] = [dataPoint];

        }
        else {

            // If timeseries already available 
            let timeSeries = graphSet[devSlot];

            // Removes the first item - timeseries window adjustment
            if (timeSeries.length > 30) {

                graphSet[devSlot].shift();
            }

            // If the data is newer then last data in the timeseries - removes USB receiver collision
            if (packet.basicData.timestamp > timeSeries[timeSeries.length - 1].x) {

                // If the timeseries resolution is too low - data points too far away -> reset the timeseries
                if (packet.basicData.timestamp - timeSeries[timeSeries.length - 1].x > 20000) {

                    graphSet[devSlot] = [dataPoint];

                } else {

                    graphSet[devSlot].push(dataPoint);

                }

            }

        }
    }

    // Change the state of recording
    setRecording() {

        this.recording = !this.recording;

        if (this.recording === true) this.recordHandler.createCsvWriter(new Date());
        if (this.recording === false) this.recordHandler.stopWriteToCsv();
    }
}