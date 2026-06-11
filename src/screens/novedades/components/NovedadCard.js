import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';

export default function NovedadCard({
    item,
    isAdmin       = false,
    tabActivo,
    tarjetaExpandida,
    vistasMap     = {},
    onExpandir,
    onMarcarVisto,
}) {
    const isExpanded   = tarjetaExpandida === item.id;
    const isCompletada = tabActivo === 'completadas';
    const prioridadAlta = item.prioridad === 'alta';

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{item.titulo}</Text>
                {isAdmin || !isCompletada ? (
                    <View style={[styles.badge, { backgroundColor: prioridadAlta ? COLORS.dangerMuted : COLORS.primaryLight }]}>
                        <Text style={[styles.badgeText, { color: prioridadAlta ? COLORS.danger : COLORS.primary }]}>
                            {item.prioridad?.toUpperCase()}
                        </Text>
                    </View>
                ) : (
                    <MaterialCommunityIcons name="check-circle" size={22} color={COLORS.success} />
                )}
            </View>

            <Text style={styles.desc}>{item.descripcion}</Text>

            <View style={styles.footer}>
                <Text style={styles.type}>{item.tipo === 'tarea' ? '📌 Tarea' : '🔔 Novedad'}</Text>
                <Text style={styles.date}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                </Text>
            </View>

            {isAdmin && (
                <>
                    <TouchableOpacity style={styles.expandBtn} onPress={() => onExpandir(item.id)}>
                        <MaterialCommunityIcons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={18}
                            color={COLORS.textLight}
                        />
                        <Text style={styles.expandText}>
                            {isExpanded ? 'Ocultar' : 'Ver quién completó'}
                        </Text>
                    </TouchableOpacity>

                    {isExpanded && (
                        <View style={styles.vistasContainer}>
                            {(vistasMap[item.id] ?? []).length === 0 ? (
                                <Text style={styles.vistasVacio}>Ningún empleado lo ha completado aún</Text>
                            ) : (
                                (vistasMap[item.id] ?? []).map((v, i) => (
                                    <View key={i} style={styles.vistaItem}>
                                        <MaterialCommunityIcons name="account-check" size={16} color={COLORS.success} />
                                        <Text style={styles.vistaNombre}>
                                            {v.profiles?.nombre || v.profiles?.email || 'Empleado'}
                                        </Text>
                                        <Text style={styles.vistaFecha}>
                                            {new Date(v.vista_at).toLocaleDateString()}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </View>
                    )}
                </>
            )}

            {!isAdmin && !isCompletada && (
                <TouchableOpacity style={styles.vistoBtn} onPress={() => onMarcarVisto(item.id)}>
                    <MaterialCommunityIcons name="check-circle-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.vistoBtnText}>Marcar como visto</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card:         { backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, marginBottom: 12 },
    header:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    title:        { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 8 },
    desc:         { fontSize: 14, color: '#4B5563', marginBottom: 12 },
    footer:       { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.borderLight, paddingTop: 8 },
    type:         { fontSize: 12, fontWeight: '600', color: '#6B7280' },
    date:         { fontSize: 12, color: COLORS.textMuted },
    badge:        { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
    badgeText:    { fontSize: 10, fontWeight: 'bold' },

    expandBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
    expandText: { fontSize: 12, color: COLORS.textLight },

    vistasContainer: { marginTop: 8, padding: 10, backgroundColor: COLORS.surfaceAlt, borderRadius: 8 },
    vistasVacio:     { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },
    vistaItem:       { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
    vistaNombre:     { flex: 1, fontSize: 13, color: COLORS.textMedium },
    vistaFecha:      { fontSize: 11, color: COLORS.textMuted },

    vistoBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
    vistoBtnText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
});
