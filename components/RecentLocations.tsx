import { StyleSheet } from 'react-native';
import { View, Text } from './Themed';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import { useIsFocused } from '@react-navigation/native';

interface LocationInputProps {
  handlePreviousLocationPress: (location: string) => void
}

export default function LocationInput<LocationInputProps>({handlePreviousLocationPress, title, numToDisplay}) {
  const [previousLocations, setPreviousLocations] = useState<any[]>([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@previous_locations')
        if(jsonValue != null) {
          const values = JSON.parse(jsonValue);
          values.sort((a, b) => (b.added === undefined ? 0 : b.added) - (a.added === undefined ? 0 : a.added));
          setPreviousLocations(values);
        }
      } catch(e) {
        console.error(e);
      }
    }
    getData();
  }, [isFocused]);

  return (
      <View style={{marginTop: 10, marginBottom: 10, backgroundColor: 'none'}}>
        {previousLocations.length > 0 ? <Text>{title}</Text> : <View/>}
        {previousLocations.slice(0, Math.min(previousLocations.length, numToDisplay)).map(location => {
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
