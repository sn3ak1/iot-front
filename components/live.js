import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Amplify, PubSub, Auth, API } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { withAuthenticator } from 'aws-amplify-react-native';
import awsconfig from '../src/aws-exports'
import {
    LineChart,
} from "react-native-chart-kit";
import { Temperatures } from './temperatures'


export default function Live() {

    const [data, setData] = useState([])

    useEffect(() => {

        const sub = PubSub.subscribe('device/0/data').subscribe({
            next: x => {
                const test = [...data, { timestamp: Date.now(), temperature: x.value.Temperature }]
                setData(prev => [...prev, { timestamp: Date.now(), temperature: x.value.Temperature }]);
                console.log(test)
            },
            error: error => console.error(error),
            complete: () => console.log('Message received'),
        });

        return () => {
            sub.unsubscribe()
        }

    }, [])


    return (
        <View style={styles.container}>
            <LineChart
                data={{
                    datasets: [
                        {
                            data: data.length > 0 ? data.map(x => x.temperature) : [0]
                        }
                    ]
                }}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                yAxisLabel="Cº"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 1, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "3",
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

            <Temperatures style={styles.temperatures} data={data} />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    temperatures: {
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
    },
});