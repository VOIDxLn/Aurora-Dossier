import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

import Logo       from '../../components/Logo';
import TextInputs from '../auth/components/TextInputs';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';

export default function RegisterEmpresaScreen({ navigation }) {
    const [nit,         setNit]         = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [domicilio,   setDomicilio]   = useState('');

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Logo width={80} height={80} />
            <Text style={styles.titulo}>Crear cuenta</Text>

            <TextInputs placeholder="Nit"            autoCapitalize="none" value={nit}         onChangeText={setNit}         />
            <TextInputs placeholder="Razon social"   autoCapitalize="none" value={razonSocial} onChangeText={setRazonSocial} />
            <TextInputs placeholder="Domicilio fiscal" autoCapitalize="none" value={domicilio}   onChangeText={setDomicilio}   />

            <Pressable
                style={({ pressed }) => [styles.boton, pressed && styles.botonPressed]}
                onPress={() => navigation.navigate(ROUTES.REGISTER_USUARIO, { nit, razonSocial, domicilio })}
            >
                <Text style={styles.botonTexto}>Continuar</Text>
            </Pressable>

            <View style={styles.loginRow}>
                <Text style={styles.text}>Ya tienes cuenta?</Text>
                <Text style={styles.link} onPress={() => navigation.goBack()}>Inicia sesión</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:    { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', marginBottom: 70 },
    titulo:       { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, marginTop: 20, marginBottom: 60 },
    boton:        { width: '80%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 80, backgroundColor: COLORS.primary },
    botonPressed: { backgroundColor: COLORS.primaryMuted },
    botonTexto:   { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    loginRow:     { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
    link:         { color: COLORS.primary, fontSize: 16, marginTop: 5 },
    text:         { color: COLORS.textLight, fontSize: 16, marginTop: 5, paddingRight: 5 },
});
