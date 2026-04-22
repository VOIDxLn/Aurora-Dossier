import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos todas las pantallas
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterEmpresaScreen from './src/screens/auth/RegisterEmpresaScreen';
import RegisterUsuarioScreen from './src/screens/auth/RegisterUsuarioScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Ocultamos la barra de título automática
        }}
      >
        {/* Pantalla de Login */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Pantalla Crear Cuenta - Paso 1 */}
        <Stack.Screen name="RegisterEmpresa" component={RegisterEmpresaScreen} />

        {/* Pantalla Crear Cuenta - Paso 2 */}
        <Stack.Screen name="RegisterUsuario" component={RegisterUsuarioScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}