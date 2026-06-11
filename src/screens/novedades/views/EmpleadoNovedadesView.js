import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import NovedadCard from '../components/NovedadCard';

export default function EmpleadoNovedadesView({ listaPendientes, listaCompletadas, onMarcarVisto, navigation }) {
    const [tabActivo, setTabActivo] = useState('pendientes');
    const listaActual = tabActivo === 'pendientes' ? listaPendientes : listaCompletadas;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.header, { justifyContent: 'flex-start', gap: 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color={COLORS.textLight} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Novedades</Text>
            </View>

            <View style={styles.tabs}>
                {['pendientes', 'completadas'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, tabActivo === tab && styles.tabActivo]}
                        onPress={() => setTabActivo(tab)}
                    >
                        <Text style={tabActivo === tab ? styles.tabTextoActivo : styles.tabTexto}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={listaActual}
                contentContainerStyle={styles.list}
                keyExtractor={item => item.id?.toString()}
                ListEmptyComponent={() => (
                    <View style={styles.empty}>
                        {tabActivo === 'pendientes' ? (
                            <>
                                <MaterialCommunityIcons name="check-all" size={72} color={COLORS.success} />
                                <Text style={styles.emptyText}>¡Todo al día! No tienes pendientes</Text>
                            </>
                        ) : (
                            <>
                                <MaterialCommunityIcons name="clipboard-check-outline" size={72} color={COLORS.textMuted} />
                                <Text style={styles.emptyText}>Aún no has completado ninguna</Text>
                            </>
                        )}
                    </View>
                )}
                renderItem={({ item }) => (
                    <NovedadCard
                        item={item}
                        isAdmin={false}
                        tabActivo={tabActivo}
                        onMarcarVisto={onMarcarVisto}
                    />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea:       { flex: 1, backgroundColor: COLORS.background },
    header:         { padding: 20, paddingTop: 40, backgroundColor: COLORS.surface, flexDirection: 'row', alignItems: 'center' },
    headerTitle:    { fontSize: 22, fontWeight: 'bold' },
    tabs:           { flexDirection: 'row', backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    tab:            { flex: 1, paddingVertical: 14, alignItems: 'center' },
    tabActivo:      { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
    tabTexto:       { fontSize: 14, color: COLORS.textLight },
    tabTextoActivo: { fontSize: 14, color: COLORS.primary, fontWeight: 'bold' },
    list:           { padding: 20 },
    empty:          { alignItems: 'center', marginTop: 50, gap: 12 },
    emptyText:      { color: '#666' },
});
