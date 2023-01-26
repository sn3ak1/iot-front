import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Amplify, PubSub, Auth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { withAuthenticator } from 'aws-amplify-react-native';
import awsconfig from './src/aws-exports'
import {
  LineChart,
} from "react-native-chart-kit";



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

  [messages, setMessages] = useState([0, 1])

  useEffect(() => {

    Auth.currentCredentials().then((info) => {
      const cognitoIdentityId = info.identityId;
      console.log('cognitoIdentityId', cognitoIdentityId);
    });


    PubSub.subscribe('sdkTest/sub').subscribe({
      next: data => setMessages([...messages, data.value.Temperature]),
      error: error => console.error(error),
      complete: () => console.log('Message received'),
    });

  }, [])


  return (
    <View style={styles.container}>
      <Button title="send" onPress={() => {
        PubSub.publish('sdkTest/pub', { msg: 'Hello to all subscribers!' });
      }} />
      <LineChart
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: messages
            }
          ]
        }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisLabel="ºC"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
      <ScrollView>
        {messages.map((msg, index) => <Text key={index}>{msg} </Text>)}
      </ScrollView>
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
