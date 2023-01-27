import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, View } from 'react-native';
import { Amplify, PubSub, API } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { withAuthenticator } from 'aws-amplify-react-native';
import awsconfig from './src/aws-exports'
import LiveView from './components/liveView';
import HistoryView from './components/historyView';



Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
})

Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: 'eu-central-1',
    aws_pubsub_endpoint:
      'wss://ae8md3vbbgnl9-ats.iot.eu-central-1.amazonaws.com/mqtt'
  })
);

function App() {

  const [historyFlag, setHistoryFlag] = useState(false)
  const [deviceID, setDeviceID] = useState(undefined)

  useEffect(() => {
    Amplify.Auth.currentSession().then(session => {
      const userID = session.accessToken.payload.sub;
      console.log(userID);

      API.get('userdevice', '/userdevice/?userID=' + userID, {}).then(result => {
        const temp = JSON.parse(result.body);
        setDeviceID(temp[0].deviceID);
      }).catch(err => {
        API.post('userdevice', '/userdevice', {
          body: {
            deviceID: 0,
            userID: userID,
            username: session.accessToken.payload.username
          }
        })
          .then(result => {
            setDeviceID(0);
          })
          .catch(err => {
            console.log(err);
          })
      })
    });
  }, [])

  if (deviceID === undefined) return null;

  return (
    <View style={styles.container}>

      <Button title={historyFlag ? "Go to live view" : "Go to history view"} onPress={() => {
        setHistoryFlag(!historyFlag)
      }} />

      {historyFlag ?
        <HistoryView deviceID={deviceID} style={styles.temperatures} /> :
        <LiveView deviceID={deviceID} style={styles.temperatures} />}

      <StatusBar style="auto" />
    </View>
  );
}

export default withAuthenticator(App, {
  includeGreetings: true,
  signUpConfig: {
    hiddenDefaults: ['phone_number']
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperatures: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
  },
  temperaturesItem: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
});
