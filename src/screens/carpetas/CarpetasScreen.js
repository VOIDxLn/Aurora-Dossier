import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, TextInput,
    TouchableOpacity, FlatList, 
    StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Logo       from '../../components/Logo';
import DrawerMenu from '../../components/DrawerMenu';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../context/UserContext';

export default function CarpetasScreen({ navigation }) {
    const { userData } = useUser();

    const [drawerVisible, setDrawerVisible]   = useState(false);
    const [activeTab, setActiveTab]           = useState('carpetas');
    const [searchQuery, setSearchQuery]       = useState('');
    const [sortLatest, setSortLatest]         = useState(true);
    const [selectedItems, setSelectedItems]   = useState([]);
    const [carpetas, setCarpetas]             = useState([]);
    const [archivos, setArchivos]             = useState([]);
    const [loading, setLoading]               = useState(true);
    const [deleting, setDeleting]             = useState(false);

    /* ── Cargar datos desde Supabase ── */
    const cargarDatos = useCallback(async () => {
        if (!userData?.id && userData?.tipo !== 'admin') return;
        setLoading(true);
        try {
            // Carpetas
            const { data: dataCarpetas, error: errCarpetas } = await supabase
                .from('carpetas')
                .select('id, nombre, created_at')
                .order('created_at', { ascending: !sortLatest });

            if (errCarpetas) throw errCarpetas;

            // Archivos
            const { data: dataArchivos, error: errArchivos } = await supabase
                .from('archivos')
                .select('id, nombre, created_at')
                .order('created_at', { ascending: !sortLatest });

            if (errArchivos) throw errArchivos;

            setCarpetas(dataCarpetas ?? []);
            setArchivos(dataArchivos ?? []);
        } catch (e) {
            Alert.alert('Error', 'No se pudieron cargar los datos: ' + e.message);
        } finally {
            setLoading(false);
        }
    }, [userData, sortLatest]);

    useEffect(() => { cargarDatos(); }, [cargarDatos]);

    /* ── Datos activos según pestaña ── */
    const currentData = activeTab === 'carpetas' ? carpetas : archivos;

    const filteredData = currentData.filter(item =>
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /* ── Selección ── */
    const isAllSelected = filteredData.length > 0 &&
        filteredData.every(item => selectedItems.includes(item.id));

    const toggleSelectItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (isAllSelected) {
            const idsToRemove = filteredData.map(i => i.id);
            setSelectedItems(prev => prev.filter(id => !idsToRemove.includes(id)));
        } else {
            const idsToAdd = filteredData.map(i => i.id);
            setSelectedItems(prev => Array.from(new Set([...prev, ...idsToAdd])));
        }
    };

    /* ── Eliminar en Supabase ── */
    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) {
            Alert.alert('Eliminar', 'No has seleccionado ningún elemento.');
            return;
        }
        Alert.alert(
            'Eliminar',
            `¿Eliminar ${selectedItems.length} elemento(s) seleccionado(s)?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        setDeleting(true);
                        try {
                            const tabla = activeTab === 'carpetas' ? 'carpetas' : 'archivos';
                            const { error } = await supabase
                                .from(tabla)
                                .delete()
                                .in('id', selectedItems);

                            if (error) throw error;

                            setSelectedItems([]);
                            await cargarDatos();
                            Alert.alert('Éxito', 'Elementos eliminados correctamente.');
                        } catch (e) {
                            Alert.alert('Error', 'No se pudo eliminar: ' + e.message);
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    /* ── Compartir ── */
    const handleShareSelected = () => {
        if (selectedItems.length === 0) {
            Alert.alert('Compartir', 'No has seleccionado ningún elemento.');
            return;
        }
        Alert.alert('Compartir', `Compartiendo ${selectedItems.length} elemento(s)...`);
    };

    /* ── Fecha legible ── */
    const formatFecha = (isoDate) => {
        if (!isoDate) return '';
        const d = new Date(isoDate);
        return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    /* ── Render de cada fila ── */
    const renderItem = ({ item }) => {
        const isSelected = selectedItems.includes(item.id);
        const iconName   = activeTab === 'carpetas' ? 'folder'          : 'file-document';
        const iconColor  = activeTab === 'carpetas' ? '#2456ee'         : '#EF5350';

        return (
            <TouchableOpacity
                style={[styles.itemRow, isSelected && styles.itemRowSelected]}
                onPress={() => toggleSelectItem(item.id)}
                activeOpacity={0.7}
            >
                <View style={styles.itemIconWrapper}>
                    <MaterialCommunityIcons name={iconName} size={32} color={iconColor} />
                </View>
                <View style={styles.itemContent}>
                    <Text style={styles.itemName}>{item.nombre}</Text>
                    <Text style={styles.itemDate}>{formatFecha(item.created_at)}</Text>
                </View>
                <MaterialCommunityIcons
                    name={isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
                    size={24}
                    color="#2456ee"
                />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

            <DrawerMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                navigation={navigation}
            />

            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                        <MaterialCommunityIcons name="menu" size={38} color="#5b5b5b" />
                    </TouchableOpacity>
                    <View style={styles.logoWrapper}>
                        <Logo width={38} height={38} />
                    </View>
                </View>

                <View style={styles.headerDivider} />

                {/* Buscador */}
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar"
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <MaterialCommunityIcons name="magnify" size={24} color="#2456ee" />
                </View>

                {/* Filtros */}
                <View style={styles.filtersRow}>
                    <TouchableOpacity style={styles.filterItem} onPress={toggleSelectAll}>
                        <Text style={styles.filterText}>Todos</Text>
                        <MaterialCommunityIcons
                            name={isAllSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
                            size={20} color="#2456ee"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.filterItem}
                        onPress={() => setSortLatest(v => !v)}
                    >
                        <Text style={styles.filterText}>Último a más reciente</Text>
                        <MaterialCommunityIcons
                            name={sortLatest ? 'checkbox-marked' : 'checkbox-blank-outline'}
                            size={20} color="#2456ee"
                        />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => { setActiveTab('archivos'); setSelectedItems([]); }}
                    >
                        <Text style={[styles.tabText, activeTab === 'archivos' && styles.tabTextActive]}>
                            Archivos
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.tabDivider} />
                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => { setActiveTab('carpetas'); setSelectedItems([]); }}
                    >
                        <Text style={[styles.tabText, activeTab === 'carpetas' && styles.tabTextActive]}>
                            Carpetas
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Lista */}
                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color="#2456ee" />
                        <Text style={styles.loadingText}>Cargando...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredData}
                        keyExtractor={item => String(item.id)}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        onRefresh={cargarDatos}
                        refreshing={loading}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <MaterialCommunityIcons
                                    name={activeTab === 'carpetas' ? 'folder-open-outline' : 'file-remove-outline'}
                                    size={52} color="#D1D5DB"
                                />
                                <Text style={styles.emptyText}>
                                    No hay {activeTab === 'carpetas' ? 'carpetas' : 'archivos'} disponibles.
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>

            {/* Barra de acción inferior */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    onPress={handleDeleteSelected}
                    style={styles.bottomBarBtn}
                    disabled={deleting}
                >
                    {deleting
                        ? <ActivityIndicator size="small" color="#EF5350" />
                        : <MaterialCommunityIcons name="trash-can-outline" size={28} color="#EF5350" />
                    }
                </TouchableOpacity>

                <View style={styles.pageIndicator}>
                    <View style={styles.indicatorDot} />
                    <View style={styles.indicatorDot} />
                    <View style={styles.indicatorDot} />
                </View>

                <TouchableOpacity style={styles.bottomBarBtn}>
                    <MaterialCommunityIcons name="folder" size={32} color="#2456ee" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleShareSelected} style={styles.bottomBarBtn}>
                    <MaterialCommunityIcons name="share-variant" size={28} color="#2456ee" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea:    { flex: 1, backgroundColor: '#f3f4f6' },
    centered:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    container:   { flex: 1, paddingHorizontal: 20, paddingTop: 16 },

    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 10,
    },
    logoWrapper: {
        width: 44, height: 44, borderRadius: 22, overflow: 'hidden',
        borderWidth: 2, borderColor: '#2456ee',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
    },
    headerDivider: { height: 2, backgroundColor: '#2456ee', marginBottom: 20 },

    searchBar: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', borderRadius: 10,
        borderWidth: 1.5, borderColor: '#D1D5DB',
        paddingHorizontal: 14, height: 50, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    },
    searchInput: { flex: 1, fontSize: 15, color: '#1A1A2E' },

    filtersRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 18, paddingHorizontal: 4,
    },
    filterItem:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
    filterText:  { fontSize: 13, color: '#5b5b5b', fontWeight: '500' },

    tabsContainer: {
        flexDirection: 'row', alignItems: 'center',
        borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: '#E5E7EB',
        paddingVertical: 12, marginBottom: 16,
    },
    tabButton:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
    tabDivider:    { width: 1.5, height: 20, backgroundColor: '#D1D5DB' },
    tabText:       { fontSize: 15, color: '#9CA3AF', fontWeight: 'bold' },
    tabTextActive: { color: '#2456ee' },

    listContent:   { paddingBottom: 110 },

    itemRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 14,
        borderRadius: 12, marginBottom: 10,
        borderWidth: 1, borderColor: '#E5E7EB',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03, shadowRadius: 2, elevation: 1,
    },
    itemRowSelected: { backgroundColor: '#EFF6FF', borderColor: '#2456ee' },
    itemIconWrapper: { marginRight: 14 },
    itemContent:     { flex: 1 },
    itemName:        { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
    itemDate:        { fontSize: 12, color: '#9CA3AF', marginTop: 4 },

    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, gap: 12 },
    emptyText:      { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },
    loadingText:    { fontSize: 14, color: '#9CA3AF' },

    bottomBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 85,
        backgroundColor: '#E5E7EB', borderTopLeftRadius: 30, borderTopRightRadius: 30,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
        paddingBottom: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1, shadowRadius: 6, elevation: 12,
    },
    bottomBarBtn:   { padding: 10, alignItems: 'center', justifyContent: 'center' },
    pageIndicator:  { flexDirection: 'row', gap: 6, alignItems: 'center' },
    indicatorDot:   { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2456ee' },
});
