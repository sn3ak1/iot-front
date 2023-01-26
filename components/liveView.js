import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { PubSub } from 'aws-amplify';
import { Temperatures } from './temperatures'
import Chart from './chart';


export default function LiveView() {

    const [data, setData] = useState([])

    useEffect(() => {

        const sub = PubSub.subscribe('device/0/data').subscribe({
            next: x => {
                setData(prev => [...prev, { timestamp: Date.now(), temperature: x.value.temperature }]);
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