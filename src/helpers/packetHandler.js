module.exports = class PacketHandler {
    constructor() {
        this.graphData = []
    }

    getData(packet) {

        const dataPoint = { x: packet.basicData.timestamp, y: packet.basicData.motionX };

        if (this.graphData[packet.basicData.devId] === undefined) {

            this.graphData[packet.basicData.devId] = [dataPoint];

            return { data: packet, graphData: this.graphData[packet.basicData.devId]};

        }
        else {

            const timeSeries = this.graphData[packet.basicData.devId];
            
            if (packet.basicData.timestamp > timeSeries[timeSeries.length - 1].x) {

                timeSeries.push(dataPoint);
            }

            return { data: packet, graphData: timeSeries };

        }
    }
}