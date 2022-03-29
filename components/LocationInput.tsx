import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { Location } from '../enum/Location';
import { Text, View } from './Themed';
import { CurrentLocation } from './CurrentLocation';

export default function LocationInput({ location, askCurrentLoc }: { location : Location, askCurrentLoc : boolean }) {
  // Where are you starting your journey?
  // Current Location option
  // Or
  // Provide your starting position
  // List of previous locations
  return (
    <View>
      <Text style={styles.getStartedText}>
        Where are you {location == Location.Starting ? 'starting' : 'finishing'} your journey?
      </Text>
      {askCurrentLoc ? CurrentLocation : <View/>}
      <TextInput
        style={styles.textInput}
        defaultValue="You can type in me"
      />
    </View>
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
  );
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
  getStartedText: {
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
});
