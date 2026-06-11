import { useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, ActivityIndicator, TextInput, RefreshControl,
} from 'react-native';
import { SafeAreaView }           from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect }         from '@react-navigation/native';
import { useCallback }            from 'react';

import Logo       from '../../components/Logo';
import DrawerMenu from '../../components/DrawerMenu';
import { useInformes } from './hooks/useInformes';
import { COLORS } from '../../constants/colors';
import { ROUTES }  from '../../constants/routes';

export default function InformesScreen({ navigation }) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [busqueda,      setBusqueda]      = useState('');

    const { informes, cargando, refreshing, cargar, eliminar } = useInformes();

    useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

    const informesFiltrados = informes.filter(i =>
        i.titulo?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const formatFecha = (iso) => {
        if (!iso) return '';
        return new Date(iso).toLocaleDateString('es-CO', {
            day: '2-digit', month: 'long', year: 'numeric',
        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <View style={styles.rowIcon}>
                <MaterialCommunityIcons name="file-pdf-box" size={36} color="#EF5350" />
            </View>
            <View style={styles.rowContent}>
                <Text style={styles.rowTitle} numberOfLines={1}>{item.titulo}</Text>
                <Text style={styles.rowDate}>{formatFecha(item.created_at)}</Text>
            </View>
            <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate(ROUTES.INFORME_DETALLE, { informe: item })}
            >
                <MaterialCommunityIcons name="pencil-outline" size={22} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => eliminar(item)}
            >
                <MaterialCommunityIcons name="trash-can-outline" size={22} color="#EF5350" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <DrawerMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                navigation={navigation}
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
                <Text style={styles.pageTitle}>Gestionar informes</Text>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => navigation.navigate(ROUTES.CREAR_INFORME)}
                >
                    <MaterialCommunityIcons name="plus" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar"
                    placeholderTextColor="#9CA3AF"
                    value={busqueda}
                    onChangeText={setBusqueda}
                />
                <MaterialCommunityIcons name="magnify" size={22} color="#9CA3AF" />
            </View>

            {cargando ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={informesFiltrados}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => cargar(true)}
                            colors={[COLORS.primary]}
                            tintColor={COLORS.primary}
                        />
                    }
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={() => (
                        <View style={styles.vacio}>
                            <MaterialCommunityIcons name="file-document-outline" size={72} color="#D1D5DB" />
                            <Text style={styles.vacioTitulo}>
                                {busqueda ? 'Sin resultados' : 'No tienes informes aún'}
                            </Text>
                            {!busqueda && (
                                <TouchableOpacity
                                    style={styles.btnCrear}
                                    onPress={() => navigation.navigate(ROUTES.CREAR_INFORME)}
                                >
                                    <Text style={styles.btnCrearTexto}>Crear mi primer informe</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background },

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
        alignItems: 'center', paddingHorizontal: 20, marginBottom: 16,
    },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark },
    addBtn:    { backgroundColor: COLORS.primary, borderRadius: 12, padding: 10 },

    searchBar: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.surface, borderRadius: 12,
        borderWidth: 1.5, borderColor: '#E5E7EB',
        paddingHorizontal: 14, height: 50,
        marginHorizontal: 20, marginBottom: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
    },
    searchInput: { flex: 1, fontSize: 15, color: COLORS.textDark },

    list:      { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 30 },
    separator: { height: 8 },

    row: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.surface,
        paddingVertical: 12, paddingHorizontal: 14,
        borderRadius: 12,
    },
    rowIcon:    { marginRight: 12 },
    rowContent: { flex: 1 },
    rowTitle:   { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
    rowDate:    { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },
    actionBtn:  { padding: 8 },

    vacio:         { alignItems: 'center', marginTop: 80, gap: 12 },
    vacioTitulo:   { fontSize: 16, color: COLORS.textMuted, fontWeight: '500' },
    btnCrear:      { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, marginTop: 8 },
    btnCrearTexto: { color: 'white', fontWeight: 'bold', fontSize: 15 },
});
