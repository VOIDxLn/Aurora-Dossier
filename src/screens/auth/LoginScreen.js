import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { useState } from 'react';

import Logo      from '../../components/Logo';
import Icons     from '../../components/Icons';
import TextInputs from './components/TextInputs';

import { authService }    from '../../services/authService';
import { empleadoService } from '../../services/empleadoService';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';

export default function LoginScreen({ navigation }) {
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const { data, error } = await authService.login(email, password);
            if (error) {
                Alert.alert('Error', 'Correo o contraseña incorrectos.');
                return;
            }

            const empleado = await empleadoService.resolveByAuth(data.user.id, data.user.email);
            if (empleado && !empleado.activo) {
                await authService.logout();
                Alert.alert('Cuenta inactiva', 'Tu cuenta aún no ha sido activada. Contacta al administrador.');
                return;
            }

            navigation.navigate(ROUTES.HOME);
        } catch {
            Alert.alert('Error', 'Algo salió mal. Inténtalo de nuevo.');
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Logo width={80} height={80} />

            <Text style={styles.heading}>Iniciar Sesión</Text>

            <TextInputs
                placeholder="Correo electronico"
                value={email}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={setEmail}
            />
            <TextInputs
                security
                placeholder="Contraseña"
                autoCorrect={false}
                value={password}
                autoCapitalize="none"
                onChangeText={setPassword}
            />

            <View style={styles.forgotRow}>
                <Text style={styles.link}>Olvidaste tu contraseña?</Text>
            </View>

            <Pressable
                onPress={handleLogin}
                style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            >
                <Text style={styles.btnText}>Ingresar</Text>
            </Pressable>

            <View style={styles.registerRow}>
                <Text style={styles.text}>No tienes cuenta?</Text>
                <Text style={styles.link} onPress={() => navigation.navigate(ROUTES.REGISTER)}>
                    Registrate
                </Text>
            </View>

            <Text style={[styles.text, { fontWeight: '300', fontSize: 14 }]}>Continua con</Text>
            <View style={styles.socialRow}>
                <Icons name="google" size={32} color={COLORS.textLight} />
                <Icons name="email"  size={32} color={COLORS.textLight} />
                <Icons name="apple"  size={32} color={COLORS.textLight} />
            </View>

            <StatusBar style="auto" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:   { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
    heading:     { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, marginTop: 20, marginBottom: 50 },
    forgotRow:   { width: '80%', alignItems: 'flex-end' },
    btn:         { backgroundColor: COLORS.primary, padding: 12, width: '80%', borderRadius: 8, alignItems: 'center', marginTop: 10 },
    btnPressed:  { backgroundColor: COLORS.primaryMuted },
    btnText:     { color: COLORS.background, fontWeight: 'bold', fontSize: 20 },
    registerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 50 },
    socialRow:   { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 35 },
    link:        { color: COLORS.primary, fontSize: 16, marginTop: 5 },
    text:        { color: COLORS.textLight, fontSize: 16, marginTop: 5, paddingRight: 5 },
});
