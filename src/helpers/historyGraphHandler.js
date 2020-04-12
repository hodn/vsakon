// Simplify.js for sampling

module.exports = class HistoryGraphHandler {
    constructor() {
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

        this.appendToGraph(packet, this.heartRate, 'heartRate');
        this.appendToGraph(packet, this.tempSkin, "tempSkin");
        this.appendToGraph(packet, this.tempCloth, "tempCloth");
        this.appendToGraph(packet, this.humidity, "humidity");
        this.appendToGraph(packet, this.activity, "activity");
        this.appendToGraph(packet, this.accX, "accX");
        this.appendToGraph(packet, this.accY, "accY");
        this.appendToGraph(packet, this.accZ, "accZ");

    }
    
    appendToGraph(packet, graph, valueName){
        let dataPoint = { x: packet.basicData.timestamp, y: packet.basicData[valueName] };
        graph.push(dataPoint);
    }

    getGraphs(){
        const graphs = {
            hearRate: this.heartRate,
            activity: this.activity,
            accX: this.accX,
            accY: this.accY,
            accZ: this.accZ,
            tempSkin: this.tempSkin,
            tempCloth: this.tempCloth,
            humidity: this.humidity
        }
        return graphs;
    }
}