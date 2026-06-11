import {
    View, Text, StyleSheet, FlatList,
    TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Logo        from '../../components/Logo';
import DrawerMenu  from '../../components/DrawerMenu';
import NoAccess    from '../../components/NoAccess';
import { useUser } from '../../context/UserContext';
import { COLORS }  from '../../constants/colors';
import { ROUTES }  from '../../constants/routes';
import { PERMISSION_KEYS } from '../../constants/permissions';

import EmpleadoCard  from './components/EmpleadoCard';
import PermisosModal from './components/PermisosModal';
import { useUserManagement } from './hooks/useUserManagement';
import { useState } from 'react';

export default function GestionUsuarios({ navigation }) {
    const { userData, loading: userLoading } = useUser();
    const [drawerVisible, setDrawerVisible]  = useState(false);

    const {
        empleados, loading, refreshing,
        editingEmpleado, setEditingEmpleado,
        onRefresh, toggleActivo, togglePermiso, handleEliminar,
    } = useUserManagement();

    if (userLoading || !userData) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.centered]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    if (userData.tipo !== 'admin' && !userData.permisos?.[PERMISSION_KEYS.VER_USUARIOS]) {
        return <NoAccess navigation={navigation} />;
    }

    const total   = empleados.length;
    const activos = empleados.filter(e => e.activo).length;

    return (
        <SafeAreaView style={styles.safeArea}>
            <DrawerMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                navigation={navigation}
            />
            <PermisosModal
                empleado={editingEmpleado}
                onTogglePermiso={togglePermiso}
                onClose={() => setEditingEmpleado(null)}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                    <MaterialCommunityIcons name="menu" size={40} color={COLORS.textLight} />
                </TouchableOpacity>
                <View style={styles.logoWrapper}>
                    <Logo width={38} height={38} />
                </View>
            </View>

            <View style={styles.titleRow}>
                <View>
                    <Text style={styles.pageTitle}>Gestión de usuarios</Text>
                    <Text style={styles.pageSubtitle}>{activos}/{total} activo{total !== 1 ? 's' : ''}</Text>
                </View>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => navigation.navigate(ROUTES.CREAR_USUARIO)}
                >
                    <MaterialCommunityIcons name="account-plus-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.legendRow}>
                <MaterialCommunityIcons name="toggle-switch-outline" size={15} color={COLORS.textMuted} />
                <Text style={styles.legendText}>
                    Switch activa/desactiva el acceso · Toca "Gestionar permisos" para configurar funciones
                </Text>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : total === 0 ? (
                <View style={styles.centered}>
                    <MaterialCommunityIcons name="account-group-outline" size={72} color={COLORS.border} />
                    <Text style={styles.emptyTitle}>Sin usuarios registrados</Text>
                    <Text style={styles.emptySubtitle}>Crea el primer usuario de tu empresa</Text>
                    <TouchableOpacity
                        style={styles.emptyBtn}
                        onPress={() => navigation.navigate(ROUTES.CREAR_USUARIO)}
                    >
                        <Text style={styles.emptyBtnText}>Crear usuario</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={empleados}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <EmpleadoCard
                            item={item}
                            onToggleActivo={toggleActivo}
                            onEliminar={handleEliminar}
                            onGestionarPermisos={setEditingEmpleado}
                        />
                    )}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={COLORS.primary}
                            colors={[COLORS.primary]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea:  { flex: 1, backgroundColor: COLORS.background },
    centered:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },

    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, marginBottom: 8,
    },
    logoWrapper: {
        width: 46, height: 46, borderRadius: 23, overflow: 'hidden',
        borderWidth: 2, borderColor: COLORS.primary,
        alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface,
    },

    titleRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 20, marginBottom: 4,
    },
    pageTitle:    { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark },
    pageSubtitle: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
    addBtn:       { backgroundColor: COLORS.primary, borderRadius: 12, padding: 10 },

    legendRow: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 5,
        paddingHorizontal: 20, marginBottom: 12,
    },
    legendText: { flex: 1, fontSize: 11, color: COLORS.textMuted, lineHeight: 16 },

    emptyTitle:    { fontSize: 16, fontWeight: 'bold', color: COLORS.textMedium, marginTop: 16 },
    emptySubtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 4, marginBottom: 24 },
    emptyBtn:      { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 12 },
    emptyBtnText:  { color: '#fff', fontWeight: 'bold', fontSize: 14 },

    list: { paddingHorizontal: 16, paddingBottom: 30 },
});
