import { StyleSheet, Button, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Text, TextInput, View } from '../components/Themed';
import * as ExpoLocation from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import RecentLocations from '../components/RecentLocations';

export default function SetJourneyScreen({ route, navigation } : {route: any, navigation: any}) {
  const [autoComplete, setAutoComplete] = useState(React.createRef());

  const useCurrentLoc = (params : any) => {
    (async () => {
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      let loc = await ExpoLocation.getCurrentPositionAsync({accuracy: 1});
      params.coordinates = {lat : loc.coords.latitude, lon : loc.coords.longitude }
      navigateOnwards(params, "your current location");
    })();
  }

  const navigateOnwards = (params : any, location : string) => {
    if(params.coordinates !== undefined) {
      console.log('i want a result');
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
    if (autoComplete !== null && route.params.destination == null) {
      autoComplete.current.focus();
    }
  }, [autoComplete]);

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
      {/* Start Input */}
      <View style={styles.locationInputContainer}>
        <View style={{flex:1, padding: 5, width:'100%', height: 80, justifyContent: 'center', alignItems: 'center'}}>
          <FontAwesome5 name="map-pin" size={24} color="white" />
        </View>
        <View style={styles.locationTextInputContainer}>
          <View style={{flex:1, width:'100%', justifyContent:'center', paddingLeft: 10}}>
            <Text>Start</Text>
          </View>
          <View style={{flex:2, width:'100%', justifyContent:'center'}}>
            <GooglePlacesAutocomplete fetchDetails={true}
              placeholder="Current Location"
              query={{
                key: route.params.googlePlacesApiKey,
                language: 'en', 
              }}
              onPress={(data : any, details = null) => {
                if(details !== null)
                  navigateOnwards(
                    {navigation: navigation, getCurrentLoc: false, locationEnum: location, coordinates: {
                      lat: details.geometry.location.lat, lon: details.geometry.location.lng
                    }}, data.terms !== undefined && data.terms.length > 0 ? data.terms[0].value : data.description
                  );
              }}
              onFail={(error) => console.error(error)}
              requestUrl={{
                url:
                  'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                useOnPlatform: 'web',
              }}/>
            </View>
        </View>
      </View>
      
      {/* Destination Input */}
      <View style={styles.locationInputContainer}>
        <View style={{flex:1, padding: 5, width:'100%', height: 80, justifyContent: 'center', alignItems: 'center'}}>
          <FontAwesome5 name="flag-checkered" size={24} color="white"/>
        </View>
        <View style={styles.locationTextInputContainer}>
          <View style={{flex:1, width:'100%', justifyContent:'center', paddingLeft: 10}}>
            <Text>Destination</Text>
          </View>
          <View style={{flex:2, width:'100%', justifyContent:'center'}}>
            <GooglePlacesAutocomplete fetchDetails={true}
              textInputProps={{
                ref: autoComplete,
              }}
              placeholder=''
              query={{
                key: route.params.googlePlacesApiKey,
                language: 'en', 
              }}
              onPress={(data : any, details = null) => {
                if(details !== null)
                  navigateOnwards(
                    {navigation: navigation, getCurrentLoc: false, locationEnum: location, coordinates: {
                      lat: details.geometry.location.lat, lon: details.geometry.location.lng
                    }}, data.terms !== undefined && data.terms.length > 0 ? data.terms[0].value : data.description
                  );
              }}
              onFail={(error) => console.error(error)}
              requestUrl={{
                url:
                  'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                useOnPlatform: 'web',
              }}/>
            </View>
        </View>
      </View>
      <View style={{height:'80%', width:'100%'}}>
        <RecentLocations handlePreviousLocationPress={handlePreviousLocationPress} title="Previous locations:"/>
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
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1
    
  },
  logo: {
    marginTop: 100,
  },
  keyboardContainer: {
    flex: 1,
    alignItems: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  image: {
    height: 200,
    width: 135,
  },
});
