import {
    View, Text, TextInput, StyleSheet, SafeAreaView,
    ScrollView, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Logo from '../../components/Logo';
import DrawerMenu from '../../components/DrawerMenu';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import { useUser } from '../../context/UserContext';

/* ─── Pantalla de edición (Admin y Empleado) ─── */
export default function EditarDatos({ navigation }) {
    const { userData, refreshUser } = useUser();
    const isAdmin = userData?.tipo === 'admin';

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [loading, setLoading]             = useState(true);
    const [saving, setSaving]               = useState(false);

    // ── Campos Admin ──────────────────────────────────────
    const [nit,       setNit]       = useState('');
    const [nombre,    setNombre]    = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [correo,    setCorreo]    = useState('');

    // ── Campos Empleado ───────────────────────────────────
    const [nombreEmp, setNombreEmp] = useState('');
    const [emailEmp,  setEmailEmp]  = useState('');   // solo lectura

    // ── Campo compartido ──────────────────────────────────
    const [password, setPassword] = useState('');

    useEffect(() => { loadData(); }, []);

    /* ── Carga de datos ─────────────────────────────────── */
    const loadData = async () => {
        try {
            if (isAdmin) {
                await loadAdminData();
            } else {
                await loadEmpleadoData();
            }
        } catch {
            Alert.alert('Error', 'No se pudo cargar la información');
        } finally {
            setLoading(false);
        }
    };

    const loadAdminData = async () => {
        const { data: { user } } = await authService.getUser();
        const result = await userService.fetchAdminProfileAndEmpresa(user.id);
        if (!result) return;
        const { empresa } = result;

        if (empresaError) throw empresaError;

        setNit(String(empresa.nit ?? ''));
        setNombre(empresa.razon_social ?? '');
        setDomicilio(empresa.domicilio_fiscal ?? '');
        setCorreo(empresa.correo ?? '');
    };

    const loadEmpleadoData = async () => {
        // Usar los datos ya disponibles en el contexto — evita re-fetch innecesario
        setNombreEmp(userData?.nombre ?? '');
        setEmailEmp(userData?.email ?? '');
    };

    /* ── Validaciones ───────────────────────────────────── */
    const validate = () => {
        if (isAdmin) {
            if (!nombre.trim()) {
                Alert.alert('Campo requerido', 'El nombre / razón social no puede estar vacío.');
                return false;
            }
            if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido.');
                return false;
            }
        } else {
            if (!nombreEmp.trim()) {
                Alert.alert('Campo requerido', 'El nombre no puede estar vacío.');
                return false;
            }
        }

        if (password.length > 0 && password.length < 6) {
            Alert.alert('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
            return false;
        }

        return true;
    };

    /* ── Guardado ───────────────────────────────────────── */
    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            if (isAdmin) {
                await saveAdminData();
            } else {
                await saveEmpleadoData();
            }

            // Actualizar contraseña si se proporcionó
            if (password.length > 0) {
                const { error: passError } = await authService.updatePassword(password);
                if (passError) throw passError;
            }

            // Refrescar el contexto global para que el saludo en Home se actualice
            await refreshUser();

            Alert.alert('✅ Éxito', 'Datos actualizados correctamente.');
            setPassword('');
        } catch (e) {
            Alert.alert('Error', e.message ?? 'No se pudo guardar. Intenta de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    const saveAdminData = async () => {
        const { data: { user } } = await authService.getUser();
        const { data: perfil } = await userService.fetchProfileByUid(user.id);

        const { error } = await userService.updateEmpresaData(perfil.empresa_id, {
            razon_social:     nombre.trim(),
            domicilio_fiscal: domicilio.trim(),
            correo:           correo.trim(),
        });

        if (error) throw error;
    };

    const saveEmpleadoData = async () => {
        if (!userData?.id) throw new Error('No se encontró el registro del empleado.');

        const { error } = await userService.updateEmpleado(userData.id, { nombre: nombreEmp.trim() });

        if (error) throw error;
    };

    /* ── Loading inicial ────────────────────────────────── */
    if (loading) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.centered]}>
                <ActivityIndicator size="large" color="#2456ee" />
            </SafeAreaView>
        );
    }

    /* ── Render principal ───────────────────────────────── */
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

                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <MaterialCommunityIcons name="account-circle" size={100} color="#2456ee" />
                    <Text style={styles.avatarTitle}>
                        {isAdmin ? 'Datos de empresa' : 'Mis datos personales'}
                    </Text>
                </View>

                {/* Formulario Admin */}
                {isAdmin && (
                    <View style={styles.form}>
                        {/* NIT — solo lectura */}
                        <View style={styles.fieldWrapper}>
                            <Text style={styles.fieldLabel}>NIT</Text>
                            <View style={styles.fieldRow}>
                                <Text style={styles.readOnlyValue}>{nit}</Text>
                                <MaterialCommunityIcons name="lock-outline" size={16} color="#D1D5DB" />
                            </View>
                        </View>

                        <Field label="Nombre / Razón social" value={nombre}    onChangeText={setNombre} />
                        <Field label="Domicilio fiscal"       value={domicilio} onChangeText={setDomicilio} />
                        <Field label="Correo"                 value={correo}    onChangeText={setCorreo} keyboardType="email-address" />
                        <Field
                            label="Nueva contraseña"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholder="Dejar vacío para no cambiar"
                        />
                    </View>
                )}

                {/* Formulario Empleado */}
                {!isAdmin && (
                    <View style={styles.form}>
                        <Field
                            label="Nombre"
                            value={nombreEmp}
                            onChangeText={setNombreEmp}
                            placeholder="Tu nombre"
                        />

                        {/* Email — solo lectura (correo laboral asignado) */}
                        <View style={styles.fieldWrapper}>
                            <Text style={styles.fieldLabel}>Correo laboral</Text>
                            <View style={styles.fieldRow}>
                                <Text style={styles.readOnlyValue}>{emailEmp}</Text>
                                <MaterialCommunityIcons name="lock-outline" size={16} color="#D1D5DB" />
                            </View>
                            <Text style={styles.fieldHint}>El correo es asignado por la empresa.</Text>
                        </View>

                        <Field
                            label="Nueva contraseña"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholder="Dejar vacío para no cambiar"
                        />
                    </View>
                )}

                {/* Botón guardar */}
                <TouchableOpacity
                    style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                    activeOpacity={0.8}
                >
                    {saving
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.saveBtnText}>Guardar cambios</Text>
                    }
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ─── Componente de campo reutilizable ─── */
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

/* ─── Estilos (sin cambios visuales respecto al original) ─── */
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
    avatarTitle: {
        fontSize: 14,
        color: '#5b5b5b',
        marginTop: 8,
        fontWeight: '500',
    },

    form: {},
    fieldWrapper: { marginBottom: 22 },
    fieldLabel: { fontSize: 12, color: '#5b5b5b', marginBottom: 6 },
    fieldHint:  { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#D1D5DB',
        paddingBottom: 8,
    },
    readOnlyValue: { flex: 1, fontSize: 16, color: '#9CA3AF' },
    fieldInput:    { flex: 1, fontSize: 16, color: '#1A1A2E', paddingVertical: 2 },

    saveBtn: {
        backgroundColor: '#2456ee',
        borderRadius: 8,
        paddingVertical: 14,
        width: '60%',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 32,
    },
    saveBtnDisabled: { backgroundColor: '#6cb1ff' },
    saveBtnText:     { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
