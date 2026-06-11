import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { PERMISOS_CONFIG } from '../../../constants/permissions';

export default function PermisosModal({ empleado, onTogglePermiso, onClose }) {
    if (!empleado) return null;
    const perms = empleado.permisos ?? {};

    return (
        <Modal
            visible={!!empleado}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <MaterialCommunityIcons name="shield-account-outline" size={24} color={COLORS.primary} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>Permisos de acceso</Text>
                            <Text style={styles.subtitle} numberOfLines={1}>{empleado.nombre}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={22} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>

                    {PERMISOS_CONFIG.map((p, i) => (
                        <View
                            key={p.key}
                            style={[styles.row, i < PERMISOS_CONFIG.length - 1 && styles.rowBorder]}
                        >
                            <MaterialCommunityIcons name={p.icon} size={22} color={COLORS.primary} />
                            <Text style={styles.label}>{p.label}</Text>
                            <Switch
                                value={perms[p.key] ?? false}
                                onValueChange={() => onTogglePermiso(p.key)}
                                trackColor={{ false: COLORS.border, true: COLORS.primaryMuted }}
                                thumbColor={perms[p.key] ? COLORS.primary : COLORS.textMuted}
                            />
                        </View>
                    ))}

                    <Text style={styles.note}>
                        Los cambios se aplican de inmediato al próximo inicio de sesión del usuario.
                    </Text>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
    sheet: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        paddingHorizontal: 24, paddingTop: 12, paddingBottom: 36,
    },
    handle: {
        width: 40, height: 4, backgroundColor: COLORS.border,
        borderRadius: 2, alignSelf: 'center', marginBottom: 20,
    },
    header:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
    title:    { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
    subtitle: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
    row:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
    rowBorder:{ borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
    label:    { flex: 1, fontSize: 14, color: COLORS.textMedium },
    note:     { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', marginTop: 16, lineHeight: 16 },
});
