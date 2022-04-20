import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorSchemeName } from 'react-native';

import SplashScreen from '../screens/SplashScreen';
import SetJourneyScreen from '../screens/SetJourneyScreen';
import ResultScreen from '../screens/ResultScreen';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SetJourneyScreen" component={SetJourneyScreen} options={{ title: 'Configure your Journey', headerShown: true }} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ title: 'Result' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();
