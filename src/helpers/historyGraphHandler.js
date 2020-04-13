// Simplify.js for sampling of large datasets
const simplify = require('simplify-js');

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
        
        // Simplify (dataset, the tolerance in the data units(i.e. heartRate - 3BPM tolerance), higher precision - slower)
        
        const graphs = {
            heartRate: simplify(this.heartRate, 3, false),
            activity: simplify(this.activity, 10, false),
            accX: simplify(this.accX, 0.1, false),
            accY: simplify(this.accY, 0.1, false),
            accZ: simplify(this.accZ, 0.1, false),
            tempSkin: simplify(this.tempSkin, 0.3, false),
            tempCloth: simplify(this.tempCloth, 0.3, false),
            humidity: simplify(this.humidity, 5, false),
        }
        return graphs;
    }
}