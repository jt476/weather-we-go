import { StyleSheet } from 'react-native';
import WeatherReport from '../components/WeatherReport';
import { Text, View } from '../components/Themed';
import axios from 'axios';
import { useEffect, useState } from 'react';

const weatherBaseUrl = "https://api.openweathermap.org";
const weatherAppId = "6b142a521b92aa23812bee18e3b69dc1";
let coordinates: any[] = [];

export default function ResultScreen({ route, navigation } : {route: any, navigation: any}) {
  if(coordinates.length < 1)
    coordinates = getAllCoordinates(route.params);
  const [weatherData, setWeatherData] = useState<any[]>([]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const url = `${weatherBaseUrl}/data/2.5/weather`;
    const fetchWeather = async (coordinate : any) => {
      try {
        const response = await axios.get(url, { params: {
          lat: coordinate.lat,
          lon: coordinate.lon,
          appid: weatherAppId,
      } });
        if (response.status === 200) {
          setWeatherData(oldArray => [...oldArray, {key: coordinate.key, weather: response.data}])
          return;
        } else {
          throw new Error("Failed to fetch weather");
        }
      } catch (error) {
        console.error(error);
      }
    };

    coordinates.map(coordinate => {
      if(coordinate.requested === false)
        fetchWeather(coordinate);
      coordinate.requested = true;
    });

    return () => source.cancel("Data fetching cancelled");
  }, [weatherData, coordinates]);
  
  let filteredWeatherData = weatherData.filter((value, index, self) =>
    index === self.findIndex((w) => (
      w.weather.id === value.weather.id
    ))
  )
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{generateJourneyWeatherText(filteredWeatherData, route.params.origin, route.params.destination)}</Text>
      <Text style={styles.title}>{generateEndWeatherText(filteredWeatherData, route.params.destination)}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {filteredWeatherData.sort((a, b) => a.key > b.key ? 1 : -1).map(r => {
        if(r.weather !== undefined)
          return <WeatherReport key={r.key} weatherData={r.weather}/>
        else
          return <Text key={r.key}>Loading...</Text>
      })}    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

const getAllCoordinates = (params : any) => {
  let index = 0;
  let coordinates = [{key: index++, lat: params.startLat, lon: params.startLon, requested: false}];

  let latDistance = params.endLat - params.startLat;
  let lonDistance = params.endLon - params.startLon;

  let totalDistance = Math.abs(latDistance) + Math.abs(lonDistance);

  if(totalDistance > 0.6) {
    let logBase = 1.35;
    let numOfCalls = Math.ceil(Math.log(totalDistance) / Math.log(logBase));

    let latStart = params.startLat;
    let lonStart = params.startLon;

    let latJump = latDistance / numOfCalls;
    let lonJump = lonDistance / numOfCalls;
    for(let i = 0; i < numOfCalls; i++) {
        latStart += latJump;
        lonStart += lonJump;
        coordinates.push({key: index++, lat: latStart, lon: lonStart, requested: false});
    }
  }

  coordinates.push({key: index++, lat: params.endLat, lon: params.endLon, requested: false});

  return coordinates;
}

function generateJourneyWeatherText(weatherData : any, origin : string, destination : string) {
  let weatherCount : { [key:string] : number } = {};
  
  weatherData.map((i: any) => {
    if(i.weather !== undefined && i.weather.weather.length > 0) {
      let weather = i.weather.weather[0].main;
      if( weatherCount[weather] == undefined )
        weatherCount[weather] = 1;
      else
        weatherCount[weather]++;
    }
  });

  let weatherTypes = Object.keys(weatherCount);
  let weatherFrequency = Object.values(weatherCount);
  weatherFrequency.sort(function(a, b){return b-a});

  if(weatherTypes.length > 0) {
    let prefix = "Your journey from "+origin+" to "+destination+" should be ";    

    if(weatherTypes.length == 1)
      return prefix+"entirely "+addYSuffix(weatherTypes[0])+"!";
    if(weatherTypes.length == 2) {
      if(weatherFrequency[0] === weatherFrequency[1])
        return prefix+"be half "+addYSuffix(weatherTypes[0])+" and half "+addYSuffix(weatherTypes[1])+"!";
      if(weatherFrequency[0] < weatherFrequency[1])
        return prefix+"be mostly "+addYSuffix(weatherTypes[1])+" with a little bit of "+addYSuffix(weatherTypes[0])+"!";
      else
        return prefix+"be mostly "+addYSuffix(weatherTypes[0])+" with a little bit of "+addYSuffix(weatherTypes[1])+"!";
    }
  };
  return "";
}

function generateEndWeatherText(weatherData : any, destination : string) {
  try{
    if(weatherData !== undefined && weatherData.length > 0 && weatherData[weatherData.length-1].weather !== undefined) {
      let lastItem = weatherData[weatherData.length-1].weather;
      let endWeather = lastItem.weather[0].main;
      if(endWeather.toLowerCase() === "clouds")
        return "It is likely to be cloudy in "+destination+" when you arrive.";
      if(endWeather.toLowerCase() === "sun")
        return "It is likely to be nice and sunny in "+destination+" when you arrive.";
      if(endWeather.toLowerCase() === "rain")
        return "Bring an umbrella. You can expect it to be raining in "+destination+" for when you arrive.";

      console.log("unknown endWeather: "+endWeather);
    }
  } catch (error) {
    console.error(error);
    return "";
  }
}

function addYSuffix(weatherType: string | undefined) {
  if(weatherType === undefined)
    return "";

  if(weatherType.toLowerCase() === "clouds")
    return "cloudy";
  if(weatherType.toLowerCase() === "sun")
    return "sunny";
  if(weatherType.toLowerCase() === "rain")
    return "rainy";

  console.log("unknown weather type: "+weatherType);
  return weatherType;
}

