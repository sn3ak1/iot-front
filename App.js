import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Amplify, PubSub, Auth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { withAuthenticator } from 'aws-amplify-react-native';
import awsconfig from './src/aws-exports'

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
      'ae8md3vbbgnl9-ats.iot.eu-central-1.amazonaws.com'
  })
);

function App() {

  useEffect(() => {

    Auth.currentCredentials().then((info) => {
      const cognitoIdentityId = info.identityId;
      console.log('cognitoIdentityId', cognitoIdentityId);
    });


    PubSub.subscribe('sdkTest/sub').subscribe({
      next: data => console.log('Message received', data),
      error: error => console.error(error),
      complete: () => console.log('Done'),
    });
    // PubSub.publish('sdkTest/pub', { msg: 'Hello to all subscribers!' });

  }, [])


  return (
    <View style={styles.container}>
      <Text>Test</Text>
      <Button title="send" onPress={() => {
        PubSub.publish('sdkTest/pub', { msg: 'Hello to all subscribers!' });
      }} />
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
});
