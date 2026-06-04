import {
    View, Text, StyleSheet, FlatList,
    TouchableOpacity, Alert, ActivityIndicator,
    Switch, RefreshControl, Modal, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Logo from '../../components/Logo';
import DrawerMenu from '../../components/DrawerMenu';
import NoAccess from '../../components/NoAccess';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../context/UserContext';

const ROL_STYLE = {
    admin:      { bg: '#EFF6FF', color: '#2456ee'  },
    supervisor: { bg: '#F0FDF4', color: '#16a34a'  },
    empleado:   { bg: '#FFF7ED', color: '#ea580c'  },
};

const PERMISOS_CONFIG = [
    { key: 'crear_usuarios',  label: 'Crear usuarios',   icon: 'account-plus-outline'      },
    { key: 'ver_usuarios',    label: 'Ver usuarios',      icon: 'account-group-outline'     },
    { key: 'crear_informes',  label: 'Crear informes',    icon: 'file-plus-outline'         },
    { key: 'ver_informes',    label: 'Ver informes',      icon: 'file-document-outline'     },
    { key: 'ver_graficos',    label: 'Ver gráficos',      icon: 'chart-bar'                 },
    { key: 'ver_novedades',   label: 'Ver novedades',     icon: 'newspaper-variant-outline' },
];

export default function GestionUsuarios({ navigation }) {
    const { userData, loading: userLoading } = useUser();
    const [drawerVisible,   setDrawerVisible]   = useState(false);
    const [empleados,       setEmpleados]        = useState([]);
    const [loading,         setLoading]          = useState(true);
    const [refreshing,      setRefreshing]       = useState(false);
    const [editingEmpleado, setEditingEmpleado]  = useState(null);

    useEffect(() => { cargarEmpleados(); }, []);

    const cargarEmpleados = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: perfil } = await supabase
                .from('profiles').select('empresa_id').eq('id', user.id).single();

            const { data, error } = await supabase
                .from('empleados').select('*')
                .eq('empresa_id', perfil.empresa_id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEmpleados(data ?? []);
        } catch {
            Alert.alert('Error', 'No se pudo cargar la lista de usuarios.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => { setRefreshing(true); cargarEmpleados(); }, []);

    const toggleActivo = async (empleado) => {
        const nuevo = !empleado.activo;
        setEmpleados(prev => prev.map(e => e.id === empleado.id ? { ...e, activo: nuevo } : e));
        const { error } = await supabase.from('empleados').update({ activo: nuevo }).eq('id', empleado.id);
        if (error) {
            setEmpleados(prev => prev.map(e => e.id === empleado.id ? { ...e, activo: empleado.activo } : e));
            Alert.alert('Error', 'No se pudo actualizar el estado.');
        }
    };

    const togglePermiso = async (key) => {
        if (!editingEmpleado) return;
        const permsActuales = editingEmpleado.permisos ?? {};
        const nuevosPerms   = { ...permsActuales, [key]: !permsActuales[key] };
        const updated       = { ...editingEmpleado, permisos: nuevosPerms };

        setEditingEmpleado(updated);
        setEmpleados(prev => prev.map(e => e.id === editingEmpleado.id ? updated : e));

        const { error } = await supabase
            .from('empleados').update({ permisos: nuevosPerms }).eq('id', editingEmpleado.id);
        if (error) {
            // revert
            setEditingEmpleado(editingEmpleado);
            setEmpleados(prev => prev.map(e => e.id === editingEmpleado.id ? editingEmpleado : e));
            Alert.alert('Error', 'No se pudo actualizar el permiso.');
        }
    };

    const handleEliminar = (empleado) => {
        Alert.alert(
            'Eliminar usuario',
            `¿Deseas eliminar a ${empleado.nombre}?\nEsta acción no se puede deshacer.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar', style: 'destructive',
                    onPress: async () => {
                        const { error } = await supabase.from('empleados').delete().eq('id', empleado.id);
                        if (!error) setEmpleados(prev => prev.filter(e => e.id !== empleado.id));
                        else Alert.alert('Error', 'No se pudo eliminar el usuario.');
                    },
                },
            ]
        );
    };

    // ── Modal permisos ────────────────────────────────────────────────────
    const PermisosModal = () => {
        if (!editingEmpleado) return null;
        const perms = editingEmpleado.permisos ?? {};

        return (
            <Modal
                visible={!!editingEmpleado}
                transparent
                animationType="slide"
                onRequestClose={() => setEditingEmpleado(null)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setEditingEmpleado(null)}
                >
                    <Pressable style={styles.permisosSheet} onPress={e => e.stopPropagation()}>
                        {/* Handle */}
                        <View style={styles.sheetHandle} />

                        {/* Título */}
                        <View style={styles.sheetHeader}>
                            <MaterialCommunityIcons name="shield-account-outline" size={24} color="#2456ee" />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.sheetTitle}>Permisos de acceso</Text>
                                <Text style={styles.sheetSubtitle} numberOfLines={1}>
                                    {editingEmpleado.nombre}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setEditingEmpleado(null)}>
                                <MaterialCommunityIcons name="close" size={22} color="#5b5b5b" />
                            </TouchableOpacity>
                        </View>

                        {/* Lista de permisos */}
                        {PERMISOS_CONFIG.map((p, i) => (
                            <View
                                key={p.key}
                                style={[
                                    styles.permisoRow,
                                    i < PERMISOS_CONFIG.length - 1 && styles.permisoRowBorder,
                                ]}
                            >
                                <MaterialCommunityIcons name={p.icon} size={22} color="#2456ee" />
                                <Text style={styles.permisoLabel}>{p.label}</Text>
                                <Switch
                                    value={perms[p.key] ?? false}
                                    onValueChange={() => togglePermiso(p.key)}
                                    trackColor={{ false: '#D1D5DB', true: '#6cb1ff' }}
                                    thumbColor={perms[p.key] ? '#2456ee' : '#9CA3AF'}
                                />
                            </View>
                        ))}

                        <Text style={styles.sheetNote}>
                            Los cambios se aplican de inmediato al próximo inicio de sesión del usuario.
                        </Text>
                    </Pressable>
                </Pressable>
            </Modal>
        );
    };

    // ── Tarjeta de empleado ───────────────────────────────────────────────
    const renderItem = ({ item }) => {
        const rolStyle = ROL_STYLE[item.rol] ?? ROL_STYLE.empleado;
        return (
            <View style={styles.card}>
                <View style={styles.cardAvatar}>
                    <MaterialCommunityIcons name="account-circle" size={50} color="#2456ee" />
                </View>

                <View style={styles.cardBody}>
                    <Text style={styles.cardName} numberOfLines={1}>{item.nombre}</Text>
                    <Text style={styles.cardEmail} numberOfLines={1}>{item.email}</Text>
                    <Text style={styles.cardMeta} numberOfLines={1}>
                        {item.cargo}{item.departamento ? ` · ${item.departamento}` : ''}
                    </Text>

                    <View style={styles.cardBadges}>
                        <View style={[styles.rolBadge, { backgroundColor: rolStyle.bg }]}>
                            <Text style={[styles.rolText, { color: rolStyle.color }]}>{item.rol}</Text>
                        </View>
                        {!item.activo && (
                            <View style={styles.pendienteBadge}>
                                <Text style={styles.pendienteText}>pendiente</Text>
                            </View>
                        )}
                    </View>

                    {/* Acceso rápido a permisos */}
                    <TouchableOpacity
                        style={styles.permisosLink}
                        onPress={() => setEditingEmpleado(item)}
                    >
                        <MaterialCommunityIcons name="shield-edit-outline" size={14} color="#2456ee" />
                        <Text style={styles.permisosLinkText}>Gestionar permisos</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardActions}>
                    <Switch
                        value={item.activo}
                        onValueChange={() => toggleActivo(item)}
                        trackColor={{ false: '#D1D5DB', true: '#6cb1ff' }}
                        thumbColor={item.activo ? '#2456ee' : '#9CA3AF'}
                        style={styles.switch}
                    />
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleEliminar(item)}>
                        <MaterialCommunityIcons name="trash-can-outline" size={22} color="#EF5350" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const total   = empleados.length;
    const activos = empleados.filter(e => e.activo).length;

    if (userLoading || !userData) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.centered]}>
                <ActivityIndicator size="large" color="#2456ee" />
            </SafeAreaView>
        );
    }

    if (userData.tipo !== 'admin' && !userData.permisos?.ver_usuarios) {
        return <NoAccess navigation={navigation} />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <DrawerMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} navigation={navigation} />
            <PermisosModal />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                    <MaterialCommunityIcons name="menu" size={40} color="#5b5b5b" />
                </TouchableOpacity>
                <View style={styles.logoWrapper}>
                    <Logo width={38} height={38} />
                </View>
            </View>

            {/* Título */}
            <View style={styles.titleRow}>
                <View>
                    <Text style={styles.pageTitle}>Gestión de usuarios</Text>
                    <Text style={styles.pageSubtitle}>{activos}/{total} activo{total !== 1 ? 's' : ''}</Text>
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CrearUsuario')}>
                    <MaterialCommunityIcons name="account-plus-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.legendRow}>
                <MaterialCommunityIcons name="toggle-switch-outline" size={15} color="#9CA3AF" />
                <Text style={styles.legendText}>Switch activa/desactiva el acceso · Toca "Gestionar permisos" para configurar funciones</Text>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#2456ee" />
                </View>
            ) : total === 0 ? (
                <View style={styles.centered}>
                    <MaterialCommunityIcons name="account-group-outline" size={72} color="#D1D5DB" />
                    <Text style={styles.emptyTitle}>Sin usuarios registrados</Text>
                    <Text style={styles.emptySubtitle}>Crea el primer usuario de tu empresa</Text>
                    <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('CrearUsuario')}>
                        <Text style={styles.emptyBtnText}>Crear usuario</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={empleados}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2456ee" colors={['#2456ee']} />
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },

    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, marginBottom: 8,
    },
    logoWrapper: {
        width: 46, height: 46, borderRadius: 23, overflow: 'hidden',
        borderWidth: 2, borderColor: '#2456ee',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
    },

    titleRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 20, marginBottom: 4,
    },
    pageTitle:    { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E' },
    pageSubtitle: { fontSize: 13, color: '#5b5b5b', marginTop: 2 },
    addBtn:       { backgroundColor: '#2456ee', borderRadius: 12, padding: 10 },

    legendRow: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 5,
        paddingHorizontal: 20, marginBottom: 12,
    },
    legendText: { flex: 1, fontSize: 11, color: '#9CA3AF', lineHeight: 16 },

    emptyTitle:    { fontSize: 16, fontWeight: 'bold', color: '#374151', marginTop: 16 },
    emptySubtitle: { fontSize: 13, color: '#9CA3AF', marginTop: 4, marginBottom: 24 },
    emptyBtn:      { backgroundColor: '#2456ee', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 12 },
    emptyBtnText:  { color: '#fff', fontWeight: 'bold', fontSize: 14 },

    list: { paddingHorizontal: 16, paddingBottom: 30 },

    card: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 14,
        borderWidth: 1.5, borderColor: '#E5E7EB',
        padding: 14, marginBottom: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
    },
    cardAvatar: { marginRight: 12 },
    cardBody:   { flex: 1, minWidth: 0 },
    cardName:   { fontSize: 15, fontWeight: 'bold', color: '#1A1A2E' },
    cardEmail:  { fontSize: 12, color: '#5b5b5b', marginTop: 2 },
    cardMeta:   { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

    cardBadges:    { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
    rolBadge:      { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
    rolText:       { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
    pendienteBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#FEF3C7' },
    pendienteText:  { fontSize: 11, fontWeight: '600', color: '#D97706' },

    permisosLink:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
    permisosLinkText: { fontSize: 12, color: '#2456ee', fontWeight: '500' },

    cardActions: { alignItems: 'center', gap: 6, marginLeft: 8 },
    switch:      { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] },
    deleteBtn:   { padding: 4 },

    // Modal permisos
    modalOverlay: {
        flex: 1, justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    permisosSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        paddingHorizontal: 24, paddingTop: 12, paddingBottom: 36,
    },
    sheetHandle: {
        width: 40, height: 4, backgroundColor: '#D1D5DB',
        borderRadius: 2, alignSelf: 'center', marginBottom: 20,
    },
    sheetHeader: {
        flexDirection: 'row', alignItems: 'center',
        gap: 12, marginBottom: 20,
    },
    sheetTitle:    { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E' },
    sheetSubtitle: { fontSize: 12, color: '#5b5b5b', marginTop: 2 },

    permisoRow: {
        flexDirection: 'row', alignItems: 'center',
        gap: 12, paddingVertical: 14,
    },
    permisoRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    permisoLabel:     { flex: 1, fontSize: 14, color: '#374151' },

    sheetNote: {
        fontSize: 11, color: '#9CA3AF',
        textAlign: 'center', marginTop: 16, lineHeight: 16,
    },
});
