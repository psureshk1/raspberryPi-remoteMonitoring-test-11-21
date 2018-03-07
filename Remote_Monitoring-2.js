
// sample code in PI that connects to a PAAS solution of IOT azure suite and inovkes the corresponding sensor simulations

// gets telemetry data and signals cloud for C2D and D2C actions
'use strict';

var  Protocol = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var ConnectionString = require('azure-iot-device').ConnectionString;
var Message = require('azure-iot-device').Message;
//var connectionString = 'HostName=impex-12-2-17ba4e8.azure-devices.net;DeviceId=Pi-Module-2;SharedAccessKey=LlaxWp2g7XsZvSSVXxYV8dPSjQrl0q2fVhA08nuLfp8=';
var connectionString = 'HostName=ImpexIotLearningFeb14.azure-devices.net;DeviceId=Test_PI_With_Functions;SharedAccessKey=NgUvWkqWWcMNwdQkNJmMzqwvOOofK1jhX+JKBU2C4AU=';
var deviceId = ConnectionString.parse(connectionString).DeviceId;


//base telemerty data SET
var temperature = 30;
var temperatureUnit = 'F';
var humidity = 30;
var humidityUnit = '%';
var pressure = 35;
var pressureUnit = 'psig';
var stopService=false;

//Property Variables
var temperatureSchema = 'chiller-temperature;v1';
var humiditySchema = 'chiller-humidity;v1';
var pressureSchema = 'chiller-pressure;v1';
var interval = "00:00:05";
var deviceType = "Chiller";
var deviceFirmware = "1.0.0";
var deviceFirmwareUpdateStatus = "";
var deviceLocation = "Impex HQ";
var deviceLatitude = 33.9191798;
var deviceLongitude = -118.4164652;



// change these if you want the cloud to do something for the device
var reportedProperties = {
  "Protocol": "MQTT",
  "SupportedMethods": "Reboot,FirmwareUpdate,EmergencyValveRelease,IncreasePressure",
  "Telemetry": {
    "TemperatureSchema": {
      "Interval": interval,
      "MessageTemplate": "{\"temperature\":${temperature},\"temperature_unit\":\"${temperature_unit}\"}",
      "MessageSchema": {
        "Name": temperatureSchema,
        "Format": "JSON",
        "Fields": {
          "temperature": "Double",
          "temperature_unit": "Text"
        }
      }
    },
    "HumiditySchema": {
      "Interval": interval,
      "MessageTemplate": "{\"humidity\":${humidity},\"humidity_unit\":\"${humidity_unit}\"}",
      "MessageSchema": {
        "Name": humiditySchema,
        "Format": "JSON",
        "Fields": {
          "humidity": "Double",
          "humidity_unit": "Text"
        }
      }
    },
    "PressureSchema": {
      "Interval": interval,
      "MessageTemplate": "{\"pressure\":${pressure},\"pressure_unit\":\"${pressure_unit}\"}",
      "MessageSchema": {
        "Name": pressureSchema,
        "Format": "JSON",
        "Fields": {
          "pressure": "Double",
          "pressure_unit": "Text"
        }
      }
    }
  },
  "Type": deviceType,
  "Firmware": deviceFirmware,
  "FirmwareUpdateStatus": deviceFirmwareUpdateStatus,
  "Location": deviceLocation,
  "Latitude": deviceLatitude,
  "Longitude": deviceLongitude
}


//error

function printErrorFor(op) {
    return function printError(err) {
        if (err) console.log(op + ' error: ' + err.toString());
    };
}


// random gen

function generateRandomIncrement() {
    return ((Math.random() * 2) - 1);
}

// direct method call

function onDirectMethod(request, response) {
  // Implement logic asynchronously here.

  console.log('Simulated ' + request.methodName);

  // testing to close the window and device exit
  var method=request.methodName;
  if(method=='EmergencyValveRelease'){
	stopService=true;
	console.log('service status: '+ stopService);

	}

  // Complete the response
  response.send(200, request.methodName + ' was called on the device', function (err) {
    if (!!err) {
      console.error('An error ocurred when sending a method response:\n' +
        err.toString());
    } else {
      console.log('System Alert recieved from cloud...');
      console.log('Payload Recieved......................');
      console.log('Status: ' + JSON.stringify(request.payload,null,4));
      console.log('Response to method \'' + request.methodName +'\' sent successfully.');
    }
  });

}


// send data
function sendTelemetry(data, schema) {
  var d = new Date();
  var payload = JSON.stringify(data);
  var message = new Message(payload);
  message.properties.add('$$CreationTimeUtc', d.toISOString());
  message.properties.add('$$MessageSchema', schema);
  message.properties.add('$$ContentType', 'JSON');

  console.log('Sending device message data:\n' + payload);
  client.sendEvent(message, printErrorFor('send event'));
}

// main{}


// create a client instance inorder that it registers access users to the azure iot

var client = Client.fromConnectionString(connectionString, Protocol);

//close connection
var closeConnection=function(){
 if(stopService){
   // if (sendTemperatureInterval) clearInterval(sendTemperatureInterval);
   // if (sendHumidityInterval) clearInterval(sendHumidityInterval);
   // if (sendPressureInterval) clearInterval(sendPressureInterval);
    consol.log('Pressure cleared and system exit');
    client.close(printErrorFor('client.close'));
	}
};

//open connection

// setup handler fot desired properties
// send reported propertites
// register handlers for direct methods
// send telemetry data


client.open(function (err) {
if (err) {
  printErrorFor('open')(err);
} else {
// Connection Established

console.log('-----------------------------------------------------------------------');
console.log('Connection Established to Azure Cloud Services');
console.log('Streamlining the piple line for data transfer...');
console.log('Retrieving client IOT HUB details...');
console.log('-----------------------------------------------------------------------');


  // Create device Twin
  client.getTwin(function (err, twin) {
    if (err) {
      console.error('Could not get device twin');
    } else {
      console.log('Device twin created');
      console.log('Double handshake established ......');
      console.log('Retrieving Access control specifications');
      console.log('-----------------------------------------------------------------------');
      twin.on('properties.desired', function (delta) {
        // Handle desired properties set by solution
        console.log('Received new desired properties:');
        console.log(JSON.stringify(delta));
	console.log('');
	console.log('');
	console.log('Available Method Calls on client side');
        console.log('*****************************************');
 	console.log('');
	console.log('1.Reboot Firmware - Reboot');
	console.log('');
	console.log('2.Update Firmware - FirmwareUpdate');
	console.log('');
	console.log('3.EmergencyEvacuvation System Exit  - EmergencyValveRelease');
	console.log('');
	console.log('4.Channelize Pressure - IncreasePressure');
 	console.log('');
 	console.log('*****************************************');
	console.log('-----------------------------------------------------------------------');
      });

      // Send reported properties
      twin.properties.reported.update(reportedProperties, function (err) {
        if (err) throw err;
        console.log('twin state reported');
	console.log('Additional changes to telelemetry property set');
	console.log('-------------------------------------------------------------');
      });

      // Register handlers for all the method names we are interested in.
      // Consider separate handlers for each method.
      client.onDeviceMethod('Reboot', onDirectMethod);
      client.onDeviceMethod('FirmwareUpdate', onDirectMethod);
      client.onDeviceMethod('EmergencyValveRelease', onDirectMethod);
      client.onDeviceMethod('IncreasePressure', onDirectMethod);
    }
  });

  // Start sending telemetry
  var sendTemperatureInterval = setInterval(function () {
   if(stopService){
        console.log('System Temperature Telemetry Stop service: ' + stopService);
        if(sendTemperatureInterval) clearInterval(sendTemperatureInterval);

        client.close(printErrorFor('client.close'));
   }else{
	temperature += generateRandomIncrement();
	var data = {
	      'temperature': temperature,
	      'temperature_unit': temperatureUnit
	    };

         sendTelemetry(data, temperatureSchema)
	}
  }, 5000);

  var sendHumidityInterval = setInterval(function () {
    if(stopService){

        console.log('System Humidity Telemetry Stop service: ' + stopService);
        if (sendHumidityInterval) clearInterval(sendHumidityInterval);

        client.close(printErrorFor('client.close'));
	}
	else{
	humidity += generateRandomIncrement();
    	var data = {
      		'humidity': humidity,
     		'humidity_unit': humidityUnit
   		 };
     	sendTelemetry(data, humiditySchema)
	}
    },5000);

  var sendPressureInterval = setInterval(function () {
    if(stopService){
        console.log('System Pressure Telemetry Stop service: ' + stopService);

        if (sendPressureInterval) clearInterval(sendPressureInterval);
        client.close(printErrorFor('client.close'));
	}
	else{
	 pressure += generateRandomIncrement();
	    var data = {
	      'pressure': pressure,
	      'pressure_unit': pressureUnit
	    };

	    sendTelemetry(data, pressureSchema);
	}
   }, 5000);
    //console.log('System data injection : '+ !stopService);

  if(stopService){

	console.log('System Stable');
	client.close(printErrorFor('client.close'));
	}

  client.on('error', function (err) {
    printErrorFor('client')(err);
    if (sendTemperatureInterval) clearInterval(sendTemperatureInterval);
    if (sendHumidityInterval) clearInterval(sendHumidityInterval);
    if (sendPressureInterval) clearInterval(sendPressureInterval);
    client.close(printErrorFor('client.close'));
  });
}
});
