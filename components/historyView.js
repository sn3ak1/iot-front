import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { API } from 'aws-amplify';
import { Temperatures } from './temperatures'
import Chart from './chart';


export default function HistoryView({ deviceID }) {

    const [data, setData] = useState([])

    useEffect(() => {

        API.get('tempsApi', '/temps/?device_id=' + deviceID, {}).then(result => {
            const temp = JSON.parse(result.body)
            setData(temp.map(item => {
                return {
                    timestamp: item.sample_time,
                    temperature: item.device_data.temperature
                }
            }))
        }).catch(err => {
            console.log(err);
        })

    }, [])


    return (
        <View style={styles.container}>
            <Chart data={data} />
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