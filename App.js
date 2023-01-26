import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, View } from 'react-native';
import { Amplify, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { withAuthenticator } from 'aws-amplify-react-native';
import awsconfig from './src/aws-exports'
import Live from './components/live';
import History from './components/history';



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

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="send" onPress={() => {
          PubSub.publish('device/0/data', { msg: 'wyslalem2!' });
        }} />
        <Button title={historyFlag ? "Live" : "History"} onPress={() => {
          setHistoryFlag(!historyFlag)
        }} />
      </View>

      {historyFlag ? <History style={styles.temperatures} /> : <Live style={styles.temperatures} />}

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
  buttons: {
    flexDirection: 'row',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 10,
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
