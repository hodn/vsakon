module.exports.parseFlexiData = function parseRawData(rawArray) {

    const slicedArrays = sliceArray(rawArray);

    const basicData = parseBasicData(slicedArrays.rawBasicData);
    const deadMan = slicedArrays.deadMan % 2 ? false : true;
    const locationData = slicedArrays.rawLocationData === undefined ? null : parseLocationData(slicedArrays.rawLocationData);
    const nodeData = slicedArrays.rawNodeData === undefined ? null : parseNodeData(slicedArrays.rawNodeData);

    // Acceleration factor for modules with GPS 
    if (locationData !== null) {

        basicData.accX *= 4.0;
        basicData.accY *= 4.0;
        basicData.accZ *= 4.0;
        basicData.activity *= 4.0;
    }

    const parsedData = {
        basicData,
        deadMan,
        locationData,
        nodeData
    };

    return parsedData;

}
// Slices raw data into data categories
function sliceArray(rawArray) {

    const rawDataString = rawArray.toString().split(",");
    let slicedData = {};

    if (rawDataString.length == 21) {

        slicedData = {
            rawBasicData: rawDataString.slice(0, 20),
            deadMan: rawDataString[20]
        };

    } else if (rawDataString.length == 37) {

        slicedData = {
            rawBasicData: rawDataString.slice(0, 20),
            rawLocationData: rawDataString.slice(20, 36),
            deadMan: rawDataString[36]
        };

    } else if (rawDataString.length == 109) {

        slicedData = {
            rawBasicData: rawDataString.slice(0, 20),
            rawLocationData: rawDataString.slice(20, 36),
            deadMan: rawDataString[36],
            rawNodeData: rawDataString.slice(37, 109)
        };

    } else {

        throw new Error("Invalid data format");
    }

    return slicedData;
}

// -- Data Parsers
function parseBasicData(rawBasicArray) {

    const basicJSON = {
        timestamp: Date.now(),
        devId: rawBasicArray[0],
        heartRate: parseInt(rawBasicArray[1]),
        tempSkin: convertTemprature(rawBasicArray[2], rawBasicArray[3]),
        tempCloth: convertTemprature(rawBasicArray[4], rawBasicArray[5]),
        humidity: convertHumidity(rawBasicArray[6]),
        activity: convertActivity(parseEZ14(rawBasicArray[7], rawBasicArray[8]), parseEZ14(rawBasicArray[9], rawBasicArray[10]), parseEZ14(rawBasicArray[11], rawBasicArray[12])),
        accX: convertAcceleration(rawBasicArray[13]),
        accY: convertAcceleration(rawBasicArray[14]),
        accZ: convertAcceleration(rawBasicArray[15]),
        // breathRate: [rawBasicArray[16],rawBasicArray[17]],
        batteryVoltage: parseEZ14(rawBasicArray[18], rawBasicArray[19]),
        batteryPercentage: convertBatteryVoltage(parseEZ14(rawBasicArray[18], rawBasicArray[19]))
    }

    return basicJSON;
}

function parseLocationData(rawLocationArray) {

    const rawLatMins = rawLocationArray[0];
    const latSecs = parseEZ24(rawLocationArray[1], rawLocationArray[2], rawLocationArray[3], rawLocationArray[4]);
    const rawLongMins = rawLocationArray[5];
    const longSecs = parseEZ24(rawLocationArray[6], rawLocationArray[7], rawLocationArray[8], rawLocationArray[9]);
    const fixSat = rawLocationArray[10];
    const alt = parseEZ24(rawLocationArray[12], rawLocationArray[13], rawLocationArray[14], rawLocationArray[15]);

    if(isLocationDetected(convertLocationMins(rawLatMins, latSecs), convertLocationMins(rawLongMins, longSecs))){

        return locationJSON = {

            latMins: convertLocationMins(rawLatMins, latSecs),
            longMins: convertLocationMins(rawLongMins, longSecs),
            fix: convertFixSat(fixSat).fix,
            sat: convertFixSat(fixSat).sat,
            dilution: convertLocationMetric(rawLocationArray[11]),
            alt: convertLocationMetric(alt),
            detected: isLocationDetected(convertLocationMins(rawLatMins, latSecs), convertLocationMins(rawLongMins, longSecs))
        }
    } else {
        
        return locationJSON = {

            latMins: "-",
            longMins: "-",
            fix: "-",
            sat: "-",
            dilution: "-",
            alt: "-",
            detected: isLocationDetected(convertLocationMins(rawLatMins, latSecs), convertLocationMins(rawLongMins, longSecs))
        }
    }
    
}

function parseNodeData(rawNodeArray) {

    let nodeJSON = {};

    for (i = 0; i < 9; i++) {

        const tempSkin = convertTemprature(rawNodeArray[0 + i * 2], rawNodeArray[1 + i * 2]);
        const tempCloth = convertTemprature(rawNodeArray[18 + i * 2], rawNodeArray[19 + i * 2]);
        const hum = convertHumidity(rawNodeArray[36 + i]);
        const moX = rawNodeArray[45 + i];
        const moY = rawNodeArray[54 + i];
        const moZ = rawNodeArray[63 + i];
        const activity = convertActivity(moX, moY, moZ);


        nodeJSON["connected_" + i.toString()] = isNodeConnected(tempSkin, tempCloth, hum, moX, moY, moZ)

        if (isNodeConnected(tempSkin, tempCloth, hum, moX, moY, moZ)) {
            nodeJSON["tempSkin_" + i.toString()] = tempSkin;
            nodeJSON["tempCloth_" + i.toString()] = tempCloth;
            nodeJSON["humidity_" + i.toString()] = hum;
            nodeJSON["motionX_" + i.toString()] = moX;
            nodeJSON["motionY_" + i.toString()] = moY;
            nodeJSON["motionZ_" + i.toString()] = moZ;
            nodeJSON["activity_" + i.toString()] = activity;
        } else {
            nodeJSON["tempSkin_" + i.toString()] = "-";
            nodeJSON["tempCloth_" + i.toString()] = "-";
            nodeJSON["humidity_" + i.toString()] = "-";
            nodeJSON["motionX_" + i.toString()] = "-";
            nodeJSON["motionY_" + i.toString()] = "-";
            nodeJSON["motionZ_" + i.toString()] = "-";
            nodeJSON["activity_" + i.toString()] = "-";
        }
    }

    return nodeJSON;
}

// -- EZ Parsers 

function parseEZ24(a, b, c, d) {

    let x = a >> 1 | ((d & 2) << 6);
    let y = b >> 1 | ((d & 4) << 5);
    let z = c >> 1 | ((d & 8) << 4);

    return (z << 16) | (y << 8) | x;
}

function parseEZ14(c, d) {

    let a = c >> 1 | ((d & 2) << 6);
    let b = d >> 2;

    return (b << 8) | a;
}

// -- Converters

function convertTemprature(rawOne, rawTwo) {
    const parsedValue = parseEZ14(rawOne, rawTwo);
    const convertedValue = (parsedValue - 500.0) / 10.0;

    return parseFloat(convertedValue);
}

function convertAcceleration(rawValue) {

    const convertedValue = (((rawValue - 127) * 20) / 1000).toFixed(1);

    return parseFloat(convertedValue);
}

function convertHumidity(rawValue) {

    const convertedValue = (rawValue - 100.0);

    return parseInt(convertedValue);
}

function convertLocationMins(rawMins, secs) {

    const convertedMins = rawMins - 1;
    const secsToMins = secs / 600000

    const minutes = convertedMins + secsToMins

    return minutes.toFixed(6);
}

function convertFixSat(raw) {

    const sat = raw & 63; // 0011 1111
    const fix = (raw & 64) >> 6;

    const fixSatJSON = {
        sat,
        fix
    }

    return fixSatJSON;
}

function convertLocationMetric(raw) {

    const converted = raw / 10;

    return converted;
}

function convertBatteryVoltage(voltage) {

    let volts = parseFloat((voltage / 1000).toFixed(2));
    let percentage = ((volts - 3.2) * 100).toFixed(0);

    return parseInt(percentage);

}

function convertActivity(x, y, z) {

    let activity = Math.sqrt(x * x + y * y + z * z).toFixed(0);

    return parseFloat(activity);

}

// -- Checkers

function isLocationDetected(lat, long) {

    const detectionLimit = 260;

    if (lat >= detectionLimit && long >= detectionLimit) {
        return false;
    }
    else return true;
}

function isNodeConnected(skin, cloth, hum, x, y, z) {

    const disconnectedTemp = - 45;
    const disconnectedMotion = 255;

    if (skin == disconnectedTemp && cloth == disconnectedTemp && hum == disconnectedTemp && x == disconnectedMotion && y == disconnectedMotion && z == disconnectedMotion) {
        return false;
    }
    else return true;
}


