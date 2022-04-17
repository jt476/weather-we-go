import { StyleSheet } from 'react-native';
import { View, Text } from './Themed';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';

interface LocationInputProps {
  handlePreviousLocationPress: (location: string) => void
}

export default function LocationInput<LocationInputProps>({handlePreviousLocationPress, title, numToDisplay}) {
  const [previousLocations, setPreviousLocations] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@previous_locations')
        if(jsonValue != null) {
          setPreviousLocations(JSON.parse(jsonValue));
        }
        //else setPreviousLocations([{lat: 1, lon: 1, name: 'test1'},{lat: 1, lon: 1, name: 'test2'},{lat: 1, lon: 1, name: 'test3'}])
      } catch(e) {
        console.error(e);
      }
      setIsLoaded(true);
    }
    if(!isLoaded)
      getData();
  }, [isLoaded]);

  return (
      <View style={{marginTop: 10, marginBottom: 10, backgroundColor: 'none'}}>
        {previousLocations.length > 0 ? <Text>{title}</Text> : <View/>}
        {previousLocations.slice(Math.max(previousLocations.length - numToDisplay, 0)).map(location => {
          return(
          <View key={location.name} style={styles.previousLocation}>
            <FontAwesome5.Button key={location.name} color='#1c2026' name='map-pin' style={{backgroundColor: 'white'}} 
            onPress={() => handlePreviousLocationPress(location)} solid>
              {location.description !== undefined ? location.description : location.name}</FontAwesome5.Button>
          </View>
        )})}
      </View>
  );
}

const styles = StyleSheet.create({
  previousLocation: {
    marginTop:5, 
    backgroundColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  }
});
