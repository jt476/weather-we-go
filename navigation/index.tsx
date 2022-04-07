import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorSchemeName } from 'react-native';

import SplashScreen from '../screens/SplashScreen';
import SetStartScreen from '../screens/SetStartScreen';
import SetEndScreen from '../screens/SetEndScreen';
import ResultScreen from '../screens/ResultScreen';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SetStartScreen" component={SetStartScreen} options={{ title: 'Start Location', headerShown: true }} />
        <Stack.Screen name="SetEndScreen" component={SetEndScreen} options={{ title: 'End Location' }}/>
        <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ title: 'Result' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();
