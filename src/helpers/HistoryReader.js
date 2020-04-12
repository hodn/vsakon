// Simplify.js for sampling

module.exports = class PacketHandler {
    constructor(event, db) {
        this.event = event,
        //this.components = db.getRequiredGraphs    
        this.activity = [],
            this.heartRate = [],
            this.accX = [],
            this.accY = [],
            this.accZ = [],
            this.tempSkin = [],
            this.tempCloth = [],
            this.humidity = []
        // array of events - changing the value, if not null add to packet
    }

    storeData(packet){

        this.appendToGraph(packet, this.heartRate, "hearRate");
        this.appendToGraph(packet, this.tempSkin, "tempSkin");
        this.appendToGraph(packet, this.tempCloth, "tempCloth");
        this.appendToGraph(packet, this.humidity, "humidity");
        this.appendToGraph(packet, this.activity, "activity");
        this.appendToGraph(packet, this.accX, "accX");
        this.appendToGraph(packet, this.accY, "accY");
        this.appendToGraph(packet, this.accZ, "accZ");

    }
    
    appendToGraph(packet, graph, valueName){
        const dataPoint = { x: packet.basicData.timestamp, y: packet.basicData[valueName] };
        graph.push(dataPoint);
    }
}