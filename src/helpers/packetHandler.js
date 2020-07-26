module.exports = class PacketHandler {
    constructor(event) {
        this.coeffs = [],
            this.secs = [],
            this.soak = 0,
            this.measurementLocation = null,
            this.measurementStart = null,
            this.measurementEnd = null,
            this.isSoaking = false,
            this.isOnline = false,
            this.onlineLocation = null,
            this.event = event

    }

    readCOM(packet) {
        if (packet === "Waiting for activation") this.isSoaking = false; // this wont be controlling the recording, just indication
        if (packet === "Starting soaking procedure") this.isSoaking = true; // this wont be controlling the recording, just indication

        if (packet.includes("Soak:")) this.soak = this.getValue(packet);
        if (packet.includes("sec:")) this.secs.push(this.getValue(packet));
        if (packet.includes("kv:")) this.coeffs.push({ x: Date.now(), y: this.getValue(packet) });

        if (packet.includes("$GPGGA")) {
            this.onlineLocation = packet;
            setTimeout(this.isDataComing, 10000, packet);
            if (this.isSoaking) this.measurementLocation = packet;
        }
    }

    getValue(string) {
        const split = string.split(" ");
        return parseFloat(split[1]);
    }

    resetMeasurement() {
        this.coeffs = [];
            this.secs = [];
            this.soak = 0;
            this.measurementLocation = null;
            this.measurementStart = null;
            this.measurementEnd = null;
    }

    isDataComing(previousLocation){

        return this.onlineLocation !== previousLocation ? this.isOnline = true : this.isOnline = false;
    }

    getDisplayData(){
        const coeffs = this.coeffs;
        const soak = this.soak;
        const measurementLocation = this.measurementLocation;
        const measurementStart = this.measurementStart;
        const measurementEnd = this.measurementEnd;

        const data = {
            coeffs,
            soak,
            measurementLocation,
            measurementStart,
            measurementEnd
        }

        return data;
    }

}