/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorSchemeName } from 'react-native';

import ResultScreen from '../screens/ResultScreen';
import SetStartScreen from '../screens/SetStartScreen';
import SetEndScreen from '../screens/SetEndScreen';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  let state = {useCurrentLocation : true}
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

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */

const Stack = createNativeStackNavigator();
