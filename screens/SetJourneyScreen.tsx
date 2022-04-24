import { StyleSheet, KeyboardAvoidingView, Platform, Button, Keyboard, ScrollView } from 'react-native';
import { Text, View } from '../components/Themed';
import * as ExpoLocation from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import RecentLocations from '../components/RecentLocations';
import AsyncStorage from '@react-native-async-storage/async-storage';

const currentLocationStr = "Current Location";

export default function SetJourneyScreen({ route, navigation } : {route: any, navigation: any}) {
  const startAutoCompleteRef = useRef();
  const endAutoCompleteRef = useRef();
  const [startAutoCompleteValue, setStartAutoCompleteValue] = useState<String>();
  const [endAutoCompleteValue, setEndAutoCompleteValue] = useState<String>();
  const [startCoordinatesState, setStartCoordinatesState] = useState({});
  const [endCoordinatesState, setEndCoordinatesState] = useState({});
  const [lastFocused, setLastFocused] = useState(endAutoCompleteRef);

  const useCurrentLoc = (f : any) => {
    Keyboard.dismiss();
    (async () => {
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      f(currentLocationStr);
    })();
  }

  const getPreviousLocations = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@previous_locations')
      if(jsonValue != null) 
        return (JSON.parse(jsonValue));
    } catch(e) {
      console.error(e);
    }
    return [];
  }

  const storePreviousLocations = async (value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@previous_locations', jsonValue)
    } catch (e) {
      console.error(e);
    }
  }

  const persistLocation = async (location : any) => {
    if(location !== undefined && location !== null && location && location?.name !== undefined) {
      let previousLocations = await getPreviousLocations();
      previousLocations = previousLocations.filter((i : any) => i?.name !== undefined);
      previousLocations = previousLocations.filter((i : any) => i.name !== location.name);
      previousLocations.push(location);
      if(previousLocations.length > 5) {
        previousLocations = previousLocations.slice(Math.max(previousLocations.length - 5, 0))
      }
      storePreviousLocations(previousLocations);
    }
  }

  const navigateOnwards = () => {
    let startValue = startAutoCompleteValue;
    let endValue = endAutoCompleteValue;
    let startCoordinates = startCoordinatesState;
    let endCoordinates = endCoordinatesState;

    if(startValue !== currentLocationStr && (!startCoordinates || startCoordinates === undefined || startCoordinates?.lat === undefined)) {
      startAutoCompleteRef.current?.focus();
      return;
    }
    else if(endValue !== currentLocationStr && (!endCoordinates || endCoordinates === undefined || endCoordinates?.lat === undefined)) {
      endAutoCompleteRef.current?.focus();
      return;
    }
    else {
      if(startValue === currentLocationStr || endValue === currentLocationStr) {
        (async () => {
          let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
          }

          let loc = await ExpoLocation.getCurrentPositionAsync({accuracy: 1});
          if(startValue === currentLocationStr) {
            startCoordinates = {lat: loc.coords.latitude, lon: loc.coords.longitude, name: currentLocationStr };
          } else {
            persistLocation(startCoordinates);
          };
          if(endValue === currentLocationStr) {
            endCoordinates = {lat: loc.coords.latitude, lon: loc.coords.longitude, name: currentLocationStr };
          } else {
            persistLocation(endCoordinates);
          };

          navigation.navigate("ResultScreen", {
            ...route.params,
            startCoordinates: startCoordinates,
            endCoordinates: endCoordinates,
          });
        })();
      }
      else {
        persistLocation(startCoordinates);
        persistLocation(endCoordinates);
        navigation.navigate("ResultScreen", {
          ...route.params,
          startCoordinates: startCoordinates,
          endCoordinates: endCoordinates,
        });
      };
    }
  }

  const handlePreviousLocationPress = (location: any):void => {
    Keyboard.dismiss();
    if(lastFocused === startAutoCompleteRef) {
      setStartCoordinatesState(location);
      setStartAutoCompleteValue(location.name);
    } else if(lastFocused === endAutoCompleteRef) {
      setEndCoordinatesState(location);
      setEndAutoCompleteValue(location.name);
    } else {
      console.error("unknown ref:" + lastFocused);
    }
  };

  useEffect(() => {
    setStartAutoCompleteValue(currentLocationStr);
    if (startAutoCompleteRef !== null && route.params.endCoordinates == null) {
      endAutoCompleteRef.current?.focus();
    } else {
      setEndAutoCompleteValue(route.params.endCoordinates.name);
      setEndCoordinatesState(route.params.endCoordinates);
    }
  }, []);

  return (
    <View style={styles.keyboardContainer}>
      <View style={{ flexDirection: 'column', justifyContent: 'flex-start'}}>
        {/* Start Input */}
        <View style={styles.locationInputContainer}>
          <View style={{flex:1, padding: 5, width:'100%', height: 80, justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesome5 name="map-pin" size={24} color="white" />
          </View>
          <View style={styles.locationTextInputContainer}>
            <View style={{flex:1, width:'100%', justifyContent:'center', paddingLeft: 10}}>
              <Text>Start</Text>
            </View>
            <View style={{flex:2, width:'100%', justifyContent:'center', flexDirection:'row'}}>
              <View style={{flex:6, height:'100%', justifyContent:'center'}}>
                <GooglePlacesAutocomplete 
                  styles={{
                    textInput: {
                      borderRadius: 0,
                      borderBottomLeftRadius: 5,
                      borderTopLeftRadius: 5,
                    },
                    listView: {
                      position: 'absolute',
                      width: '100%',
                      paddingTop: 40,
                    }
                  }}
                  fetchDetails={true}
                  textInputProps={{
                    onTextInput: () => {
                      setEndCoordinatesState({});
                    },
                    onFocus: () => {setLastFocused(startAutoCompleteRef)},
                    ref: startAutoCompleteRef,
                    value: startAutoCompleteValue,
                    onChangeText: setStartAutoCompleteValue,
                  }}
                  placeholder=""
                  query={{
                    key: route.params.googlePlacesApiKey,
                    language: 'en', 
                  }}
                  onPress={(data : any, details = null) => {
                    if(details !== null) {
                      setStartAutoCompleteValue(data.description);
                      setStartCoordinatesState({
                        lat: details.geometry.location.lat, 
                        lon: details.geometry.location.lng,
                        name: data.terms !== undefined && data.terms.length > 0 ? data.terms[0].value : data.description,
                        description: data.description
                      });
                      //navigateOnwards();
                    }
                  }}
                  onFail={(error) => console.error(error)}
                  requestUrl={{
                    url:
                      'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                    useOnPlatform: 'web',
                  }}/>
                </View>
                <View style={{flex:1, 
                  height: 44, 
                  justifyContent:'center',
                  alignItems: 'center',
                  backgroundColor: '#007aff',
                  borderBottomLeftRadius: 0,
                  borderTopLeftRadius: 0,
                  borderBottomRightRadius: 5, 
                  borderTopRightRadius: 5,
                  alignContent: 'center'
                  }}>
                  <FontAwesome5.Button name="location-arrow" size={14} style={styles.locationButton} onPress={() => useCurrentLoc(setStartAutoCompleteValue)}/>
                </View>
              </View>
          </View>
        </View>
        {/* End Input */}
        <View style={{flexDirection: 'row',
          width:'100%',
          padding: 10,
          paddingRight: 20,
          alignItems: 'flex-start',
          elevation: -10,}}>
          <View style={{flex:1, padding: 5, width:'100%', height: 80, justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesome5 name="flag-checkered" size={24} color="white"/>
          </View>
          <View style={styles.locationTextInputContainer}>
            <View style={{flex:1, width:'100%', justifyContent:'center', paddingLeft: 10}}>
              <Text>End</Text>
            </View>
            <View style={{flex:2, width:'100%', justifyContent:'center', flexDirection:'row'}}>
              <View style={{flex:6, height:'100%', justifyContent:'center'}}>
                <GooglePlacesAutocomplete 
                  styles={{
                    textInput: {
                      borderRadius: 0,
                      borderBottomLeftRadius: 5,
                      borderTopLeftRadius: 5,
                    },
                    listView: {
                      position: 'absolute',
                      paddingTop: 40,
                      width: '100%',
                    }
                  }}
                  fetchDetails={true}
                  textInputProps={{
                    onTextInput: () => {
                      setEndCoordinatesState({});
                    },
                    onFocus: () => {setLastFocused(endAutoCompleteRef)},
                    ref: endAutoCompleteRef,
                    value: endAutoCompleteValue,
                    onChangeText: setEndAutoCompleteValue,
                  }}
                  placeholder=''
                  query={{
                    key: route.params.googlePlacesApiKey,
                    language: 'en', 
                  }}
                  onPress={(data : any, details = null) => {
                    if(details !== null) {
                      setEndAutoCompleteValue(data.description);
                      setEndCoordinatesState({
                        lat: details.geometry.location.lat, 
                        lon: details.geometry.location.lng,
                        name: data.terms !== undefined && data.terms.length > 0 ? data.terms[0].value : data.description,
                        description: data.description
                      });
                      //navigateOnwards();
                    } else {
                      setEndAutoCompleteValue('');
                    }
                  }}
                  onFail={(error) => console.error(error)}
                  requestUrl={{
                    url:
                      'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                    useOnPlatform: 'web',
                  }}/>
                </View>
                <View style={{flex:1, 
                  height: 44, 
                  justifyContent:'center',
                  alignItems: 'center',
                  backgroundColor: '#007aff',
                  borderBottomLeftRadius: 0,
                  borderTopLeftRadius: 0,
                  borderBottomRightRadius: 5, 
                  borderTopRightRadius: 5
                  }}>
                  <FontAwesome5.Button name="location-arrow" size={14} style={styles.locationButton} onPress={() => useCurrentLoc(setEndAutoCompleteValue)}/>
                </View>
              </View>
          </View>
        </View>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <ScrollView style={{}}>
        <View style={{paddingLeft: 20, paddingRight: 20}}>
          <RecentLocations handlePreviousLocationPress={handlePreviousLocationPress} title="Previous locations:" numToDisplay={5} />
        </View>
        <View style={{padding: 20}}>
          <Button title="Go" onPress={() => navigateOnwards()}/>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  locationInputContainer: {
    flexDirection: 'row',
    width:'100%',
    padding: 10,
    paddingRight: 20,
    alignItems: 'flex-start',
  },
  locationTextInputContainer: {
    flex: 6,
    width: '100%',
    height: 80,
    flexDirection: 'column', 
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: '100%',
  },
  locationButton: {
    height: 44,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 5, 
    borderTopRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  keyboardContainer: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  },
});

