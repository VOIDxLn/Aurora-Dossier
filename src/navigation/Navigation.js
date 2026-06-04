import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen          from '../screens/splash/SplashScreen';
import LoginScreen           from '../screens/auth/LoginScreen';
import RegisterEmpresaScreen from '../screens/Register/RegisterEmpresaScreen';
import RegisterUsuarioScreen from '../screens/Register/RegisterUsuarioScreen';
import HomeScreen            from '../screens/home/HomeScreen';
import CrearInformeScreen    from '../screens/crear informes/CrearInformeScreen';
import InformesScreen        from '../screens/informes/InformesScreen';
import GestionUsuarios       from '../screens/GestionUsuarios';
import CrearUsuario          from '../screens/CrearUsuario';
import NovedadesScreen       from '../screens/novedades/NovedadesScreen';
import GraficosScreen        from '../screens/graficos/GraficosScreen';
import EditarDatos           from '../screens/EditarDatos';
import SuscripcionScreen     from '../screens/suscripcion/SuscripcionScreen';
import ConfiguracionScreen   from '../screens/configuracion/ConfiguracionScreen';
import CarpetasScreen        from '../screens/carpetas/CarpetasScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='Splash'
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name='Splash'          component={SplashScreen} />
                <Stack.Screen name='Login'           component={LoginScreen} />
                <Stack.Screen name='Register'        component={RegisterEmpresaScreen} />
                <Stack.Screen name='RegisterUsuario' component={RegisterUsuarioScreen} />
                <Stack.Screen name='Home'            component={HomeScreen} />
                <Stack.Screen name='CrearInforme'    component={CrearInformeScreen} />
                <Stack.Screen name='Informes'        component={InformesScreen} />
                <Stack.Screen name='Usuarios'        component={GestionUsuarios} />
                <Stack.Screen name='CrearUsuario'    component={CrearUsuario} />
                <Stack.Screen name='Novedades'       component={NovedadesScreen} />
                <Stack.Screen name='Graficos'        component={GraficosScreen} />
                <Stack.Screen name='EditarDatos'     component={EditarDatos} />
                <Stack.Screen name='Suscripcion'     component={SuscripcionScreen} />
                <Stack.Screen name='Configuracion'   component={ConfiguracionScreen} />
                <Stack.Screen name='Carpetas'        component={CarpetasScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
