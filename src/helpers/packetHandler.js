module.exports = class PacketHandler {
    constructor(event) {
        this.event = event,
            this.packets = [],
            this.activityGraphs = [],
            this.heartRateGraphs = [],
            this.recording = false
    }

    storeAndSendData(packet) {

        // First packet stored
        if (this.packets[packet.basicData.devId] === undefined) {
            this.packets[packet.basicData.devId] = packet;
        
        } // If the packet is newer than the stored one - avoiding collision of receivers 
        else if (this.packets[packet.basicData.devId].basicData.timestamp < packet.basicData.timestamp){
            this.packets[packet.basicData.devId] = packet;

        }

        // Because 2 and 3 are special values for measuring state of the sensor
        let specialHeartRatePacket = packet;
        if (specialHeartRatePacket.basicData.heartRate < 4) specialHeartRatePacket.basicData.heartRate = 0;

        this.appendToGraph(packet, this.activityGraphs, 'activity');
        this.appendToGraph(specialHeartRatePacket, this.heartRateGraphs, 'heartRate');

        this.sendData(packet.basicData.devId); // send to Renderer

    }

    sendData(id) {
        // Sending the packet to the renderer
        const packet = this.packets[id];
        const activityGraph = this.activityGraphs[id];
        const heartRateGraph = this.heartRateGraphs[id];

        const data = {
            packet,
            activityGraph,
            heartRateGraph
        };

        this.event.reply(id.toString(), data);
    }

    appendToGraph(packet, graphSet, valueName) {

        const dataPoint = { x: packet.basicData.timestamp, y: packet.basicData[valueName] };

        // If first data for the device
        if (graphSet[packet.basicData.devId] === undefined) {

            graphSet[packet.basicData.devId] = [dataPoint];

        }
        else {

            // If timeseries already available 
            let timeSeries = graphSet[packet.basicData.devId];

            // Removes the first item - timeseries window adjustment
            if (timeSeries.length > 30) {

                graphSet[packet.basicData.devId].shift();
            }

            // If the data is newer then last data in the timeseries - removes USB receiver collision
            if (packet.basicData.timestamp > timeSeries[timeSeries.length - 1].x) {

                // If the timeseries resolution is too low - data points too far away -> reset the timeseries
                if (packet.basicData.timestamp - timeSeries[timeSeries.length - 1].x > 20000) {

                    graphSet[packet.basicData.devId] = [dataPoint];

                } else {

                    graphSet[packet.basicData.devId].push(dataPoint);

                }

            }

        }
    }

    setRecording() {

        this.recording = !this.recording;
    }
}