import { ScrollView, StyleSheet, Text, View } from 'react-native';


export function Temperatures({ data }) {
    return (
        <ScrollView style={styles.temperatures}>
            {data.length > 0 && data.map((msg, index) =>
                <View key={index + 'view'} style={styles.temperaturesItem}>
                    <Text key={index + 'time'}>{timestampToString(msg.timestamp)}</Text>
                    <Text key={index + 'data'}>{msg.temperature}</Text>
                </View>)}
        </ScrollView>
    );
}

const timestampToString = (timeStamp) => {
    const date = new Date(parseInt(timeStamp));
    const dmy = date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const time = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    return `${dmy} ${time}`;
}

const styles = StyleSheet.create({
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