module.exports = class PacketHandler {
    constructor(event, db) {
        this.event = event,
            this.packets = [],
            this.profiles = db.getSelectedTeam().members,
            this.activityGraphs = [],
            this.heartRateGraphs = []
    }

    // Storing the state and sending the data to Renderer
    storeAndSendState(packet, port) {

        const devSlot = packet.basicData.devId - 1;
        const newPacket = this.packets[devSlot] === undefined ? true : (packet.basicData.timestamp - this.packets[devSlot].basicData.timestamp > 500)

        // // If the packet is newer than the stored one - avoiding collision of receivers or first packet
        if (newPacket) {
            
            // Sent from port
            packet.basicData.port = port;

            // Because 2 and 3 are special values for measuring state of the sensor
            let specialHeartRatePacket = packet;
            if (specialHeartRatePacket.basicData.heartRate < 4) {
                specialHeartRatePacket.basicData.heartRate = 0;
                packet.performanceData = null;
            } 
            else {
                packet.performanceData = this.calculatePerformaceData(packet);
            }

            this.appendToGraph(packet, this.activityGraphs, 'activity');
            this.appendToGraph(specialHeartRatePacket, this.heartRateGraphs, 'heartRate');

            this.packets[devSlot] = packet;

            // Send to Renderer for device with ID...
            this.sendData(packet.basicData.devId); 

            return this.packets[devSlot];

        } else return false;

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
    resendState() {

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

            // If the timeseries resolution is too low - data points too far away -> reset the timeseries
            if (packet.basicData.timestamp - timeSeries[timeSeries.length - 1].x > 20000) {

                graphSet[devSlot] = [dataPoint];

            } else {

                graphSet[devSlot].push(dataPoint);

            }



        }
    }

    calculatePerformaceData(packet){
        
        const user = this.profiles[packet.basicData.devId-1];
        const vRest = (9.99 * parseInt(user.weight) + 6.25 * parseInt(user.height) + 4.92 * parseInt(user.age) + 5) * 0.144762299;
        let ee = (packet.basicData.heartRate - parseInt(user.hrRest)) / ( parseInt(user.hrMax) - parseInt(user.hrRest)) * (parseInt(user.vMax) - vRest );
        ee = (((ee + vRest ) * 0.35 ) / user.weight).toFixed(1);


        const performanceData = {
            stehlik: parseInt((100 * packet.basicData.heartRate / user.hrRef).toFixed(0)),
            ee: parseFloat(ee)
        }

        return performanceData;
    }
}