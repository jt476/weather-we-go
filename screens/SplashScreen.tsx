import { Animated, Button, Dimensions, StyleSheet, Image } from 'react-native';
import { View } from '../components/Themed';
import { useEffect, useState } from 'react';
import Colors from '../constants/Colors';

export default function SplashScreen({ route, navigation } : {route: any, navigation: any}) {
  let defaultAnimations = {
    toValue: { x: 0, y: 0 },
    useNativeDriver: false,
    speed: 0.1,
    bounciness: 0,
    overshootClamping: true,
  };
  const [isLoaded, setIsLoaded] = useState(false);
  let delay = 300;

  let boxOne = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});
  let boxTwo = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});
  let boxThree = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});
  let boxFour = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});
  let boxFive = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});
  let boxSix = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});
  let boxSeven = new Animated.ValueXY({x: 0, y: Dimensions.get('window').height});

  useEffect(() => {
    if(!isLoaded) {
      console.log("not loaded!");
      Animated.spring(boxOne, {
        ...defaultAnimations,
        speed: 1,
        delay: delay*0,
      }).start();
      Animated.spring(boxTwo, {
        ...defaultAnimations,
        delay: delay*1,
      }).start();
      Animated.spring(boxThree, {
        ...defaultAnimations,
        delay: delay*2,
      }).start();
      Animated.spring(boxFour, {
        ...defaultAnimations,
        delay: delay*3,
      }).start();
      Animated.spring(boxFive, {
        ...defaultAnimations,
        delay: delay*4,
      }).start();
      Animated.spring(boxSix, {
        ...defaultAnimations,
        delay: delay*5,
      }).start();
      Animated.spring(boxSeven, {
        ...defaultAnimations,
        delay: delay*6,
      }).start()
      setIsLoaded(true);
    }
    else {
      console.log("loaded!");
    }
  }, [isLoaded]);

  return (
    <View style={styles.container}>
      <Animated.View style={{flex: 1, backgroundColor: Colors.sun.background,
          transform: [{ translateX: boxOne.x }, { translateY: boxOne.y }]
        }}/>
      <Animated.View style={{flex: 1, backgroundColor: Colors.cloud.background,
          transform: [{ translateX: boxTwo.x }, { translateY: boxTwo.y }]
        }}/>
      <Animated.View style={{justifyContent: 'center', alignItems: 'center', overflow: 'visible', paddingLeft: 20, paddingRight: 20,
          flex: 1, backgroundColor: Colors.lightRain.background,
          transform: [{ translateX: boxThree.x }, { translateY: boxThree.y }]
        }}>
        <Animated.Image source={require('../assets/images/logo_outlined.png')} style={{
          height: 535,
          width: 365,
          maxHeight: 535,
          maxWidth: 365,
          marginLeft: 50,
          marginRight: 50
        }} />
      </Animated.View>
      <Animated.View style={{flex: 1, backgroundColor: Colors.rain.background,
          transform: [{ translateX: boxFour.x }, { translateY: boxFour.y }]
        }}/>
      <Animated.View style={{flex: 1, backgroundColor: Colors.heavyRain.background, 
          transform: [{ translateX: boxFive.x }, { translateY: boxFive.y }]
        }}/>
      <Animated.View style={{flex: 1, backgroundColor: Colors.thunder.background,
        transform: [{ translateX: boxSix.x }, { translateY: boxSix.y }]
        }}>
        
      </Animated.View>
      <Animated.View style={{flex: 1, backgroundColor: Colors.snow.background,
          transform: [{ translateX: boxSeven.x }, { translateY: boxSeven.y }]
      }}/>
    </View>
  );

  //<View style={styles.animatedBox}>
  //<Button title="Let's Go!" onPress={() => navigation.navigate("SetStartScreen")}/>
  //</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  animatedBox: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    marginTop: 100,
  },
});
