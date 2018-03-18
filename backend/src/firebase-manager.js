(() => {
  'use strict';

  const firebase = require('firebase');

  const config = {
    apiKey: 'AIzaSyDTB8FOhoqeHj-kvxfkTjSxOIuCBYA_uXU',
    authDomain: 'pup-alert-dev.firebaseapp.com',
    databaseURL: 'https://pup-alert-dev.firebaseio.com',
    projectId: 'pup-alert-dev',
  };
  firebase.initializeApp(config);

  class FirebaseManager {
    constructor({email, password}) {
      this._user = null;
      this._connected = false;

      const connectedRef = firebase.database().ref('.info/connected');
      connectedRef.on('value', this._onConnectedValue.bind(this));

      firebase.auth().onAuthStateChanged(this._onAuthStateChanged.bind(this));
      firebase.auth().signInWithEmailAndPassword(email, password);
    }

    _onConnectedValue(snapshot) {
      this._connected = snapshot.val();
      if (this._connected) {
        console.log('Connected to firebase');
        this._setup();
      } else {
        console.log('Disconnected from firebase');
      }
    }

    _onAuthStateChanged(user) {
      this._user = user;
      if (user) {
        console.log('Hub is logged in');
        this._setup();
      } else {
        console.log('Hub is logged out');
      }
    }

    _setup() {
      if (!this._user || !this._connected) {
        return;
      }
      const uid = this._user.uid;
      const hubRef = firebase.database().ref(`hubs/${uid}`);

      const lastOnlineRef = hubRef.child('lastOnline');
      lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);

      const isOnlineRef = hubRef.child('isOnline');
      isOnlineRef.onDisconnect().set(false);
      isOnlineRef.set(true);
    }
  }

  module.exports = FirebaseManager;
})();
