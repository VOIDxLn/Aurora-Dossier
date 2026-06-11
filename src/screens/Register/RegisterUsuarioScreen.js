import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';

import { authService }    from '../../services/authService';
import { empresaService } from '../../services/empresaService';
import { profileService } from '../../services/profileService';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';

import Logo       from '../../components/Logo';
import TextInputs from '../auth/components/TextInputs';

export default function RegisterUsuarioScreen({ navigation, route }) {
    const { nit, razonSocial, domicilio } = route.params || {};

    const [correo,     setCorreo]     = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmar,  setConfirmar]  = useState('');
    const [cargando,   setCargando]   = useState(false);

    const handleRegistro = async () => {
        if (!correo || !contrasena || !confirmar) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }
        if (contrasena !== confirmar) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }
        if (contrasena.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener mínimo 6 caracteres');
            return;
        }

        setCargando(true);
        try {
            const { data: authData, error: authError } = await authService.signUp(correo, contrasena);
            if (authError) throw authError;

            const { data: empresa, error: empresaError } = await empresaService.create(nit, razonSocial, domicilio, correo);
            if (empresaError) throw empresaError;

            const { error: perfilError } = await profileService.linkEmpresaToUser(authData.user.id, empresa.id, 'admin');
            if (perfilError) throw perfilError;

            Alert.alert(
                '¡Registro exitoso!',
                'Tu cuenta ha sido creada. Ya puedes iniciar sesión.',
                [{ text: 'OK', onPress: () => navigation.navigate(ROUTES.LOGIN) }]
            );
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Logo width={80} height={80} />
            <Text style={styles.titulo}>Crear cuenta</Text>

            <TextInputs placeholder="Correo electrónico" keyboardType="email-address" value={correo}     onChangeText={setCorreo}     autoCapitalize="none" autoCorrect={false} />
            <TextInputs placeholder="Contraseña"                                      value={contrasena} onChangeText={setContrasena} security autoCorrect={false} autoCapitalize="none" />
            <TextInputs placeholder="Confirmar contraseña"                            value={confirmar}  onChangeText={setConfirmar}  security autoCorrect={false} autoCapitalize="none" />

            <Pressable
                style={({ pressed }) => [styles.boton, pressed && styles.botonPressed, cargando && styles.botonDisabled]}
                onPress={handleRegistro}
                disabled={cargando}
            >
                <Text style={styles.botonTexto}>{cargando ? 'Registrando...' : 'Registrarse'}</Text>
            </Pressable>

            <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                <Text style={styles.link}>← Volver</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:     { flexGrow: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', marginBottom: 70 },
    titulo:        { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, marginTop: 20, marginBottom: 60 },
    boton:         { width: '80%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 60, backgroundColor: COLORS.primary },
    botonPressed:  { backgroundColor: COLORS.primaryMuted },
    botonDisabled: { backgroundColor: COLORS.textMuted },
    botonTexto:    { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    link:          { color: COLORS.primary, fontSize: 16, marginTop: 5 },
});
