import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SuscripcionScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <MaterialCommunityIcons name="star-circle-outline" size={72} color="#F59E0B" />
                <Text style={styles.title}>Subscripcion</Text>
                <Text style={styles.subtitle}>Próximamente disponible</Text>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.btnText}>← Volver al inicio</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A2E', marginTop: 16, marginBottom: 8 },
    subtitle: { fontSize: 15, color: '#5b5b5b', marginBottom: 40 },
    btn: { backgroundColor: '#2456ee', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 10 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
