import { StyleSheet } from 'react-native';
import { Location } from '../enum/Location';
import WeatherReport from '../components/WeatherReport';
import { Text, View } from '../components/Themed';
import axios from 'axios';

export default function ResultScreen({ route, navigation } : {route: any, navigation: any}) {
  const allWeather = findAllWeatherData(route.params);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You will have {generateWeatherText(allWeather)}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {allWeather.map(r => <WeatherReport weatherData={r}/>)}    
    </View>
  );
}

const findWeatherData = async (params : any) => {
  await axios.get(`https://api.openweathermap.org/data/2.5/weather`, 
  {
    params: {
      lat: params.lat,
      lon: params.lon,
      appid: "6b142a521b92aa23812bee18e3b69dc1",
  }}).then((response) => {
    return response.data;
  });
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

function findAllWeatherData(params: any) {
  let arr = [findWeatherData({lat: params.startLat, lon: params.startLon })];

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
        arr.push(findWeatherData({lat: latStart, lon: lonStart}));
    }
  }

  arr.push(findWeatherData({lat: params.endLat, lon: params.endLon}));

  // todo, remove duplicated weather stations
  
  /*console.log('latDistance: '+latDistance);
  console.log('lonDistance: '+lonDistance);
  console.log('totalDistance: '+totalDistance);
  console.log(arr);*/

  return arr;
}

async function generateWeatherText(allWeatherData: any) {
  var weatherTypes = new Set();

  await allWeatherData.map((i: any) => console.log(i))
  console.log(allWeatherData);
}



