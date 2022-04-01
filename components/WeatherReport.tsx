import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";


export default function WeatherReport(weatherData : any) {
    let location = weatherData.weatherData.name;
    let tempActual = Math.round(weatherData.weatherData.main.temp / 10);
    let tempFeelsLike = Math.round(weatherData.weatherData.main.feels_like / 10);
    let windSpeed = weatherData.weatherData.wind.speed;
    let weather = weatherData.weatherData.weather[0];

    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <Image style={styles.weatherIcon} source={require('../assets/gifs/'+getIconTypeFromWeather(weather.main)+'.gif')}/>
                <Text style={styles.title}>{weather.description.replace(/\b(\w)/g, (k: string) => k.toUpperCase())}</Text>
                <Text style={styles.location}>Location: {location}</Text>
            </View>
            <Text style={styles.subtext}>Actual Temperature: {tempActual}°C</Text>
            <Text style={styles.subtext}>Feels Like Temperature: {tempFeelsLike}°C</Text>
            <Text style={styles.subtext}>Wind Speed: {windSpeed} mph</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        flex: 1,
        backgroundColor: "white",
        margin: 10,
    },
    weatherIcon: {
        margin: 10,
        height: '50px',
        width: '50px'
    },
    titleBox: {
        marginLeft: 10,
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    location: {
        marginLeft: 'auto',
        marginRight: 20,
        fontSize: 18,
        justifyContent: 'flex-end'
    },
    subtext: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
  });

function getIconTypeFromWeather(weather: string) {
    if(weather.toLowerCase() === "clouds")
        return "partly_cloud"
    if(weather.toLowerCase() === "sun")
        return "sun"

    console.log("set weather icon type: "+weather);
    return "fog";
}
