module.exports = class PacketHandler {
    constructor(event) {
        this.event = event,
        this.packets = [],
        this.graphData = []
    }

    storeData(packet) {

        // Data formatted for the React-vis graph library
        const dataPoint = { x: packet.basicData.timestamp, y: packet.basicData.motionX };

        // If first data for the device
        if (this.graphData[packet.basicData.devId] === undefined) {

            this.graphData[packet.basicData.devId] = [dataPoint];
            this.packets[packet.basicData.devId] = packet;

        }
        else {

            // Already available timeseries
            let timeSeries = this.graphData[packet.basicData.devId];

            // Removes the first item - timeseries window adjustment
            if (timeSeries.length > 30) {

                this.graphData[packet.basicData.devId].shift();
            }

            // If the data is newer then last data in the timeseries - also removes receiver collision
            if (packet.basicData.timestamp > timeSeries[timeSeries.length - 1].x) {

                // If the timeseries resolution is too low - data points too far away -> reset the timeseries
                if(packet.basicData.timestamp - timeSeries[timeSeries.length - 1].x > 20000){

                    this.graphData[packet.basicData.devId] = [dataPoint];

                } else {

                    this.graphData[packet.basicData.devId].push(dataPoint);

                }
                
                this.packets[packet.basicData.devId] = packet;

                this.sendData(packet.basicData.devId);

            }


        }
    }

    sendData(id) {

        const packet = this.packets[id];
        const timeSeries = this.graphData[id];

        const data =  {
            packet,
            timeSeries
        };

        this.event.reply(id.toString(), data);
    }


}