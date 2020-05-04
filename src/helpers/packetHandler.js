module.exports = class PacketHandler {
    constructor(event, db) {
        this.event = event,
            this.packets = [],
            this.profiles = db.getSelectedTeam(false).members,
            this.graphLength = db.getSettings().graphLength,
            this.activityGraphs = [],
            this.heartRateGraphs = [],
            this.tempSkinGraphs = [],
            this.accXGraphs = [],
            this.accYGraphs = [],
            this.accZGraphs = [],
            this.events = []
    }

    // Storing the state and sending the data to Renderer
    storeAndSendState(packet, port) {

        const devSlot = packet.basicData.devId - 1;
        const newPacket = this.packets[devSlot] === undefined ? true : (packet.basicData.timestamp - this.packets[devSlot].basicData.timestamp > 500)

        // // If the packet is newer than the stored one - avoiding collision of receivers or first packet
        if (newPacket) {

            // Sent from port
            packet.basicData.port = port;

            // If there is event registered for the device
            if(this.events[devSlot]){
                packet.basicData.event = this.events[devSlot];
            }

            this.events[devSlot] = null;

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
            this.appendToGraph(packet, this.tempSkinGraphs, 'tempSkin');
            this.appendToGraph(packet, this.accXGraphs, 'accX');
            this.appendToGraph(packet, this.accYGraphs, 'accY');
            this.appendToGraph(packet, this.accZGraphs, 'accZ');

            this.packets[devSlot] = packet;

            // Send to Renderer for device with ID...
            this.sendData(packet.basicData.devId);

            return this.packets[devSlot];

        } else return false; // Packet was not stored - don't manipulate with it further

    }

    // Sending the packet to the renderer
    sendData(devId) {

        const devSlot = devId - 1;

        const packet = this.packets[devSlot];
        const activityGraph = this.activityGraphs[devSlot];
        const heartRateGraph = this.heartRateGraphs[devSlot];
        const tempSkinGraph = this.tempSkinGraphs[devSlot];
        const accXGraph = this.accXGraphs[devSlot];
        const accYGraph = this.accYGraphs[devSlot];
        const accZGraph = this.accZGraphs[devSlot];

        const data = {
            packet,
            activityGraph,
            heartRateGraph,
            tempSkinGraph,
            accXGraph,
            accYGraph,
            accZGraph
        };

        this.event.sender.send(devId.toString(), data);
    }

    // Resending the state to components that unmounted - MainView
    sendState() {

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

            // Removes the first item - timeseries window adjustment - 20 packets per minute (settings are in minutes)
            if (timeSeries.length > (this.graphLength * 20)) {

                const removeCount = timeSeries.length - (this.graphLength * 20); // 20 packets per minute (settings are in minutes)
                graphSet[devSlot].splice(0, removeCount);
            }

            // If the timeseries resolution is too low - data points too far away -> reset the timeseries
            if (packet.basicData.timestamp - timeSeries[timeSeries.length - 1].x > 20000) {

                graphSet[devSlot] = [dataPoint];

            } else {

                graphSet[devSlot].push(dataPoint);

            }



        }
    }

    calculatePerformaceData(packet) {

        const user = this.profiles[packet.basicData.devId - 1]; // Selects the user profile to calculate for
        const vRest = (9.99 * parseInt(user.weight) + 6.25 * parseInt(user.height) + 4.92 * parseInt(user.age) + 5) * 0.144762299;
        let ee = (packet.basicData.heartRate - parseInt(user.hrRest)) / (parseInt(user.hrMax) - parseInt(user.hrRest)) * (parseInt(user.vMax) - vRest);
        ee = (((ee + vRest) * 0.35) / user.weight).toFixed(1);


        const performanceData = {
            stehlik: parseInt((100 * packet.basicData.heartRate / user.hrRef).toFixed(0)),
            ee: parseFloat(ee)
        }

        return performanceData;
    }
    
    sendUserProfiles() {

        for (let index = 0; index < this.profiles.length; index++) {

            this.event.sender.send((index + 1).toString() + "-profile", this.profiles[index]);
        }
    }
}