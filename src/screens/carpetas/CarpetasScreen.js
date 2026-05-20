import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Logo from '../../components/Logo';
import DrawerMenu from '../../components/DrawerMenu';

const MOCK_ARCHIVOS = [
    { id: 'a1', nombre: 'Informe trabajo grupal 001', fecha: '14 Febrero 2026' },
    { id: 'a2', nombre: 'Informe examen medico 2024', fecha: '08 Noviembre 2024' },
    { id: 'a3', nombre: 'Informe tesis Ingenieria en sistemas', fecha: '02 Julio 2023' },
];

const MOCK_CARPETAS = [
    { id: 'c1', nombre: 'Recursos humanos trabajo', fecha: '21 abril 2026' },
    { id: 'c2', nombre: 'Trabajo', fecha: '03 diciembre 2025' },
    { id: 'c3', nombre: 'Universidad', fecha: '24 septiembre 2023' },
];

export default function CarpetasScreen({ navigation }) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('carpetas'); // default active tab: carpetas
    const [searchQuery, setSearchQuery] = useState('');
    const [sortLatest, setSortLatest] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);

    const currentData = activeTab === 'carpetas' ? MOCK_CARPETAS : MOCK_ARCHIVOS;

    // Filter by search query
    const filteredData = currentData.filter(item =>
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting implementation (mocked dates comparison or standard reverse)
    const sortedData = [...filteredData].sort((a, b) => {
        // Since dates are in Spanish text format, we will just simulate sort by checking state
        return sortLatest ? 1 : -1;
    });

    const isAllSelected = sortedData.length > 0 && sortedData.every(item => selectedItems.includes(item.id));

    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const toggleSelectAll = () => {
        if (isAllSelected) {
            // Deselect all items from current filtered view
            const idsToRemove = sortedData.map(item => item.id);
            setSelectedItems(selectedItems.filter(id => !idsToRemove.includes(id)));
        } else {
            // Select all items from current filtered view
            const idsToAdd = sortedData.map(item => item.id);
            const uniqueNewIds = Array.from(new Set([...selectedItems, ...idsToAdd]));
            setSelectedItems(uniqueNewIds);
        }
    };

    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) {
            Alert.alert('Eliminar', 'No has seleccionado ningún elemento.');
            return;
        }
        Alert.alert(
            'Eliminar',
            `¿Estás seguro de que deseas eliminar los ${selectedItems.length} elementos seleccionados?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        setSelectedItems([]);
                        Alert.alert('Éxito', 'Elementos eliminados correctamente.');
                    }
                }
            ]
        );
    };

    const handleShareSelected = () => {
        if (selectedItems.length === 0) {
            Alert.alert('Compartir', 'No has seleccionado ningún elemento.');
            return;
        }
        Alert.alert('Compartir', `Compartiendo ${selectedItems.length} elementos seleccionados...`);
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedItems.includes(item.id);
        const iconName = activeTab === 'carpetas' ? 'folder' : 'file-document';
        const iconColor = activeTab === 'carpetas' ? '#2456ee' : '#EF5350';

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
                    <Text style={styles.itemDate}>{item.fecha}</Text>
                </View>
                <View style={styles.checkboxWrapper}>
                    <MaterialCommunityIcons
                        name={isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        size={24}
                        color="#2456ee"
                    />
                </View>
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
                {/* Header Superior */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.headerBtn}>
                        <MaterialCommunityIcons name="menu" size={38} color="#5b5b5b" />
                    </TouchableOpacity>
                    <View style={styles.logoWrapper}>
                        <Logo width={38} height={38} />
                    </View>
                </View>

                {/* Línea divisora azul inferior del Header */}
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

                {/* Filtros Superiores */}
                <View style={styles.filtersRow}>
                    <TouchableOpacity
                        style={styles.filterItem}
                        onPress={toggleSelectAll}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.filterText}>Todos</Text>
                        <MaterialCommunityIcons
                            name={isAllSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
                            size={20}
                            color="#2456ee"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.filterItem}
                        onPress={() => setSortLatest(!sortLatest)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.filterText}>Ultimo a mas reciente</Text>
                        <MaterialCommunityIcons
                            name={sortLatest ? 'checkbox-marked' : 'checkbox-blank-outline'}
                            size={20}
                            color="#2456ee"
                        />
                    </TouchableOpacity>
                </View>

                {/* Tabs Superiores */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => {
                            setActiveTab('archivos');
                            setSelectedItems([]);
                        }}
                    >
                        <Text style={[styles.tabText, activeTab === 'archivos' && styles.tabTextActive]}>
                            Archivos
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.tabDivider} />

                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => {
                            setActiveTab('carpetas');
                            setSelectedItems([]);
                        }}
                    >
                        <Text style={[styles.tabText, activeTab === 'carpetas' && styles.tabTextActive]}>
                            Carpetas
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Lista */}
                <FlatList
                    data={sortedData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons
                                name={activeTab === 'carpetas' ? 'folder-open-outline' : 'file-remove-outline'}
                                size={48}
                                color="#9CA3AF"
                            />
                            <Text style={styles.emptyText}>No se encontraron elementos.</Text>
                        </View>
                    }
                />
            </View>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={handleDeleteSelected} style={styles.bottomBarBtn}>
                    <MaterialCommunityIcons name="trash-can-outline" size={28} color="#EF5350" />
                </TouchableOpacity>

                <View style={styles.pageIndicator}>
                    <View style={styles.indicatorDot} />
                    <View style={styles.indicatorDot} />
                    <View style={styles.indicatorDot} />
                </View>

                <TouchableOpacity onPress={() => console.log('Folder tab pressed')} style={styles.bottomBarBtn}>
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
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerBtn: {
        padding: 4,
    },
    logoWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#2456ee',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    headerDivider: {
        height: 2,
        backgroundColor: '#2456ee',
        width: '100%',
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        paddingHorizontal: 14,
        height: 50,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A2E',
    },
    filtersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
        paddingHorizontal: 4,
    },
    filterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    filterText: {
        fontSize: 13,
        color: '#5b5b5b',
        fontWeight: '500',
    },
    tabsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: '#E5E7EB',
        paddingVertical: 12,
        marginBottom: 16,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabDivider: {
        width: 1.5,
        height: 20,
        backgroundColor: '#D1D5DB',
    },
    tabText: {
        fontSize: 15,
        color: '#9CA3AF',
        fontWeight: 'bold',
    },
    tabTextActive: {
        color: '#2456ee',
    },
    listContent: {
        paddingBottom: 110, // padding to clear the bottom action bar
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    itemRowSelected: {
        backgroundColor: '#EAEAEA',
        borderColor: '#2456ee',
    },
    itemIconWrapper: {
        marginRight: 14,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A2E',
    },
    itemDate: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    checkboxWrapper: {
        paddingLeft: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 85,
        backgroundColor: '#E5E7EB',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 12,
    },
    bottomBarBtn: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageIndicator: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    indicatorDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#2456ee',
    },
});
