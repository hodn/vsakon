module.exports = class PacketHandler {
    constructor() {
        this.graphData = []
    }

    getData(packet) {

        // Data formatted for the React-vis graph library
        const dataPoint = { x: packet.basicData.timestamp, y: packet.basicData.motionX };


        // First data for the device
        if (this.graphData[packet.basicData.devId] === undefined) {

            this.graphData[packet.basicData.devId] = [dataPoint];

            return { data: packet, graphData: this.graphData[packet.basicData.devId] };

        }
        else {

            // Already available timeseries
            let timeSeries = this.graphData[packet.basicData.devId];

            // If the data is newer then last in the timeseries
            if (packet.basicData.timestamp > timeSeries[timeSeries.length - 1].x) {

                if(packet.basicData.timestamp - timeSeries[timeSeries.length - 1].x > 6500){

                    this.graphData[packet.basicData.devId] = [dataPoint]

                }
                else{

                    timeSeries.push(dataPoint);
                }

            
               
            }

            // Removes the first item - timeseries window
            if (timeSeries.length > 30) {

                timeSeries.shift();
            }

            return {
                data: packet,
                graphData: timeSeries
            };

        }
    }
}