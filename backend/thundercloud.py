from firebase import firebase
import uuid
import time

class Thundercloud:

   def __init__(self):

      self.addr     = 'https://' --- INSERT FIREBASE DATABASE NAME HERE ---'.firebaseio.com/'
      self.firebase = firebase.FirebaseApplication(self.addr, None)

   def getSession(self, deviceId):

      timestamp = int(time.time() * 1000)
      guid = str(uuid.uuid1())

      url = 'thunderboard/{}/sessions'.format(deviceId)
      self.firebase.put(url, timestamp, guid)

      
      d = {
            "startTime" : timestamp,
            "endTime" : timestamp,
            "shortURL": '',
            "contactInfo" : {
                 "fullName":"First and last name",
                 "phoneNumber":"12345678",
                 "emailAddress":"name@example.com",
                 "title":"",
                 "deviceName": 'Thunderboard #{}'.format(deviceId)
             },
             "temperatureUnits" : 0,
             "measurementUnits" : 0,
         }

      url = 'sessions'
      self.firebase.put(url, guid, d)

      return guid

   def putEnvironmentData(self, guid, data):

      timestamp = int(time.time() * 1000)
      url = 'sessions/{}/environment/data'.format(guid)
      self.firebase.put(url, timestamp, data)

      url = 'sessions/{}'.format(guid)
      self.firebase.put(url, 'endTime', timestamp)