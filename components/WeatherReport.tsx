import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Colors from "../constants/Colors";
import {countries} from 'country-data';


export default function WeatherReport(weatherData : any) {
    if(weatherData?.weatherData?.name === undefined || weatherData.weatherData.name.length < 1)
        return <View></View>;
    
    let location = weatherData.weatherData.name;
    if(location === undefined || location.length < 1) {
        console.log(weatherData);
    }
    let countryCode = weatherData.weatherData.sys.country;
    let tempActual = Math.round(weatherData.weatherData.main.temp);
    let tempFeelsLike = Math.round(weatherData.weatherData.main.feels_like);
    let windSpeed = Math.round(weatherData.weatherData.wind.speed);
    let weather = weatherData.weatherData.weather[0];

    return (
        <View style={{ width: '100%',
            backgroundColor: setBackgroundColour(weather),
            marginTop: 10,
            marginBottom: 10,
            borderRadius: 10,
            }}>
            <View style={styles.titleBox}>
                <View style={{flex: 3, flexDirection: 'column', justifyContent: 'flex-start', marginTop: 20, marginLeft: 10}}>
                    <Text style={styles.title}>{weather.description.replace(/\b(\w)/g, (k: string) => k.toUpperCase())}</Text>
                    <Text style={styles.location}>{location}, {countries[countryCode]?.name === undefined ? countryCode : countries[countryCode].name}</Text>
                </View>
                <View style={{flex: 1}}>
                    <Image style={styles.weatherIcon} source={getIconTypeFromWeather(weather.icon)}/>
                </View>
            </View>
            <View style={{flex: 3, flexDirection: 'row', marginLeft: 10, marginRight: 10, marginBottom: 10}}>
                <Text style={{flex: 1, fontSize: 14, textAlign: 'left'}}>Temperature: <Text style={styles.number}>{tempActual}°C</Text></Text>
                <Text style={{flex: 1, fontSize: 14, textAlign: 'center'}}>Feels Like: <Text style={styles.number}>{tempFeelsLike}°C</Text></Text>
                <Text style={{flex: 1, fontSize: 14, textAlign: 'right'}}>Wind Speed: <Text style={styles.number}>{windSpeed} mph</Text></Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    number: {
        fontSize: 16,
    },
    weatherIcon: {
        marginRight: 10,
        height: 80,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleBox: {
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 2,
    },
    location: {
        fontSize: 18,
        justifyContent: 'flex-end',
        flex: 2,
    },
    subtext: {
        flex: 1, fontSize: 14,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
  });

function getIconTypeFromWeather(icon: string) {
    if(icon === "01d")
        return require('../assets/images/weather-icons/01d.png'); 
    if(icon === "01n")
        return require('../assets/images/weather-icons/01n.png');
    if(icon === "02d")
        return require('../assets/images/weather-icons/02d.png');
    if(icon === "02n")
        return require('../assets/images/weather-icons/02n.png');
    if(icon === "03d")
        return require('../assets/images/weather-icons/03d.png');
    if(icon === "03n")
        return require('../assets/images/weather-icons/03n.png');
    if(icon === "04d")
        return require('../assets/images/weather-icons/04d.png');
    if(icon === "04n")
        return require('../assets/images/weather-icons/04n.png');
    if(icon === "09d")
        return require('../assets/images/weather-icons/09d.png');
    if(icon === "09n")
        return require('../assets/images/weather-icons/09n.png');
    if(icon === "10d")
        return require('../assets/images/weather-icons/10d.png');
    if(icon === "10n")
        return require('../assets/images/weather-icons/10n.png');
    if(icon === "11d")
        return require('../assets/images/weather-icons/11d.png');
    if(icon === "11n")
        return require('../assets/images/weather-icons/11n.png');
    if(icon === "13d")
        return require('../assets/images/weather-icons/13d.png');
    if(icon === "13n")
        return require('../assets/images/weather-icons/13n.png');
    if(icon === "50d")
        return require('../assets/images/weather-icons/50d.png');
    if(icon === "50n")
        return require('../assets/images/weather-icons/50n.png');

    console.log("add weather icon type: "+icon);
    return require('../assets/images/weather-icons/01d.png'); 
}

function setBackgroundColour(weather: any): import("react-native").ColorValue | undefined {
    if(weather.main.toLowerCase() === 'sun' || weather.main.toLowerCase() === 'clear')
        return Colors.sun.background;
    if(weather.main.toLowerCase() === 'clouds')
        return Colors.cloud.background;
    if(weather.main.toLowerCase() === 'drizzle')
        return Colors.lightRain.background;
    if(weather.main.toLowerCase() === 'rain')
        return Colors.heavyRain.background;
    if(weather.main.toLowerCase() === 'atmosphere')
        return Colors.fog.background;
    if(weather.main.toLowerCase() === 'thunderstorm')
        return Colors.thunder.background;
    if(weather.main.toLowerCase() === 'snow')
        return Colors.snow.background;
    console.log("set weather background color: "+weather);
}