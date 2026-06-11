import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NoAccess({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <MaterialCommunityIcons name="lock-outline" size={72} color="#D1D5DB" />
                <Text style={styles.title}>Acceso restringido</Text>
                <Text style={styles.subtitle}>
                    No tienes acceso a esta función.{'\n'}Contacta al administrador.
                </Text>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
                    <Text style={styles.btnText}>← Volver</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea:  { flex: 1, backgroundColor: '#f3f4f6' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
    title:     { fontSize: 20, fontWeight: 'bold', color: '#374151', marginTop: 20, marginBottom: 8 },
    subtitle:  { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    btn:       { backgroundColor: '#2456ee', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 10 },
    btnText:   { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
