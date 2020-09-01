module.exports = class PacketHandler {
    constructor(event) {
        this.coeffs = [],
            this.secs = [],
            this.soak = 0,
            this.locationName = "",
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

            const parsedLocation = this.convertGPS(packet);

            if (parsedLocation) {
                if (parsedLocation.quality === "fix") {
                    const lat = parsedLocation.lat;
                    const lon = parsedLocation.lon;
                    const raw = parsedLocation.raw;

                    const location = { lat, lon, raw }

                    this.onlineLocation = location;
                    setTimeout(this.isDataComing, 10000, location);
                }
            }

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
        this.locationName = "";
    }

    isDataComing(previousLocation) {

        if (this.onlineLocation !== previousLocation) {
            this.isOnline = true;
        } 
        else this.isOnline = false;

    }

    getDisplayData() {
        const coeffs = this.coeffs;
        const secs = this.secs;
        const soak = this.soak;
        const onlineLocation = this.onlineLocation;

        const data = {
            coeffs,
            secs,
            soak,
            onlineLocation
        }
        
        return data;
    }

    convertGPS(packet) {
        var GPS = require('gps');

        try {
            const location = GPS.Parse(packet);
            return location;
        } catch (err) {
            console.log(err.message);
        }


    }

}