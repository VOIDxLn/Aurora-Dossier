import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';

export default function ConfiguracionScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <MaterialCommunityIcons name="cog-outline" size={72} color={COLORS.textLight} />
                <Text style={styles.title}>Configuracion</Text>
                <Text style={styles.subtitle}>Próximamente disponible</Text>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate(ROUTES.HOME)}>
                    <Text style={styles.btnText}>← Volver al inicio</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea:  { flex: 1, backgroundColor: COLORS.background },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
    title:     { fontSize: 24, fontWeight: 'bold', color: COLORS.textDark, marginTop: 16, marginBottom: 8 },
    subtitle:  { fontSize: 15, color: COLORS.textLight, marginBottom: 40 },
    btn:       { backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 10 },
    btnText:   { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
