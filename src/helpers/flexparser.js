module.exports.parseFlexiData = function parseRawData(rawArray){

    const slicedArrays = sliceArray(rawArray);
    
    const basicData = parseBasicData(slicedArrays.rawBasicData);
    const deadMan = slicedArrays.deadMan % 2 ? false : true;
    const locationData = slicedArrays.rawLocationData === undefined ? null : parseLocationData(slicedArrays.rawLocationData);
    const nodeData = slicedArrays.rawNodeData === undefined ? null : parseNodeData(slicedArrays.rawNodeData);
    
    const parsedData = {
        basicData,
        deadMan,
        locationData,
        nodeData
    };

    return parsedData;
    
}
// Slices raw data into data categories
function sliceArray(rawArray){
    
    const rawDataString = rawArray.toString().split(",");
    let slicedData = {};
    
    if(rawDataString.length == 21){

        slicedData = {
            rawBasicData: rawDataString.slice(0, 19),
            deadMan: rawDataString[20]
        };
    
    }else if(rawDataString.length == 37){

        slicedData = {
            rawBasicData: rawDataString.slice(0, 19),
            rawLocationData: rawDataString.slice(20, 35),
            deadMan: rawDataString[36]
        };

    }else if(rawDataString.length == 109){
        
        slicedData = {
            rawBasicData: rawDataString.slice(0, 19),
            rawLocationData: rawDataString.slice(20, 35),
            deadMan: rawDataString[36],
            rawNodeData: rawDataString.slice(37, 108)
        };
    
    }else{
        
        throw new Error("Invalid data format");
    }

    return slicedData;
}

// -- Data Parsers
function parseBasicData(rawBasicArray){
    
    const basicJSON = {
        timestamp: Date.now(),
        devId: rawBasicArray[0],
        heartRate: rawBasicArray[1],
        measuringHR: isMeasuringHR(rawBasicArray[1]),
        tempSkin: convertTemprature(rawBasicArray[2],rawBasicArray[3]),
        tempCloth: convertTemprature(rawBasicArray[4],rawBasicArray[5]),        
        humidity: convertHumidity(rawBasicArray[6]),
        activity: convertActivity(parseEZ14(rawBasicArray[7],rawBasicArray[8]), parseEZ14(rawBasicArray[9],rawBasicArray[10]), parseEZ14(rawBasicArray[11],rawBasicArray[12])),
        accX: convertAcceleration(rawBasicArray[13]),
        accY: convertAcceleration(rawBasicArray[14]),
        accZ: convertAcceleration(rawBasicArray[15]),
        breathRate: [rawBasicArray[16],rawBasicArray[17]],
        batteryVoltage: parseEZ14(rawBasicArray[18],rawBasicArray[19])
    }
    
    return basicJSON;
}

function parseLocationData(rawLocationArray){
    
    const rawLatMins = rawLocationArray[0];
    const latSecs = parseEZ24(rawLocationArray[1], rawLocationArray[2], rawLocationArray[3], rawLocationArray[4]);
    const rawLongMins = rawLocationArray[5];
    const longSecs = parseEZ24(rawLocationArray[6], rawLocationArray[7], rawLocationArray[8], rawLocationArray[9]);
    const fixSat = rawLocationArray[10];
    const alt = parseEZ24(rawLocationArray[12], rawLocationArray[13], rawLocationArray[14], rawLocationArray[15]);
    
    const locationJSON = {
        
        latMins: convertLocationMins(rawLatMins, latSecs),
        longMins: convertLocationMins(rawLongMins, longSecs),
        fix: convertFixSat(fixSat).fix,
        sat: convertFixSat(fixSat).sat,
        dilution: convertLocationMetric(rawLocationArray[11]),
        alt: convertLocationMetric(alt),
        detected: isLocationDetected(convertLocationMins(rawLatMins, latSecs), convertLocationMins(rawLongMins, longSecs))
    }

    return locationJSON;
}

function parseNodeData(rawNodeArray){
    
    let nodeJSON = {};

    for(i = 0; i < 8; i++){
        
        const tempSkin = convertTemprature(rawNodeArray[0 + i*2], rawNodeArray[1 + i*2]);
        const tempCloth = convertTemprature(rawNodeArray[18 + i*2], rawNodeArray[19 + i*2]);
        const hum = convertHumidity(rawNodeArray[36 + i]);
        const moX = rawNodeArray[45 + i];
        const moY = rawNodeArray[54 + i];
        const moZ = rawNodeArray[63 + i];
        const activity = convertActivity(moX, moY, moZ);

        nodeJSON[i] = { 
        
            tempSkin,
            tempCloth, 
            humidity: hum,
            motionX: moX,
            motionY: moY,
            motionZ: moZ, 
            activity,
            connected: isNodeConnected(tempSkin, tempCloth, hum, moX, moY, moZ)
        }

    }

    return nodeJSON;
}

// -- EZ Parsers 

function parseEZ24(a, b, c, d){
    
    let x = a>>1 | ((d & 2) << 6);
    let y = b>>1 | ((d & 4) << 5);
    let z = c>>1 | ((d & 8) << 4);

    return (z << 16) | (y << 8) | x;
}

function parseEZ14(c, d){
    
    let a = c>>1 | (( d & 2 ) << 6);
    let b = d>>2;

    return (b<<8) | a;
}

// -- Converters

function convertTemprature(rawOne, rawTwo){
    const parsedValue = parseEZ14(rawOne, rawTwo);
    const convertedValue = (parsedValue - 500.0) / 10.0;

    return convertedValue;
}

function convertAcceleration(rawValue){
    
    const convertedValue = (rawValue - 127) * 10;

    return convertedValue;
}

function convertHumidity(rawValue){
    
    const convertedValue = (rawValue - 100.0);

    return convertedValue;
}

function convertLocationMins(rawMins, secs){
    
    const convertedMins = rawMins - 1;
    const secsToMins = secs/600000

    const minutes = convertedMins + secsToMins

    return minutes;
}

function convertFixSat(raw){
    
    const sat = raw & 63; // 0011 1111
    const fix = (raw & 64) >> 6 ;

    const fixSatJSON = {
        sat, 
        fix
    }

    return fixSatJSON;
}

function convertLocationMetric(raw){
    
    const converted = raw/10;

    return converted;
}

function convertBatteryVoltage(percentage){

    let volts = (percentage / 100 + 3.2).toFixed(2);

    return parseFloat(volts);
    
}

function convertActivity(x, y, z){

    let activity = Math.sqrt(x*x + y*y + z*z).toFixed(0);

    return parseFloat(activity);
    
}

// -- Checkers

function isLocationDetected(lat, long){
    
    const detectionLimit = 260;

    if(lat >= detectionLimit && long >= detectionLimit)
    {
        return false;
    }
    else return true;
}

function isNodeConnected(skin, cloth, hum, x, y, z){
    
    const disconnectedTemp = - 45;
    const disconnectedMotion = 255;

    if(skin == disconnectedTemp && cloth == disconnectedTemp && hum == disconnectedTemp && x == disconnectedMotion && y == disconnectedMotion && z == disconnectedMotion)
    {
        return false;
    }
    else return true;
}

function isMeasuringHR(hr){

    if(hr == 2)
    {
        return false;
    }
    else return true;
}

