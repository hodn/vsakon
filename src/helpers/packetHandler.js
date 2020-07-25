module.exports = class PacketHandler {
    constructor() {
        this.coeffs = [],
            this.secs = [],
            this.soak = 0,
            this.measurementLocation = null,
            this.measurementStart = null,
            this.measurementEnd = null,
            this.isSoaking = false,
            this.onlineLocation = null

    }

    readCOM(packet) {
        if (packet === "Waiting for activation") this.isSoaking = false; // this wont be controlling the recording, just indication
        if (packet === "Starting soaking procedure") this.isSoaking = true; // this wont be controlling the recording, just indication

        if (packet.includes("Soak:")) this.soak = this.getValue(packet);
        if (packet.includes("sec:")) this.secs.push(this.getValue(packet));
        if (packet.includes("kv:")) this.coeffs.push({ x: Date.now(), y: this.getValue(packet) });

        if (packet.includes("$GPGGA")) {
            this.onlineLocation = packet;

            if (this.isSoaking) this.measurementLocation = packet; //also not the same as already stored
        }

        console.log(this.measurementLocation);
    }

    getValue(string) {
        const split = string.split(" ");
        return split[1];
    }

    resetMeasurement() {
        this.coeffs = [];
            this.secs = [];
            this.soak = 0;
            this.measurementLocation = null;
            this.measurementStart = null;
            this.measurementEnd = null;
    }

}