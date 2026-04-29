import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/splash/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Splash' screenOptions={{headerShown: false}}>
                <Stack.Screen name='Splash' component={SplashScreen} />
                <Stack.Screen name='Login' component={LoginScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}