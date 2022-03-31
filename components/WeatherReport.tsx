import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";


export default function WeatherReport(weatherData : any) {
    console.log(weatherData);

    //console.log(nodes);
    return (
        <View>
            <Text>{weatherData.weather}</Text>
        </View>
    );
}