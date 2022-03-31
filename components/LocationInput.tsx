import { StyleSheet, Button, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Location } from '../enum/Location';
import { Text, View } from './Themed';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function LocationInput({ route, location, navigation }: 
    { route : any, location : Location, navigation : any}) {
  let nextScreen = location === Location.Starting ? 'SetEndScreen' : 'ResultScreen';
        
  let usedCurrentLoc = false;
  if(route.params !== undefined && route.params.usedCurrentLoc !== undefined) 
    usedCurrentLoc = route.params.usedCurrentLoc;

  const useCurrentLoc = (params : any) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        params.coordinates = {lat : position.coords.latitude, lon : position.coords.longitude }
        navigateOnwards(params);
      },
      (error) => {
        console.error(error);
        alert("Please enable location services to use current location.");
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  const navigateOnwards = (params : any) => {
    if(params.coordinates !== undefined) {
      if(params.locationEnum === Location.Starting)
        navigation.navigate(nextScreen, {
          usedCurrentLoc : params.getCurrentLoc,
          startLat : params.coordinates.lat,
          startLon : params.coordinates.lon,
        });
      else
        navigation.navigate(nextScreen, {
          usedCurrentLoc : params.getCurrentLoc,
          startLat : route.params.startLat,
          startLon : route.params.startLon,
          endLat : params.coordinates.lat,
          endLon : params.coordinates.lon,
        });
    }
  }
//{ !usedCurrentLoc ? 
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
      { !false ? 
      <View>
        <Button
            title="Use Current Location"
            onPress={() => useCurrentLoc(
              {navigation: navigation, getCurrentLoc: true, locationEnum: location}
            )}
        />
        <Text style={styles.text}>Or</Text>
      </View> : <View/>}
      <View>
        <GooglePlacesAutocomplete fetchDetails={true}
          placeholder="Search"
          query={{
            key: 'AIzaSyC-W10dPkAwJ8O3oAr9keKA0pri511Y9M0',
            language: 'en', // language of the results
          }}
          onPress={(data, details = null) => {
            if(details !== null)
              navigateOnwards(
                {navigation: navigation, getCurrentLoc: false, locationEnum: location, coordinates: {
                  lat:details.geometry.location.lat,lon:details.geometry.location.lng
                }}
              );
          }}
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
          {navigation: navigation, getCurrentLoc: false, locationEnum: location, coordinates: {lat:1,lon:1}}
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
