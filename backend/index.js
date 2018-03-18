(() => {
  'use strict';

  const logger = require('./src/logger');

  if (2 > process.argv.length) {
    logger.error('Please provide firebase config file!');
    process.exit(1);
    return;
  }
  const config = require(process.argv[2]);

  const REGEX_THUNDERBOARD = new RegExp('Thunder Sense #(\\d+)');

  const noble = require('noble');

  const FirebaseManager = require('./src/firebase-manager');
  const firebaseManager = new FirebaseManager(config);
  
  const sensors = new Map();

  noble.on('stateChange', (state) => {
    if ('unauthorized' === state) {
      logger.error('Not authorized to use Bluetooth LE');
      process.exit(1);
    }
    if ('unsupported' === state) {
      logger.error('Bluetooth LE is not supported');
      process.exit(1);
    }
    logger.debug('Starting scanning');
    noble.startScanning([], true, (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.debug('Scanning started');
      }
    });
  });

  noble.on('scanStart', () => logger.debug('Scan started'));
  noble.on('scanStop', () => logger.debug('Scan stopped'));

  noble.on('discover', (peripheral) => {
    const {advertisement} = peripheral;
    const {localName} = advertisement;
    const match = REGEX_THUNDERBOARD.exec(localName);
    if (!match) {
      return;
    }

    const sensorId = Number.parseInt(match[1]);
    if (sensors.has(sensorId)) {
      logger.debug('Re-found sensor %s!', sensorId);
    } else {
      sensors.set(sensorId, new Map());
      logger.debug('Found sensor %s!', sensorId);
    }
  });
})();
