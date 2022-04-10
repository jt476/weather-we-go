import { StyleSheet } from 'react-native';
import { View, Text } from './Themed';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';

interface LocationInputProps {
  handleLocationSlider: (location: string) => void
}

export default function LocationInput<LocationInputProps>({handleLocationSlider}) {
  const [previousLocations, setPreviousLocations] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@previous_locations')
        if(jsonValue != null) 
          setPreviousLocations(JSON.parse(jsonValue))
        else
          setPreviousLocations(['test1','test2']);
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
        {previousLocations.map(location => {
          return(
          <View key={location} style={styles.previousLocation}>
            <FontAwesome5.Button key={location} color='#1c2026' name='map-pin' style={{backgroundColor: 'white'}} 
            onPress={() => handleLocationSlider('location')} solid>
              {location}</FontAwesome5.Button>
          </View>
        )})}
      </View>
  );
}

const styles = StyleSheet.create({
  previousLocation: {
    marginTop:5, 
    backgroundColor: 'none',
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
