import { NavigationContainer }     from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';

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
import InformeDetalleScreen  from '../screens/informes/InformeDetalleScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={ROUTES.SPLASH}
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name={ROUTES.SPLASH}           component={SplashScreen}          />
                <Stack.Screen name={ROUTES.LOGIN}            component={LoginScreen}            />
                <Stack.Screen name={ROUTES.REGISTER}         component={RegisterEmpresaScreen}  />
                <Stack.Screen name={ROUTES.REGISTER_USUARIO} component={RegisterUsuarioScreen}  />
                <Stack.Screen name={ROUTES.HOME}             component={HomeScreen}             />
                <Stack.Screen name={ROUTES.CREAR_INFORME}    component={CrearInformeScreen}     />
                <Stack.Screen name={ROUTES.INFORMES}         component={InformesScreen}         />
                <Stack.Screen name={ROUTES.USUARIOS}         component={GestionUsuarios}        />
                <Stack.Screen name={ROUTES.CREAR_USUARIO}    component={CrearUsuario}           />
                <Stack.Screen name={ROUTES.NOVEDADES}        component={NovedadesScreen}        />
                <Stack.Screen name={ROUTES.GRAFICOS}         component={GraficosScreen}         />
                <Stack.Screen name={ROUTES.EDITAR_DATOS}     component={EditarDatos}            />
                <Stack.Screen name={ROUTES.SUSCRIPCION}      component={SuscripcionScreen}      />
                <Stack.Screen name={ROUTES.CONFIGURACION}    component={ConfiguracionScreen}    />
                <Stack.Screen name={ROUTES.CARPETAS}         component={CarpetasScreen}         />
                <Stack.Screen name={ROUTES.INFORME_DETALLE}  component={InformeDetalleScreen}   />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
