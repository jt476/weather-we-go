import { StyleSheet } from 'react-native';
import { Location } from '../enum/Location';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function ResultScreen({ route, navigation } : {route: any, navigation: any}) {
  console.log(route.params);
  console.log('start: ' + route.params.startLoc);
  console.log('finish: ' + route.params.endLoc);
  //https://api.openweathermap.org/data/2.5/weather?lat=52.955120&lon=-1.234&appid=6b142a521b92aa23812bee18e3b69dc1
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
