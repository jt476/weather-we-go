import { StyleSheet, Button, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Location } from '../enum/Location';
import { Text, View } from './Themed';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import React from 'react';

export default function LocationInput({ route, location, navigation }: 
    { route : any, location : Location, navigation : any}) {
  let nextScreen = location === Location.Starting ? 'SetEndScreen' : 'ResultScreen';
        
  let usedCurrentLoc = false;
  if(route.params !== undefined && route.params.usedCurrentLoc !== undefined) 
    usedCurrentLoc = route.params.usedCurrentLoc;

  const navigateOnwards = (params : any) => {
    let loc;
    if(params.getCurrentLoc) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loc = position;
        },
        (error) => {
          console.error(error);
          alert("Please enable location services to use current location.");
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
    } else {
      loc = params.locationObj;
    }
    if(loc !== undefined) {
      if(params.locationEnum === Location.Starting)
        navigation.navigate(nextScreen, {
          usedCurrentLoc : params.getCurrentLoc,
          startLoc : params.locationObj,
        });
      else
        navigation.navigate(nextScreen, {
          usedCurrentLoc : params.getCurrentLoc,
          startLoc : route.params.startLoc,
          endLoc : params.locationObj,
        });
    }
  }

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
      <View style={styles.logo}>
        <Text style={styles.image}>
          <Image source={require('../assets/images/logo.png')} style={styles.image} />
        </Text>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.text}>
        Where are you {location == Location.Starting ? 'starting' : 'finishing'} your journey?
      </Text>
      { !usedCurrentLoc ? 
      <View>
        <Button
            title="Use Current Location"
            onPress={() => navigateOnwards(
              {navigation: navigation, getCurrentLoc: true, locationEnum: location, locationObj: "test"}
            )}
        />
        <Text style={styles.text}>Or</Text>
      </View> : <View/>}
      <View>
        <GooglePlacesAutocomplete
          placeholder="Search"
          query={{
            key: 'AIzaSyD5CTST1_bokWzoW_nPNzwsHI3S8ZVcAj0',
            language: 'en', // language of the results
          }}
          onPress={(data, details = null) => console.log(data)}
          onFail={(error) => console.error(error)}
          requestUrl={{
            url:
              'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
            useOnPlatform: 'web',
          }} // this in only required for use on the web. See https://git.io/JflFv more for details.
        />
      </View>
      <Button
        title="Go"
        onPress={() => navigateOnwards(
          {navigation: navigation, getCurrentLoc: false, locationEnum: location, locationObj: "test"}
        )}/>
    </KeyboardAvoidingView>
  );

  // Add previous locations
}

const styles = StyleSheet.create({
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
