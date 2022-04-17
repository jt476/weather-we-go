import { StyleSheet, ScrollView } from 'react-native';
import WeatherReport from '../components/WeatherReport';
import { Text, View } from '../components/Themed';
import axios from 'axios';
import { useEffect, useState } from 'react';

const weatherBaseUrl = "https://johnnythompson.co.uk/orchestrator/weather";
let coordinates: any[] = [];

export default function ResultScreen({ route, navigation } : {route: any, navigation: any}) {
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any[]>([]);

  useEffect(() => {
    if(coordinates.length < 1)
      setCoordinates(getAllCoordinates(route.params.startCoordinates, route.params.endCoordinates));
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchWeather = async (coordinate : any) => {
      try {
        const response = await axios.get(weatherBaseUrl, { params: {
          lat: coordinate.lat,
          lon: coordinate.lon
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
      if(coordinate.requested === false) {
        filteredWeatherData = []; 
        fetchWeather(coordinate);
      }
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
      <Text style={styles.infoText}>{generateJourneyWeatherText(filteredWeatherData, route.params.startCoordinates.name, route.params.endCoordinates.name)}</Text>
      <Text style={styles.infoText}>{generateEndWeatherText(filteredWeatherData, route.params.endCoordinates.name)}</Text>
      {generateWarningText(filteredWeatherData)}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <ScrollView style={styles.scrollView}>
        {filteredWeatherData.sort((a, b) => a.key > b.key ? 1 : -1).map(r => {
          if(r.weather !== undefined)
            return <WeatherReport key={r.key} weatherData={r.weather}/>
          else
            return <Text key={r.key}>Loading...</Text>
        })}    
      </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  infoText: {
    margin: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  warning: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  scrollView: {
    width: '100%',
    marginBottom: 20,
  },
});

const getAllCoordinates = (startCoordinates : Object, endCoordinates : Object) => {
  let index = 0;
  let coordinates = [{key: index++, lat: startCoordinates.lat, lon: startCoordinates.lon, requested: false}];

  let latDistance = endCoordinates.lat - startCoordinates.lat;
  let lonDistance = endCoordinates.lon - startCoordinates.lon;

  let totalDistance = Math.abs(latDistance) + Math.abs(lonDistance);

  if(totalDistance > 0.6) {
    let logBase = 1.35;
    let numOfCalls = Math.ceil(Math.log(totalDistance) / Math.log(logBase));

    let latStart = startCoordinates.lat;
    let lonStart = startCoordinates.lon;

    let latJump = latDistance / numOfCalls;
    let lonJump = lonDistance / numOfCalls;
    for(let i = 0; i < numOfCalls; i++) {
        latStart += latJump;
        lonStart += lonJump;
        coordinates.push({key: index++, lat: latStart, lon: lonStart, requested: false});
    }
  }

  coordinates.push({key: index++, lat: endCoordinates.lat, lon: endCoordinates.lon, requested: false});

  return coordinates;
}

function generateJourneyWeatherText(weatherData : any, origin : string, destination : string) {
  if(origin === 'Current Location') origin = 'your current location';
  if(destination === 'Current Location') destination = 'your current location';
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
    let prefix = "Your journey from "+origin+" to "+destination+" should be";    

    if(weatherTypes.length == 1)
      return prefix+" entirely "+addYSuffix(weatherTypes[0])+".";
    if(weatherTypes.length == 2) {
      if(weatherFrequency[0] === weatherFrequency[1])
        return prefix+" half "+addYSuffix(weatherTypes[0])+" and half "+addYSuffix(weatherTypes[1])+".";
      if(weatherFrequency[0] < weatherFrequency[1])
        return prefix+" mostly "+addYSuffix(weatherTypes[1])+" with some "+addPluralSuffix(weatherTypes[0])+".";
      else
        return prefix+" mostly "+addYSuffix(weatherTypes[0])+" with some "+addPluralSuffix(weatherTypes[1])+".";
    }
  };
  return "";
}

function generateEndWeatherText(weatherData : any, destination : string) {
  if(destination === 'Current Location') destination = 'your current location';
  try{
    if(weatherData !== undefined && weatherData.length > 0 && weatherData[weatherData.length-1].weather !== undefined) {
      let lastItem = weatherData[weatherData.length-1].weather;
      let endWeather = lastItem.weather[0].main;
      if(endWeather.toLowerCase() === 'sun' || endWeather.toLowerCase() === 'clear')
        return "Skies are likely to be nice and clear in "+destination+".";
      if(endWeather.toLowerCase() === 'clouds')
        return "It is likely to be cloudy in "+destination+".";
      if(endWeather.toLowerCase() === 'drizzle')
        return "Bring an umbrella. You can expect there to be some light rain in "+destination+".";
      if(endWeather.toLowerCase() === 'rain')
        return "Bring an umbrella. You can expect it to be raining in "+destination+".";
      if(endWeather.toLowerCase() === 'atmosphere')
        return "Watch out for fog in "+destination+".";
      if(endWeather.toLowerCase() === 'thunderstorm')
        return "Prepare for thunderstorms in "+destination+".";
      if(endWeather.toLowerCase() === 'snow')
        return "Bring a coat. You can expect it to be snowing in "+destination+".";

      console.error("unknown endWeather: "+endWeather);
      return "";
    }
  } catch (error) {
    console.error(error);
    return "";
  }
}

function addYSuffix(weatherType: string | undefined) {
  if(weatherType === undefined)
    return "";

  if(weatherType.toLowerCase() === 'sun' || weatherType.toLowerCase() === 'clear')
    return "clear";
  if(weatherType.toLowerCase() === 'clouds')
    return "cloudy";
  if(weatherType.toLowerCase() === 'drizzle')
    return "light rain";
  if(weatherType.toLowerCase() === 'rain')
    return "heavy rain";
  if(weatherType.toLowerCase() === 'atmosphere')
    return "foggy";
  if(weatherType.toLowerCase() === 'thunderstorm')
    return "thunderstorms";
  if(weatherType.toLowerCase() === 'snow')
    return "snowing";

  console.log("unknown y weather type: "+weatherType);
  return weatherType;
}

function addPluralSuffix(weatherType: string | undefined) {
  if(weatherType === undefined)
    return "";

  if(weatherType.toLowerCase() === 'sun' || weatherType.toLowerCase() === 'clear')
    return "clear skies";
  if(weatherType.toLowerCase() === 'clouds')
    return "clouds";
  if(weatherType.toLowerCase() === 'drizzle')
    return "light rain";
  if(weatherType.toLowerCase() === 'rain')
    return "heavy rain";
  if(weatherType.toLowerCase() === 'atmosphere')
    return "fog";
  if(weatherType.toLowerCase() === 'thunderstorm')
    return "thunderstorms";
  if(weatherType.toLowerCase() === 'snow')
    return "snow";

  console.log("unknown weather type: "+weatherType);
  return weatherType;
}

function generateWarningText(weatherData : any) {
  const weatherForWarning: string[] = [];
  // heavy rain, thunderstorms, atmospheric, and snow
  const warningWeatherCodes = [200,201,202,210,211,212,221,230,231,232,502,503,504,511,521,522,531,600,601,602,611,612,613,615,616,620,621,622,701,711,721,731,741,751,761,762,771,781];
  weatherData.map((i: any) => {
    if(i.weather !== undefined && i.weather.weather.length > 0) {
      let weather = i.weather.weather[0];
      if(warningWeatherCodes.includes(weather.id) && !weatherForWarning.includes(weather.description))
        weatherForWarning.push(weather.description)
    }
  });

  if(weatherForWarning.length > 0) {
    let weatherText;
    if(weatherForWarning.length == 1)
      weatherText = weatherForWarning[0];
    else {
      weatherText = weatherForWarning.slice(0, weatherForWarning.length-1).join(', ');
      weatherText += ", and "+weatherForWarning[weatherForWarning.length-1];
    }
    return <Text style={styles.warning}>Watch out for {weatherText} en route!</Text>
  }
}

