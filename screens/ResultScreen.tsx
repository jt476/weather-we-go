import { StyleSheet } from 'react-native';
import { Location } from '../enum/Location';
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
      console.log(coordinate);
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
        if(axios.isCancel(error)){
          console.log('Data fetching cancelled');
        }
      }
    };

    coordinates.map(coordinate => {
      if(coordinate.requested === false)
        fetchWeather(coordinate);
      coordinate.requested = true;
    });

    return () => source.cancel("Data fetching cancelled");
  }, [weatherData, coordinates]);
  
  // todo, remove duplicated weather stations
  
  /*console.log('latDistance: '+latDistance);
  console.log('lonDistance: '+lonDistance);
  console.log('totalDistance: '+totalDistance);
  console.log(arr);*/
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{generateWeatherText(weatherData)}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {weatherData.map(r => {
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
        lonDistance += lonJump;
        coordinates.push({key: index++, lat: latStart, lon: lonStart, requested: false});
    }
  }

  coordinates.push({key: index++, lat: params.endLat, lon: params.endLon, requested: false});

  return coordinates;
}


function generateWeatherText(weatherData : any) {
  var weatherTypes = new Set<string>();
  
  weatherData.map((i: any) => {
    if(i.weather !== undefined && i.weather.weather.length > 0)
      weatherTypes.add(i.weather.weather[0].main
  )});

  let weatherTypesArr = Array.from(weatherTypes.values());

  if(weatherTypes.size == 1)
    return "Your journey will be entirely "+addYSuffix(weatherTypesArr.at(0))+"!";
}

function addYSuffix(weatherType: string | undefined) {
  if(weatherType === undefined)
    return "";

  if(weatherType.toLowerCase() === "clouds")
    return "cloudy";
  if(weatherType.toLowerCase() === "sun")
    return "sunny";

  console.log("unknown weather type: "+weatherType);
  return weatherType;
}

