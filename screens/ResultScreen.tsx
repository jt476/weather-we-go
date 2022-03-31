import { StyleSheet } from 'react-native';
import { Location } from '../enum/Location';
import WeatherReport from '../components/WeatherReport';
import { Text, View } from '../components/Themed';
import axios from 'axios';
import { useEffect, useState } from 'react';

let doneLoading = false;

export default function ResultScreen({ route, navigation } : {route: any, navigation: any}) {
  let coordinates = getAllCoordinates(route.params);
  let [weatherData, setWeatherData] = useState([{key:0, weather: undefined}]);

  useEffect(() => {
    for (let coordinate of coordinates) {
      if(!coordinate.requested) {
        coordinate.requested = true;
        axios.get(`https://api.openweathermap.org/data/2.5/weather`, 
        {
          params: {
            lat: coordinate.lat,
            lon: coordinate.lon,
            appid: "6b142a521b92aa23812bee18e3b69dc1",
        }}).then((response) => {
          setWeatherData([...weatherData, {key: coordinate.index, weather: response.data}]);
        });
        console.log(weatherData);
      }
    }
    doneLoading = true;
  }, [weatherData]);
  
  // todo, remove duplicated weather stations
  
  /*console.log('latDistance: '+latDistance);
  console.log('lonDistance: '+lonDistance);
  console.log('totalDistance: '+totalDistance);
  console.log(arr);*/

  console.log(weatherData);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You will have {generateWeatherText()}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {weatherData.map(r => {
        if(r.weather !== undefined)
          return <Text key={r.key}>Done!</Text>
        else
          return <Text key={r.key}>Loading...</Text>
      })}    
    </View>
  );
}

const findWeatherData = (params : any) => {
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
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
  let coordinates = [{index: index++, lat: params.startLat, lon: params.startLon, weatherData: undefined, requested: false}];

  let latDistance = params.endLat - params.startLat;
  let lonDistance = params.endLon - params.startLon;

  let totalDistance = Math.abs(latDistance) + Math.abs(lonDistance);

  if(totalDistance > 0.6) {
    let logBase = 1.35;
    let numOfCalls = Math.ceil(Math.log(totalDistance) / Math.log(logBase));
    console.log('numOfCalls: '+numOfCalls);

    let latStart = params.startLat;
    let lonStart = params.startLon;

    let latJump = latDistance / numOfCalls;
    let lonJump = lonDistance / numOfCalls;
    for(let i = 0; i < numOfCalls; i++) {
        latStart += latJump;
        lonDistance += lonJump;
        coordinates.push({index: index++, lat: latStart, lon: lonStart, weatherData: undefined, requested: false});
    }
  }

  coordinates.push({index: index++, lat: params.endLat, lon: params.endLon, weatherData: undefined, requested: false});

  return coordinates;
}


function generateWeatherText() {
  //const [weatherData, setWeatherData] = useState([]);
  /*var weatherTypes = new Set();

  weatherData.map((i: any) => console.log(i))*/
  //console.log(weatherData);
}



