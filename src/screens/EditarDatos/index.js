import {
    View, Text, TextInput, StyleSheet, SafeAreaView,
    ScrollView, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Logo from '../../components/Logo';
import DrawerMenu from '../../components/DrawerMenu';
import { supabase } from '../../lib/supabase';

export default function EditarDatos({ navigation }) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [loading, setLoading]             = useState(true);
    const [saving, setSaving]               = useState(false);

    const [nit,       setNit]       = useState('');
    const [nombre,    setNombre]    = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [correo,    setCorreo]    = useState('');
    const [password,  setPassword]  = useState('');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: perfil } = await supabase
                .from('profiles')
                .select('empresa_id')
                .eq('id', user.id)
                .single();
            const { data: empresa } = await supabase
                .from('empresas')
                .select('*')
                .eq('id', perfil.empresa_id)
                .single();

            setNit(String(empresa.nit ?? ''));
            setNombre(empresa.razon_social ?? '');
            setDomicilio(empresa.domicilio_fiscal ?? '');
            setCorreo(empresa.correo ?? '');
        } catch {
            Alert.alert('Error', 'No se pudo cargar la información');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: perfil } = await supabase
                .from('profiles')
                .select('empresa_id')
                .eq('id', user.id)
                .single();

            const { error: empError } = await supabase
                .from('empresas')
                .update({ razon_social: nombre, domicilio_fiscal: domicilio, correo })
                .eq('id', perfil.empresa_id);

            if (empError) throw empError;

            if (password.length > 0) {
                if (password.length < 6) throw new Error('La contraseña debe tener mínimo 6 caracteres');
                const { error: passError } = await supabase.auth.updateUser({ password });
                if (passError) throw passError;
            }

            Alert.alert('Éxito', 'Datos actualizados correctamente');
            setPassword('');
        } catch (e) {
            Alert.alert('Error', e.message ?? 'No se pudo guardar');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.centered]}>
                <ActivityIndicator size="large" color="#2456ee" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <DrawerMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                navigation={navigation}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                        <MaterialCommunityIcons name="menu" size={40} color="#5b5b5b" />
                    </TouchableOpacity>
                    <View style={styles.logoWrapper}>
                        <Logo width={38} height={38} />
                    </View>
                </View>

                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <MaterialCommunityIcons name="account-circle" size={100} color="#2456ee" />
                </View>

                {/* Formulario */}
                <View style={styles.form}>
                    {/* NIT — solo lectura */}
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.fieldLabel}>Nit</Text>
                        <View style={styles.fieldRow}>
                            <Text style={styles.readOnlyValue}>{nit}</Text>
                        </View>
                    </View>

                    <Field label="Nombre"          value={nombre}    onChangeText={setNombre} />
                    <Field label="Domicilio fiscal" value={domicilio} onChangeText={setDomicilio} />
                    <Field label="Correo"           value={correo}    onChangeText={setCorreo}    keyboardType="email-address" />
                    <Field
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="Nueva contraseña"
                    />
                </View>

                {/* Botón guardar */}
                <TouchableOpacity
                    style={[styles.saveBtn, saving && { backgroundColor: '#6cb1ff' }]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.saveBtnText}>Guardar</Text>
                    }
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

function Field({ label, value, onChangeText, secureTextEntry, keyboardType, placeholder }) {
    return (
        <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.fieldRow}>
                <TextInput
                    style={styles.fieldInput}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType ?? 'default'}
                    autoCapitalize="none"
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                />
                <MaterialCommunityIcons name="pencil-outline" size={18} color="#2456ee" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
    centered: { justifyContent: 'center', alignItems: 'center' },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoWrapper: {
        width: 46, height: 46, borderRadius: 23,
        overflow: 'hidden', borderWidth: 2, borderColor: '#2456ee',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
    },

    avatarSection: { alignItems: 'center', marginBottom: 28 },

    form: {},
    fieldWrapper: { marginBottom: 22 },
    fieldLabel: { fontSize: 12, color: '#5b5b5b', marginBottom: 6 },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#D1D5DB',
        paddingBottom: 8,
    },
    readOnlyValue: { flex: 1, fontSize: 16, color: '#9CA3AF' },
    fieldInput: { flex: 1, fontSize: 16, color: '#1A1A2E', paddingVertical: 2 },

    saveBtn: {
        backgroundColor: '#2456ee',
        borderRadius: 8,
        paddingVertical: 14,
        width: '60%',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 32,
    },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
