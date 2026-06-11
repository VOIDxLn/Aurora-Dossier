import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { useNovedades }        from './hooks/useNovedades';
import AdminNovedadesView      from './views/AdminNovedadesView';
import EmpleadoNovedadesView   from './views/EmpleadoNovedadesView';

export default function NovedadesScreen({ navigation }) {
    const {
        cargando, rol,
        listaAdmin, listaPendientes, listaCompletadas,
        tarjetaExpandida, vistasMap,
        handlePublicar, handleExpandir, handleMarcarVisto,
    } = useNovedades();

    if (cargando || rol === null) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    if (rol === 'admin') {
        return (
            <AdminNovedadesView
                lista={listaAdmin}
                tarjetaExpandida={tarjetaExpandida}
                vistasMap={vistasMap}
                onExpandir={handleExpandir}
                onPublicar={handlePublicar}
            />
        );
    }

    return (
        <EmpleadoNovedadesView
            listaPendientes={listaPendientes}
            listaCompletadas={listaCompletadas}
            onMarcarVisto={handleMarcarVisto}
            navigation={navigation}
        />
    );
}
