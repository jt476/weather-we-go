import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorSchemeName } from 'react-native';

import ResultScreen from '../screens/ResultScreen';
import SetStartScreen from '../screens/SetStartScreen';
import SetEndScreen from '../screens/SetEndScreen';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="SetStartScreen">
        <Stack.Screen name="SetStartScreen" component={SetStartScreen} options={{ title: 'Start Location', headerShown: true }} />
        <Stack.Screen name="SetEndScreen" component={SetEndScreen} options={{ title: 'End Location' }}/>
        <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ title: 'Result' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();
