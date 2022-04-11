import { StyleSheet, KeyboardAvoidingView, Platform, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import * as ExpoLocation from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import RecentLocations from '../components/RecentLocations';

const currentLocationStr = "Current Location";

export default function SetJourneyScreen({ route, navigation } : {route: any, navigation: any}) {
  const [startAutoComplete, setStartAutoComplete] = useState(React.createRef());
  const [endAutoComplete, setEndAutoComplete] = useState(React.createRef());
  const [startCoordinates, setStartCoordinates] = useState({});
  const [endCoordinates, setEndCoordinates] = useState({});

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

  const navigateOnwards = () => {
    if(!startAutoComplete.current.value)
      startAutoComplete.current.focus();
    else if(!endAutoComplete.current.value)
      endAutoComplete.current.focus();
    else {
      if(startAutoComplete.current.value === currentLocationStr || endAutoComplete.current.value === currentLocationStr) {
        (async () => {
          let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
          }

          let loc = await ExpoLocation.getCurrentPositionAsync({accuracy: 1});
          if(startAutoComplete.current.value === currentLocationStr) {
            setStartCoordinates({lat : loc.coords.latitude, lon : loc.coords.longitude });
          }
          if(endAutoComplete.current.value === currentLocationStr) {
            setEndCoordinates({lat : loc.coords.latitude, lon : loc.coords.longitude });
          }
          
          navigation.navigate("ResultScreen", {
            ...route.params,
            startCoordinates: startCoordinates,
            endCoordinates: endCoordinates,
          });
        })();
      };
      
      navigation.navigate("ResultScreen", {
        ...route.params,
        startCoordinates: startCoordinates,
        endCoordinates: endCoordinates,
      });
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
    startAutoComplete.current.defaultValue = currentLocationStr;
    if (startAutoComplete !== null && route.params.destination == null) {
      endAutoComplete.current.focus();
    } else {
      endAutoComplete.current.value = route.params.destination;
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
                  textInputProps={{
                    ref: startAutoComplete,
                  }}
                  placeholder=""
                  query={{
                    key: route.params.googlePlacesApiKey,
                    language: 'en', 
                  }}
                  onPress={(data : any, details = null) => {
                    if(details !== null) {
                      setStartCoordinates({
                        lat: details.geometry.location.lat, 
                        lon: details.geometry.location.lng,
                        loc: data.terms !== undefined && data.terms.length > 0 ? data.terms[0].value : data.description
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
                  <FontAwesome5.Button name="location-arrow" style={styles.locationButton} onPress={() => useCurrentLoc(startAutoComplete)}/>
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
                    ref: endAutoComplete,
                  }}
                  placeholder='Please enter a destination'
                  query={{
                    key: route.params.googlePlacesApiKey,
                    language: 'en', 
                  }}
                  onPress={(data : any, details = null) => {
                    if(details !== null) {
                      setEndCoordinates({
                        lat: details.geometry.location.lat, 
                        lon: details.geometry.location.lng,
                        loc: data.terms !== undefined && data.terms.length > 0 ? data.terms[0].value : data.description
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
                  <FontAwesome5.Button name="location-arrow" style={styles.locationButton} onPress={() => useCurrentLoc(endAutoComplete)}/>
                </View>
              </View>
          </View>
        </View>
      </View>
      <View>
        <RecentLocations handlePreviousLocationPress={handlePreviousLocationPress} title="Previous locations:"/>
      </View>
      <View style={{padding: 10}}>
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

