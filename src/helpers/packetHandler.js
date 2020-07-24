module.exports = class PacketHandler {
    constructor() {
            this.coeffs = [],
            this.secs = [],
            this.soak = 0,
            this.gps = null,
            this.start = null,
            this.end = null

    }

    readCOM(packet){
        if(packet === "Waiting for activation") console.log("OFF"); // this wont be controlling the recording, just indication
        if(packet === "Starting soaking procedure") console.log("ON"); // this wont be controlling the recording, just indication
        if(packet.includes("Soak:")) console.log(packet);
        if(packet.includes("sec:")) console.log(packet);
        if(packet.includes("kv:")) console.log(packet);
    }

}