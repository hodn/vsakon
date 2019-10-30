module.exports = function parseRawData(rawArray){

    const slicedArrays = sliceArray(rawArray);
    
    const basicData = parseBasicData(slicedArrays.rawBasicData);
    const deadMan = slicedArrays.deadMan % 2 ? 0 : 1;
    const locationData = slicedArrays.rawLocationData === undefined ? null : parseLocationData(slicedArrays.rawLocationData);
    const nodeData = slicedArrays.rawNodeData === undefined ? null : parseNodeData(slicedArrays.rawLocationData);
    
    const parsedData = {
        basicData,
        deadMan,
        locationData,
        nodeData
    };

    return parsedData;
    
}

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
        
        throw "Invalid input format of data";
    }

    return slicedData;
}

function parseBasicData(rawBasicArray){
    
    const basicJSON = {
        devId: rawBasicArray[0],
        heartRate: rawBasicArray[1],
        tempSkin: convertTemprature(rawBasicArray[2],rawBasicArray[3]),
        tempCloth: convertTemprature(rawBasicArray[4],rawBasicArray[5]),        
        humidity: convertHumidity(rawBasicArray[6]),
        motionX: parseEZ14(rawBasicArray[7],rawBasicArray[8]),
        motionY: parseEZ14(rawBasicArray[9],rawBasicArray[10]),
        motionZ: parseEZ14(rawBasicArray[11],rawBasicArray[12]),
        accX: convertAcceleration(rawBasicArray[13]),
        accY: convertAcceleration(rawBasicArray[14]),
        accZ: convertAcceleration(rawBasicArray[15]),
        breathRate: [rawBasicArray[16],rawBasicArray[17]],
        batteryVoltage: parseEZ14(rawBasicArray[18],rawBasicArray[19])
    }
    
    return basicJSON;
}

function parseLocationData(rawLocationArray){
    
    const locationJSON = {
        latDeg: convertDegree(rawLocationArray[0]),
        latMins: parseEZ24(rawLocationArray[1], rawLocationArray[2], rawLocationArray[3], rawLocationArray[4]),
        longDeg: convertDegree(rawLocationArray[5]),
        longMins: parseEZ24(rawLocationArray[6], rawLocationArray[7], rawLocationArray[8], rawLocationArray[9]),
        fixSat: rawLocationArray[10],
        dilution: rawLocationArray[11],
        alt: parseEZ24(rawLocationArray[12], rawLocationArray[13], rawLocationArray[14], rawLocationArray[15])
    }

    return locationJSON;
}

function parseNodeData(rawNodeArray){
    
    let nodeJSON = {};

    for(i = 0; i < 9; i++){
        
        const nameSkin = `tempSkin_${i + 1}`;
        const tempSkin = convertTemprature(rawNodeArray[0 + i*2], rawNodeArray[1 + i*2]);
        nodeJSON[nameSkin] = tempSkin;

        const nameCloth = `tempCloth_${i + 1}`;
        const tempCloth = convertTemprature(rawNodeArray[18 + i*2], rawNodeArray[19 + i*2]);
        nodeJSON[nameCloth] = tempCloth;

        const nameHum = `humidity_${i + 1}`;
        const hum = convertHumidity(rawNodeArray[36 + i]);
        nodeJSON[nameHum] = hum;

        const nameX = `motionX_${i + 1}`;
        const moX = rawNodeArray[45 + i];
        nodeJSON[nameX] = moX;

        const nameY = `motionY_${i + 1}`;
        const moY = rawNodeArray[54 + i];
        nodeJSON[nameY] = moY;

        const nameZ = `motionZ_${i + 1}`;
        const moZ = rawNodeArray[63 + i];
        nodeJSON[nameZ] = moZ;
    }

    return nodeJSON;
}

function parseEZ24(a, b, c, d){
    
    let x = a>>1 | ((d & 2) << 6);
    let y = b>>1 | ((d & 4) << 5);
    let z = c>>1 | ((d & 8) << 4);

    return (z << 16) | (y << 8) | x;
}

function parseEZ14(c, d){
    
    a = c>>1 | (( d & 2 ) << 6);
    b = d>>2;

    return (b<<8) | a;
}

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

function convertDegree(rawValue){
    
    const convertedValue = rawValue - 1;

    return convertedValue;
}