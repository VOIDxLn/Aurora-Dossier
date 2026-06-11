import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { ROL_STYLE } from '../../../constants/permissions';

export default function EmpleadoCard({ item, onToggleActivo, onEliminar, onGestionarPermisos }) {
    const rolStyle = ROL_STYLE[item.rol] ?? ROL_STYLE.empleado;

    return (
        <View style={styles.card}>
            <View style={styles.avatar}>
                <MaterialCommunityIcons name="account-circle" size={50} color={COLORS.primary} />
            </View>

            <View style={styles.body}>
                <Text style={styles.name}     numberOfLines={1}>{item.nombre}</Text>
                <Text style={styles.email}    numberOfLines={1}>{item.email}</Text>
                <Text style={styles.meta}     numberOfLines={1}>
                    {item.cargo}{item.departamento ? ` · ${item.departamento}` : ''}
                </Text>

                <View style={styles.badges}>
                    <View style={[styles.rolBadge, { backgroundColor: rolStyle.bg }]}>
                        <Text style={[styles.rolText, { color: rolStyle.color }]}>{item.rol}</Text>
                    </View>
                    {!item.activo && (
                        <View style={styles.pendienteBadge}>
                            <Text style={styles.pendienteText}>pendiente</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.permisosLink} onPress={() => onGestionarPermisos(item)}>
                    <MaterialCommunityIcons name="shield-edit-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.permisosLinkText}>Gestionar permisos</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.actions}>
                <Switch
                    value={item.activo}
                    onValueChange={() => onToggleActivo(item)}
                    trackColor={{ false: COLORS.border, true: COLORS.primaryMuted }}
                    thumbColor={item.activo ? COLORS.primary : COLORS.textMuted}
                    style={styles.switch}
                />
                <TouchableOpacity style={styles.deleteBtn} onPress={() => onEliminar(item)}>
                    <MaterialCommunityIcons name="trash-can-outline" size={22} color={COLORS.danger} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.surface, borderRadius: 14,
        borderWidth: 1.5, borderColor: COLORS.border,
        padding: 14, marginBottom: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
    },
    avatar:  { marginRight: 12 },
    body:    { flex: 1, minWidth: 0 },
    name:    { fontSize: 15, fontWeight: 'bold', color: COLORS.textDark },
    email:   { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
    meta:    { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

    badges:        { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
    rolBadge:      { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
    rolText:       { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
    pendienteBadge:{ borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: COLORS.warningMuted },
    pendienteText: { fontSize: 11, fontWeight: '600', color: '#D97706' },

    permisosLink:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
    permisosLinkText: { fontSize: 12, color: COLORS.primary, fontWeight: '500' },

    actions:   { alignItems: 'center', gap: 6, marginLeft: 8 },
    switch:    { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] },
    deleteBtn: { padding: 4 },
});
