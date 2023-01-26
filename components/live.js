import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { PubSub } from 'aws-amplify';
import {
    LineChart,
} from "react-native-chart-kit";
import { Temperatures } from './temperatures'


export default function Live() {

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