module.exports = class PacketHandler {
    constructor(event) {
        this.coeffs = [],
            this.secs = [],
            this.soak = 0,
            this.measurementLocation = null,
            this.isSoaking = false,
            this.isOnline = false,
            this.onlineLocation = null,
            this.event = event

    }

    readCOM(packet) {
        if (packet === "Waiting for activation") this.isSoaking = false;
        if (packet === "Starting soaking procedure") this.isSoaking = true;

        if (packet.includes("Soak:")) this.soak = this.getValue(packet);
        if (packet.includes("sec:")) this.secs.push(this.getValue(packet));
        if (packet.includes("kv:")) this.coeffs.push({ x: Date.now(), y: this.getValue(packet) });

        if (packet.includes("$GPGGA")) {
            this.onlineLocation = packet;
            this.convertGPS(packet);
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
    }

    isDataComing(previousLocation){

        return this.onlineLocation !== previousLocation ? this.isOnline = true : this.isOnline = false;
    }

    getDisplayData(){
        const coeffs = this.coeffs;
        const secs = this.secs;
        const soak = this.soak;
        const measurementLocation = this.measurementLocation;

        const data = {
            coeffs,
            secs,
            soak,
            measurementLocation
        }

        return data;
    }

    convertGPS(packet){
        let locData = packet.split(",");

        let lat = locData[2];
        let latDir = locData[3];
        let long = locData[4];
        let longDir = locData[5];
        let fix = locData[6];

        const data = {
            lat,
            latDir,
            long,
            longDir,
            fix
        }
        console.log(data);
        return data;
    }

}