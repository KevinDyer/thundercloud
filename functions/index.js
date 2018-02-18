(() => {
  'use strict';

  const functions = require('firebase-functions');
  const admin = require('firebase-admin');
  const http = require('http');
  const url = require('url');

  admin.initializeApp(functions.config().firebase);

  exports.updateSensor = functions.database.ref('/sessions/{sensorId}/{sessionId}/environment/data/{timestamp}').onWrite((event) => {
    const {sensorId, sessionId} = event.params;
    const sensorData = event.data.val();
    console.log(`Device/Session[${sensorId}, ${sessionId}]: sensor data`, sensorData);
    const {temperature} = sensorData;
    const body = {
      temperature: {
        sensor_id: sensorId,
        value: temperature,
        battery_level: 42,
        is_charging: 1,
      },
    };
    return sendSensorUpdate(body);
  });

  exports.updateSensor2 = functions.database.ref('/se')

  function sendSensorUpdate(body) {
    return new Promise((resolve, reject) => {
      const bodyBuffer = Buffer.from(JSON.stringify(body));
      const {hostname, path} = url.parse(functions.config().backend.url);
      const options = Object.assign({}, {
        method: 'POST',
        hostname: hostname,
        path: path,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': bodyBuffer.length,
        }
      });
      const req = http.request(options, (res) => {
        res.once('error', reject);

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));

        res.on('end', () => {
          const body = Buffer.concat(chunks);
          const {status, message} = JSON.parse(body.toString());
          if (200 === res.statusCode && 1 === status) {
            console.log(`Success: ${message}`);
            resolve();
          } else {
            console.log(`Failed: ${message}`);
            reject(new Error(message));
          }
        });
      });
      req.once('error', reject);
      req.write(bodyBuffer);
      req.end();
    });
  }

})();