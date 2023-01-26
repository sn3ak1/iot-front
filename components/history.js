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


export default function History() {

    const [data, setData] = useState([])

    useEffect(() => {

        API.get('tempsApi', '/temps', {}).then(result => {
            const temp = JSON.parse(result.body)
            setData(temp.map(item => {
                return {
                    timestamp: item.id,
                    temperature: item.payload.temperature
                }
            }))
        }).catch(err => {
            console.log(err);
        })

    }, [])


    return (
        <View style={styles.container}>
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