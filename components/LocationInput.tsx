import { StyleSheet, Button, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Location } from '../enum/Location';
import { Text, View } from './Themed';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import React from 'react';

export default function LocationInput({ location, askCurrentLoc, navigation }: 
  { location : Location, askCurrentLoc : boolean, navigation : any}) {
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
      {askCurrentLoc ? 
      <View>
        <Button
            title="Use Current Location"
            onPress={() => {navigation.navigate(location === Location.Starting ? 'SetEndScreen' : 'ResultScreen')}}
        />
        <Text style={styles.text}>Or</Text>
      </View> : <View/>}
      <View style={{flex: 1}}>
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
            onPress={() => {navigation.navigate(location === Location.Starting ? 'SetEndScreen' : 'ResultScreen')}}
        />
    </KeyboardAvoidingView>
  );

  // Add previous locations
}

const permissionHandle = async () => {

  console.log('here')



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
