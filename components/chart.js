import {
    LineChart,
} from "react-native-chart-kit";
import { Dimensions } from 'react-native';



export default function Chart({ data }) {
    return (
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
    );
}