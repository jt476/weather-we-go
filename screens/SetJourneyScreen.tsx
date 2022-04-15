import { StyleSheet, KeyboardAvoidingView, Platform, Button } from 'react-native';
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
  const [startCoordinatesState, setStartCoordinatesState] = useState({});
  const [endCoordinatesState, setEndCoordinatesState] = useState({});

  const useCurrentLoc = (ref : any) => {
    (async () => {
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      ref.current.value = currentLocationStr;
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
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@previous_locations', jsonValue)
    } catch (e) {
      console.error(e);
    }
  }

  const persistLocation = async (location : any) => {
    if(location !== undefined && location !== null) {
      let previousLocations = await getPreviousLocations();
      let existingVal = previousLocations.find((i : any) => i.name === location.name);
      if(existingVal == null) {
        previousLocations.push(location);
        if(previousLocations.length > 3) {
          previousLocations = previousLocations.slice(Math.max(previousLocations.length - 3, 0))
        }
        storePreviousLocations(previousLocations);
      } else {
        console.log(location.name + " is already stored!");
      }
    }
  }

  const navigateOnwards = () => {
    let startValue = startAutoCompleteRef.current.value;
    let endValue = endAutoCompleteRef.current.value;
    let startCoordinates = startCoordinatesState;
    let endCoordinates = endCoordinatesState;

    if(!startValue)
      startAutoCompleteRef.current?.focus();
    else if(!endValue)
      endAutoCompleteRef.current?.focus();
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
    navigation.navigate("SetJourneyScreen", {
      ...route.params,
      googlePlacesApiKey: route.params.googlePlacesApiKey,
      destination: location,
    });
  };

  useEffect(() => {
    if (startAutoCompleteRef !== null && route.params.destination == null) {
      endAutoCompleteRef.current?.focus();
    } else {
      endAutoCompleteRef.current?.setValue(route.params.destination);
    }
  }, []);

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
      <View>
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
                  currentLocation={true} 
                  styles={{
                    textInput: {
                      borderRadius: 0,
                      borderBottomLeftRadius: 5,
                      borderTopLeftRadius: 5,
                    },
                  }}
                  fetchDetails={true}
                  textInputProps={{
                    ref: startAutoCompleteRef,
                  }}
                  placeholder=""
                  query={{
                    key: route.params.googlePlacesApiKey,
                    language: 'en', 
                  }}
                  onPress={(data : any, details = null) => {
                    if(details !== null) {
                      setStartCoordinatesState({
                        lat: details.geometry.location.lat, 
                        lon: details.geometry.location.lng,
                        name: data.terms !== undefined && data.terms.length > 0 ? data.terms[0].value : data.description
                      });
                      navigateOnwards();
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
                  height: 45, 
                  justifyContent:'center',
                  alignItems: 'center',
                  backgroundColor: '#007aff',
                  borderBottomLeftRadius: 0,
                  borderTopLeftRadius: 0,
                  borderBottomRightRadius: 5, 
                  borderTopRightRadius: 5
                  }}>
                  <FontAwesome5.Button name="location-arrow" style={styles.locationButton} onPress={() => useCurrentLoc(startAutoCompleteRef)}/>
                </View>
              </View>
          </View>
        </View>
        
        {/* End Input */}
        <View style={styles.locationInputContainer}>
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
                  }}
                  fetchDetails={true}
                  textInputProps={{
                    ref: endAutoCompleteRef,
                  }}
                  placeholder='Please enter a destination'
                  query={{
                    key: route.params.googlePlacesApiKey,
                    language: 'en', 
                  }}
                  onPress={(data : any, details = null) => {
                    if(details !== null) {
                      setEndCoordinatesState({
                        lat: details.geometry.location.lat, 
                        lon: details.geometry.location.lng,
                        name: data.terms !== undefined && data.terms.length > 0 ? data.terms[0].value : data.description
                      });
                      navigateOnwards();
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
                  height: 45, 
                  justifyContent:'center',
                  alignItems: 'center',
                  backgroundColor: '#007aff',
                  borderBottomLeftRadius: 0,
                  borderTopLeftRadius: 0,
                  borderBottomRightRadius: 5, 
                  borderTopRightRadius: 5
                  }}>
                  <FontAwesome5.Button name="location-arrow" style={styles.locationButton} onPress={() => useCurrentLoc(endAutoCompleteRef)}/>
                </View>
              </View>
          </View>
        </View>
      </View>
      <View style={{padding: 20}}>
        <RecentLocations handlePreviousLocationPress={handlePreviousLocationPress} title="Previous locations:"/>
      </View>
      <View style={{padding: 20}}>
        <Button title="Go" onPress={() => navigateOnwards()}/>
      </View>
    </KeyboardAvoidingView>
  );

  // Add previous locations
}

const styles = StyleSheet.create({
  locationInputContainer: {
    flex: 1,
    flexDirection: 'row',
    width:'100%',
    height:'10%',
    padding: 10,
    paddingRight: 20,
    alignItems: 'flex-start'
  },
  locationTextInputContainer: {
    flex: 6,
    width: '100%',
    height: 80,
    flexDirection: 'column'
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  locationButton: {
    height: 45,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 5, 
    borderTopRightRadius: 5,
    color: 'black'
  },
  keyboardContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});

