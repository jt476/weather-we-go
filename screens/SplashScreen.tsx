import { Animated, Button, Dimensions, StyleSheet, Image } from 'react-native';
import { View } from '../components/Themed';
import React, { useEffect, useState } from 'react';
import Colors from '../constants/Colors';
import LocationInputSlider from '../components/LocationInputSlider';
import { FontAwesome5 } from '@expo/vector-icons';
import RecentLocations from '../components/RecentLocations';
import axios from 'axios';

const apiKeysBaseUrl = 'https://johnnythompson.co.uk/orchestrator/api-key/';

export default function SplashScreen({ route, navigation } : {route: any, navigation: any}) {
  let defaultAnimations = {
    toValue: { x: 0, y: 0 },
    useNativeDriver: true,
    speed: 0.1,
    bounciness: 0,
    overshootClamping: true,
  };
  let boxOne = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});
  let boxTwo = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});
  let boxThree = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});
  let boxFour = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});
  let boxFive = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});
  let boxSix = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});
  let boxSeven = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});

  let overlayOpacity = new Animated.Value(0);
  let miniLocationInput = new Animated.ValueXY({x:0, y: Dimensions.get('window').height});

  const [googlePlacesApiKey, setGooglePlacesApiKey] = useState();
  useEffect(() => {
    const getAPIKey = async () => {
      try {
        const url = `${apiKeysBaseUrl}google-places`;
        const response = await axios.get(url).then((response) => response.data);
        if(response != null)
          setGooglePlacesApiKey(response);
      } catch(e) {
        console.error(e);
      }
    }
    
    Animated.spring(boxOne, {
      ...defaultAnimations,
    }).start(() => {
      Animated.spring(boxTwo, {
        ...defaultAnimations,
      }).start(() => {
        Animated.spring(boxThree, {
          ...defaultAnimations,
        }).start(() => {
          Animated.spring(boxFour, {
            ...defaultAnimations,
          }).start(() => {
            Animated.spring(boxFive, {
              ...defaultAnimations,
            }).start(() => {
              Animated.spring(boxSix, {
                ...defaultAnimations,
              }).start(() => {
                Animated.spring(boxSeven, {
                  ...defaultAnimations,
                }).start(() => {
                  Animated.timing(
                    overlayOpacity,
                    {
                      toValue: 1,
                      duration: 1000,
                      useNativeDriver: true,
                    }
                  ).start(() => {
                    Animated.spring(miniLocationInput, {
                      toValue: { x: 0, y: 0 },
                      useNativeDriver: true,
                      speed: 0.1,
                      bounciness: 0,
                      overshootClamping: true,
                    }).start(() => {
                      getAPIKey();
                    })
                  });
                });
              });
            });
          });
        });
      });
    });
  }, []);

  const handleLocationSlider = (location: any):void => {
    navigation.navigate("SetJourneyScreen", {
      ...route.params,
      googlePlacesApiKey: googlePlacesApiKey,
      destination: location,
    });
  };

  return (
    <View style={styles.backgroundViews}>
      <Animated.View style={{flex: 1, backgroundColor: Colors.snow.background,
          transform: [{ translateX: boxOne.x }, { translateY: boxOne.y }]
        }}/>
      <Animated.View style={{flex: 1, backgroundColor: Colors.thunder.background,
          transform: [{ translateX: boxTwo.x }, { translateY: boxTwo.y }]
        }}/>
      <Animated.View style={{flex: 1, backgroundColor: Colors.fog.background,
          transform: [{ translateX: boxThree.x }, { translateY: boxThree.y }]
        }}/>
      <Animated.View style={{flex: 1, backgroundColor: Colors.heavyRain.background,
          transform: [{ translateX: boxFour.x }, { translateY: boxFour.y }]
        }}/>
      <Animated.View style={{flex: 1, backgroundColor: Colors.lightRain.background, 
          transform: [{ translateX: boxFive.x }, { translateY: boxFive.y }]
        }}/>
      <Animated.View style={{flex: 1, backgroundColor: Colors.cloud.background,
        transform: [{ translateX: boxSix.x }, { translateY: boxSix.y }]
        }}/>
      <Animated.View style={{flex: 1, backgroundColor: Colors.sun.background,
          transform: [{ translateX: boxSeven.x }, { translateY: boxSeven.y }]
      }}/>
      <Animated.View style={{
          zIndex: 1, 
          opacity: overlayOpacity, 
          width: '100%', 
          height: '100%', 
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
        <Image source={require('../assets/images/logo_dark_outlined_square.png')} style={{
          height: '90%',
          width: '90%',
          maxHeight: 535,
          maxWidth: 535,
          resizeMode: "contain",
          marginBottom: 50,
          flex: 1,
        }} />
        <Animated.View style={{
          backgroundColor: '#979dac',
          width: '100%',
          height: '20%',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          justifyContent: 'center',
          padding: 20,
          flex: 10, 
          transform: [{ translateX: miniLocationInput.x }, { translateY: miniLocationInput.y }]}}>
          <View style={{backgroundColor: 'none', justifyContent: 'center'}}>
            <FontAwesome5.Button name='search' color='#1c2026' 
            onPress={() => handleLocationSlider(null)} style={{backgroundColor: 'white'}}
            light>
              Where are you going?
            </FontAwesome5.Button>
            <RecentLocations handleLocationSlider={handleLocationSlider}/>
            <LocationInputSlider/>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
  //<Button title="Let's Go!" onPress={() => }/>
  
}

const styles = StyleSheet.create({
  backgroundViews: {
    flex: 1,
    flexDirection: "column",
    zIndex: 2,
    width: '100%',
    height: '100%'
  },
  parent: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  animatedBox: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    marginTop: 100,
  },
});

