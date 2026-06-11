import {
    View, Text, TextInput, StyleSheet,
    ScrollView, TouchableOpacity, Alert, ActivityIndicator,
    Pressable, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Logo from '../../components/Logo';
import DrawerMenu from '../../components/DrawerMenu';
import NoAccess from '../../components/NoAccess';
import { authService }    from '../../services/authService';
import { profileService } from '../../services/profileService';
import { userService }    from '../../services/userService';
import { useUser } from '../../context/UserContext';

const ROLES = [
    { label: 'Empleado',   value: 'empleado',   icon: 'account-outline' },
    { label: 'Supervisor', value: 'supervisor', icon: 'shield-account-outline' },
    { label: 'Admin',       value: 'admin',      icon: 'star-outline' },
];

export default function CrearUsuario({ navigation }) {
    const { userData, loading: userLoading } = useUser();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [loading, setLoading]             = useState(false);

    // Campos del formulario
    const [nombre,       setNombre]       = useState('');
    const [email,        setEmail]        = useState('');
    const [cargo,        setCargo]        = useState('');
    const [departamento, setDepartamento] = useState('');
    const [rol,          setRol]          = useState('empleado');
    const [password,     setPassword]     = useState('');

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
            // 1. Obtener empresa_id del admin logueado (CRITICO para el flujo)
            const { data: { user: adminUser } } = await authService.getUser();
            const { data: perfil } = await userService.fetchProfileByUid(adminUser.id);

            if (!perfil?.empresa_id) {
                throw new Error("No pudimos vincular al usuario con tu empresa. Verifica tu perfil de administrador.");
            }

            // 2. Crear cuenta en Supabase Auth
            const { data: authData, error: authError } = await authService.signUpNoSession(
                email.trim().toLowerCase(),
                password
            );

            if (authError) {
                if (authError.message.includes('already registered')) {
                    throw new Error("Este correo ya está registrado en el sistema.");
                }
                throw authError;
            }

            // 3. Guardar en la tabla 'empleados'
            const { error: empError } = await userService.createEmpleado({
                empresa_id:   perfil.empresa_id,
                auth_uid:     authData.user?.id ?? null,
                email:        email.trim().toLowerCase(),
                nombre:       nombre.trim(),
                cargo:        cargo.trim(),
                departamento: departamento.trim(),
                rol,
                activo:       false, // Se mantiene false por seguridad como pediste
            });

            if (empError) throw empError;

            // Crear perfil para que la FK de informes se cumpla
            if (authData.user?.id) {
                await profileService.ensureProfile(authData.user.id, perfil.empresa_id, rol, email.trim().toLowerCase());
            }

            Alert.alert(
                '¡Usuario creado!',
                `Se ha registrado a ${nombre}.\n\nComo medida de seguridad, la cuenta está INACTIVA. Actívala en "Gestión de usuarios" para que pueda ingresar.`,
                [{ text: 'Entendido', onPress: () => navigation.goBack() }]
            );
        } catch (e) {
            Alert.alert('Error', e.message);
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
                        <MaterialCommunityIcons name="menu" size={38} color="#5b5b5b" />
                    </TouchableOpacity>
                    <View style={styles.logoWrapper}>
                        <Logo width={36} height={36} />
                    </View>
                </View>

                {/* Título */}
                <Text style={styles.pageTitle}>Nuevo Miembro</Text>
                <Text style={styles.pageSubtitle}>
                    Completa los datos para integrar un nuevo usuario a tu equipo.
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
                        placeholder="correo@empresa.com"
                    />

                    {/* Selector de Rol Rediseñado */}
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.fieldLabel}>Asignar Rol</Text>
                        <View style={styles.roleContainer}>
                            {ROLES.map((r) => (
                                <RoleChip
                                    key={r.value}
                                    label={r.label}
                                    icon={r.icon}
                                    selected={rol === r.value}
                                    onPress={() => setRol(r.value)}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Field
                                label="Cargo"
                                value={cargo}
                                onChangeText={setCargo}
                                icon="briefcase-outline"
                                placeholder="Ej. Analista"
                            />
                        </View>
                        <View style={{ width: 15 }} />
                        <View style={{ flex: 1 }}>
                            <Field
                                label="Departamento"
                                value={departamento}
                                onChangeText={setDepartamento}
                                icon="domain"
                                placeholder="Ej. Ventas"
                            />
                        </View>
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

                {/* Info seguridad */}
                <View style={styles.securityNote}>
                    <MaterialCommunityIcons name="shield-check-outline" size={18} color="#16a34a" />
                    <Text style={styles.securityText}>
                        Por seguridad, el perfil se creará como <Text style={{fontWeight: '700'}}>Inactivo</Text>. Deberás activarlo manualmente.
                    </Text>
                </View>

                {/* Botón */}
                <TouchableOpacity
                    style={[styles.createBtn, loading && { opacity: 0.7 }]}
                    onPress={handleCrear}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="check-circle-outline" size={20} color="#fff" />
                            <Text style={styles.createBtnText}>Crear Usuario</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ─── Componentes Internos ─── */

function RoleChip({ label, icon, selected, onPress }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
        onPress();
    };

    return (
        <Pressable onPress={handlePress} style={{ flex: 1 }}>
            <Animated.View style={[
                styles.roleChip,
                selected && styles.roleChipSelected,
                { transform: [{ scale }] }
            ]}>
                <MaterialCommunityIcons
                    name={icon}
                    size={20}
                    color={selected ? '#fff' : '#5b5b5b'}
                />
                <Text style={[styles.roleChipText, selected && styles.roleChipTextSelected]}>
                    {label}
                </Text>
            </Animated.View>
        </Pressable>
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

/* ─── Estilos ─── */
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
    scroll: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 40 },

    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
    },
    logoWrapper: {
        width: 44, height: 44, borderRadius: 22, overflow: 'hidden',
        borderWidth: 2, borderColor: '#2456ee',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
    },

    pageTitle:    { fontSize: 28, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 4 },
    pageSubtitle: { fontSize: 14, color: '#5b5b5b', marginBottom: 28, lineHeight: 20 },

    form: {},
    row: { flexDirection: 'row', alignItems: 'center' },
    fieldWrapper: { marginBottom: 20 },
    fieldLabel:   { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
    inputBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12, borderWidth: 1.5, borderColor: '#E5E7EB',
        paddingHorizontal: 14, height: 54,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
    },
    fieldIcon:  { marginRight: 10 },
    fieldInput: { flex: 1, fontSize: 15, color: '#1A1A2E' },

    /* Selector de Rol */
    roleContainer: { flexDirection: 'row', gap: 10, marginTop: 2 },
    roleChip: {
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#E5E7EB',
        paddingVertical: 12, gap: 4,
    },
    roleChipSelected: {
        backgroundColor: '#2456ee', borderColor: '#2456ee',
        shadowColor: '#2456ee', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 6, elevation: 5,
    },
    roleChipText: { fontSize: 11, color: '#5b5b5b', fontWeight: '500' },
    roleChipTextSelected: { color: '#fff', fontWeight: 'bold' },

    securityNote: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#F0FDF4', borderRadius: 10,
        padding: 14, marginBottom: 24, borderWidth: 1, borderColor: '#DCFCE7',
    },
    securityText: { flex: 1, fontSize: 12, color: '#166534', lineHeight: 18 },

    createBtn: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 10,
        backgroundColor: '#2456ee',
        borderRadius: 12, paddingVertical: 16,
        shadowColor: '#2456ee', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25, shadowRadius: 8, elevation: 6,
    },
    createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

