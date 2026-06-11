import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import NovedadCard       from '../components/NovedadCard';
import NuevaNovedadModal from '../components/NuevaNovedadModal';

export default function AdminNovedadesView({
    lista, tarjetaExpandida, vistasMap,
    onExpandir, onPublicar,
}) {
    const [modalVisible, setModalVisible] = useState(false);

    const handlePublicar = async (datos) => {
        const ok = await onPublicar(datos);
        if (ok) setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Panel de Control</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <MaterialCommunityIcons name="plus-circle" size={32} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={lista}
                contentContainerStyle={styles.list}
                keyExtractor={item => item.id}
                ListEmptyComponent={() => (
                    <View style={styles.empty}>
                        <MaterialCommunityIcons name="clipboard-blank-outline" size={80} color="#ccc" />
                        <Text style={styles.emptyText}>No hay novedades aún</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <NovedadCard
                        item={item}
                        isAdmin
                        tarjetaExpandida={tarjetaExpandida}
                        vistasMap={vistasMap}
                        onExpandir={onExpandir}
                    />
                )}
            />

            <NuevaNovedadModal
                visible={modalVisible}
                onPublicar={handlePublicar}
                onClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea:    { flex: 1, backgroundColor: COLORS.background },
    header:      { padding: 20, paddingTop: 40, backgroundColor: COLORS.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    list:        { padding: 20 },
    empty:       { alignItems: 'center', marginTop: 50 },
    emptyText:   { color: '#666' },
});
