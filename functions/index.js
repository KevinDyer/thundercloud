(() => {
  'use strict';

  const fetch = require('node-fetch');
  const functions = require('firebase-functions');

  exports.updateSensor = functions.database.ref('/sessions/{sensorId}/{sessionId}/environment/data/{timestamp}').onWrite((event) => {
    const {sensorId, sessionId} = event.params;
    const sensorData = event.data.val();
    console.log(`Sensor/Session[${sensorId}, ${sessionId}]: sensor data`, sensorData);
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

  function sendSensorUpdate(data) {
    const body = Buffer.from(JSON.stringify(data));
    const input = functions.config().backend.url;
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length.toString(),
      },
      body: body,
    };
    return fetch(input, init)
      .then((res) => {
        console.log(res);
      });
  }

})();