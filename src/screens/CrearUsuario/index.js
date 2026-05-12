import {
    View, Text, TextInput, StyleSheet, SafeAreaView,
    ScrollView, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

import Logo from '../../components/Logo';
import DrawerMenu from '../../components/DrawerMenu';
import NoAccess from '../../components/NoAccess';
import { supabase } from '../../lib/supabase';
import { supabaseNoSession } from '../../lib/supabaseNoSession';
import { useUser } from '../../context/UserContext';

const ROLES = [
    { label: 'Empleado',       value: 'empleado'    },
    { label: 'Supervisor',     value: 'supervisor'  },
    { label: 'Administrador',  value: 'admin'       },
];

export default function CrearUsuario({ navigation }) {
    const { userData, loading: userLoading } = useUser();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [loading, setLoading]             = useState(false);

    if (userLoading || !userData) {
        return (
            <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#2456ee" />
            </SafeAreaView>
        );
    }

    if (userData.tipo !== 'admin' && !userData.permisos?.crear_usuarios) {
        return <NoAccess navigation={navigation} />;
    }

    const [nombre,       setNombre]       = useState('');
    const [email,        setEmail]        = useState('');
    const [cargo,        setCargo]        = useState('');
    const [departamento, setDepartamento] = useState('');
    const [rol,          setRol]          = useState('empleado');
    const [password,     setPassword]     = useState('');

    const handleCrear = async () => {
        if (!nombre.trim() || !email.trim() || !cargo.trim() || !departamento.trim() || !password) {
            Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Contraseña muy corta', 'Debe tener mínimo 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            // Crear cuenta en Supabase Auth sin afectar la sesión del admin
            const { data: authData, error: authError } = await supabaseNoSession.auth.signUp({
                email: email.trim().toLowerCase(),
                password,
            });
            if (authError) throw authError;

            // Obtener empresa_id del admin logueado
            const { data: { user: adminUser } } = await supabase.auth.getUser();
            const { data: perfil, error: perfilError } = await supabase
                .from('profiles')
                .select('empresa_id')
                .eq('id', adminUser.id)
                .single();
            if (perfilError) throw perfilError;

            // Guardar registro completo del empleado
            const { error: empError } = await supabase.from('empleados').insert([{
                empresa_id:   perfil.empresa_id,
                auth_uid:     authData.user?.id ?? null,
                email:        email.trim().toLowerCase(),
                nombre:       nombre.trim(),
                cargo:        cargo.trim(),
                departamento: departamento.trim(),
                rol,
                activo:       false,
            }]);
            if (empError) throw empError;

            Alert.alert(
                'Usuario creado',
                `Se envió un correo de verificación a:\n${email}\n\nEl usuario debe confirmar su cuenta. Luego actívalo desde "Gestión de usuarios".`,
                [{ text: 'Listo', onPress: () => navigation.goBack() }]
            );
        } catch (e) {
            Alert.alert('Error al crear usuario', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <DrawerMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                navigation={navigation}
            />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
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

                {/* Título */}
                <Text style={styles.pageTitle}>Crear usuario</Text>
                <Text style={styles.pageSubtitle}>
                    El usuario recibirá un correo para activar su cuenta.
                </Text>

                {/* Formulario */}
                <View style={styles.form}>
                    <Field
                        label="Nombre completo"
                        value={nombre}
                        onChangeText={setNombre}
                        icon="account-outline"
                        placeholder="Ej. Juan Pérez"
                    />
                    <Field
                        label="Correo electrónico"
                        value={email}
                        onChangeText={setEmail}
                        icon="email-outline"
                        keyboardType="email-address"
                        placeholder="usuario@empresa.com"
                    />
                    <Field
                        label="Cargo"
                        value={cargo}
                        onChangeText={setCargo}
                        icon="briefcase-outline"
                        placeholder="Ej. Analista"
                    />
                    <Field
                        label="Departamento"
                        value={departamento}
                        onChangeText={setDepartamento}
                        icon="domain"
                        placeholder="Ej. Contabilidad"
                    />

                    {/* Rol */}
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.fieldLabel}>Rol</Text>
                        <View style={styles.inputBox}>
                            <MaterialCommunityIcons
                                name="shield-account-outline"
                                size={20}
                                color="#2456ee"
                                style={styles.fieldIcon}
                            />
                            <RNPickerSelect
                                value={rol}
                                onValueChange={setRol}
                                items={ROLES}
                                placeholder={{ label: 'Seleccionar rol...', value: null }}
                                style={pickerStyles}
                                useNativeAndroidPickerStyle={false}
                            />
                            <MaterialCommunityIcons name="chevron-down" size={20} color="#9CA3AF" />
                        </View>
                    </View>

                    {/* Info contraseña */}
                    <View style={styles.infoBox}>
                        <MaterialCommunityIcons name="information-outline" size={16} color="#2456ee" />
                        <Text style={styles.infoText}>
                            Asigna una contraseña temporal. El usuario podrá cambiarla después de activar su cuenta.
                        </Text>
                    </View>

                    <Field
                        label="Contraseña temporal"
                        value={password}
                        onChangeText={setPassword}
                        icon="lock-outline"
                        secureTextEntry
                        placeholder="Mínimo 6 caracteres"
                    />
                </View>

                {/* Botón */}
                <TouchableOpacity
                    style={[styles.createBtn, loading && { backgroundColor: '#6cb1ff' }]}
                    onPress={handleCrear}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="account-plus-outline" size={20} color="#fff" />
                            <Text style={styles.createBtnText}>Crear y enviar invitación</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

function Field({ label, value, onChangeText, icon, keyboardType, secureTextEntry, placeholder }) {
    return (
        <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.inputBox}>
                <MaterialCommunityIcons name={icon} size={20} color="#2456ee" style={styles.fieldIcon} />
                <TextInput
                    style={styles.fieldInput}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType ?? 'default'}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
    scroll: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 40 },

    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
    },
    logoWrapper: {
        width: 46, height: 46, borderRadius: 23, overflow: 'hidden',
        borderWidth: 2, borderColor: '#2456ee',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
    },

    pageTitle:    { fontSize: 24, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 4 },
    pageSubtitle: { fontSize: 13, color: '#5b5b5b', marginBottom: 24 },

    form: {},
    fieldWrapper: { marginBottom: 18 },
    fieldLabel:   { fontSize: 12, color: '#5b5b5b', marginBottom: 6 },
    inputBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10, borderWidth: 1.5, borderColor: '#D1D5DB',
        paddingHorizontal: 12, height: 52,
    },
    fieldIcon:  { marginRight: 8 },
    fieldInput: { flex: 1, fontSize: 15, color: '#1A1A2E' },

    infoBox: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 8,
        backgroundColor: '#EFF6FF', borderRadius: 8,
        padding: 12, marginBottom: 18,
    },
    infoText: { flex: 1, fontSize: 12, color: '#2456ee', lineHeight: 18 },

    createBtn: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        backgroundColor: '#2456ee',
        borderRadius: 10, paddingVertical: 15,
        marginTop: 8,
    },
    createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

const pickerStyles = {
    inputIOS:     { flex: 1, fontSize: 15, color: '#1A1A2E' },
    inputAndroid: { flex: 1, fontSize: 15, color: '#1A1A2E' },
};
