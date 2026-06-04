import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { novedadesService } from '../../lib/novedadesService';

export default function NovedadesScreen({ navigation }) {
    const [lista, setLista] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [userId, setUserId] = useState(null);

    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipo, setTipo] = useState('novedad');
    const [prioridad, setPrioridad] = useState('media');

    const [rol, setRol] = useState(null);
    const [empresaId, setEmpresaId] = useState(null);
    const [listaPendientes, setListaPendientes] = useState([]);
    const [listaCompletadas, setListaCompletadas] = useState([]);
    const [tabActivo, setTabActivo] = useState('pendientes');
    const [tarjetaExpandida, setTarjetaExpandida] = useState(null);
    const [vistasMap, setVistasMap] = useState({});

    const ID_EMPRESA_PRUEBA = '9003e627-f9ae-458f-9710-2caf607ab988';

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setCargando(false); return; }
            setUserId(user.id);

            const { data: perfil } = await supabase
                .from('profiles')
                .select('rol, empresa_id')
                .eq('id', user.id)
                .single();

            setRol(perfil.rol);
            setEmpresaId(perfil.empresa_id);

            const idEmpresa = perfil.empresa_id || ID_EMPRESA_PRUEBA;

            if (perfil.rol === 'admin') {
                await cargarDatos(idEmpresa);
            } else {
                await Promise.all([
                    cargarPendientes(user.id, idEmpresa),
                    cargarCompletadas(user.id),
                ]);
                setCargando(false);
            }
        };
        init();
    }, []);

    const cargarDatos = async (idEmpresa) => {
        setCargando(true);
        const data = await novedadesService.obtenerNovedades(idEmpresa || empresaId || ID_EMPRESA_PRUEBA);
        setLista(data);
        setCargando(false);
    };

    const cargarPendientes = async (uid, idEmpresa) => {
        const empId = idEmpresa || empresaId || ID_EMPRESA_PRUEBA;
        const uId = uid || userId;
        const [{ data: todasNovedades }, { data: vistas }] = await Promise.all([
            supabase.from('novedades').select('*').eq('empresa_id', empId).order('created_at', { ascending: false }),
            supabase.from('novedades_vistas').select('novedad_id').eq('empleado_id', uId).eq('completada', true),
        ]);
        const idsCompletadas = new Set((vistas || []).map(v => v.novedad_id));
        setListaPendientes((todasNovedades || []).filter(n => !idsCompletadas.has(n.id)));
    };

    const cargarCompletadas = async (uid) => {
        const uId = uid || userId;
        const { data } = await supabase
            .from('novedades_vistas')
            .select('novedad_id, vista_at, novedades(*)')
            .eq('empleado_id', uId)
            .eq('completada', true);
        setListaCompletadas((data || []).map(v => ({ ...v.novedades, vista_at: v.vista_at })));
    };

    const handlePublicar = async () => {
        if (!titulo || !descripcion) {
            Alert.alert("Error", "Por favor llena todos los campos");
            return;
        }
        if (!userId) {
            Alert.alert("Error", "No se pudo obtener el usuario. Intenta de nuevo.");
            return;
        }

        try {
            await novedadesService.crearNovedad({
                titulo,
                descripcion,
                tipo,
                prioridad,
                empresa_id: empresaId || ID_EMPRESA_PRUEBA,
                creado_por: userId,
            });
            Alert.alert("Éxito", "Publicado correctamente");
            setModalVisible(false);
            setTitulo('');
            setDescripcion('');
            cargarDatos();
        } catch (error) {
            Alert.alert("Error al publicar", error.message);
            console.log(error);
        }
    };

    const cargarVistasDeNovedad = async (novedadId) => {
        const { data } = await supabase
            .from('novedades_vistas')
            .select('empleado_id, vista_at, profiles(nombre, email)')
            .eq('novedad_id', novedadId)
            .eq('completada', true);
        return data || [];
    };

    const handleExpandir = async (novedadId) => {
        if (tarjetaExpandida === novedadId) {
            setTarjetaExpandida(null);
            return;
        }
        setTarjetaExpandida(novedadId);
        if (!vistasMap[novedadId]) {
            const vistas = await cargarVistasDeNovedad(novedadId);
            setVistasMap(prev => ({ ...prev, [novedadId]: vistas }));
        }
    };

    const handleMarcarVisto = async (novedadId) => {
        await supabase
            .from('novedades_vistas')
            .upsert({
                novedad_id: novedadId,
                empleado_id: userId,
                completada: true,
                vista_at: new Date().toISOString(),
            }, { onConflict: 'novedad_id,empleado_id' });
        setListaPendientes(prev => prev.filter(n => n.id !== novedadId));
    };

    // ── Cargando / detectando rol ────────────────────────────────────────────
    if (cargando || rol === null) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator size="large" color="#2456ee" style={{ marginTop: 50 }} />
            </SafeAreaView>
        );
    }

    // ── VISTA ADMIN ──────────────────────────────────────────────────────────
    if (rol === 'admin') {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.titleInline}>Panel de Control</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <MaterialCommunityIcons name="plus-circle" size={32} color="#2456ee" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={lista}
                    contentContainerStyle={{ padding: 20 }}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={() => (
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <MaterialCommunityIcons name="clipboard-blank-outline" size={80} color="#ccc" />
                            <Text style={{ color: '#666' }}>No hay novedades aún</Text>
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{item.titulo}</Text>
                                <View style={[styles.badge, { backgroundColor: item.prioridad === 'alta' ? '#FEE2E2' : '#DBEAFE' }]}>
                                    <Text style={{ color: item.prioridad === 'alta' ? '#EF4444' : '#2563EB', fontSize: 10, fontWeight: 'bold' }}>
                                        {item.prioridad?.toUpperCase()}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.cardDesc}>{item.descripcion}</Text>
                            <View style={styles.cardFooter}>
                                <Text style={styles.cardType}>{item.tipo === 'tarea' ? '📌 Tarea' : '🔔 Novedad'}</Text>
                                <Text style={styles.cardDate}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.btnExpandir}
                                onPress={() => handleExpandir(item.id)}
                            >
                                <MaterialCommunityIcons
                                    name={tarjetaExpandida === item.id ? 'chevron-up' : 'chevron-down'}
                                    size={18}
                                    color='#5b5b5b'
                                />
                                <Text style={styles.btnExpandirTexto}>
                                    {tarjetaExpandida === item.id ? 'Ocultar' : 'Ver quién completó'}
                                </Text>
                            </TouchableOpacity>
                            {tarjetaExpandida === item.id && (
                                <View style={styles.vistasContainer}>
                                    {(vistasMap[item.id] || []).length === 0 ? (
                                        <Text style={styles.vistasVacio}>Ningún empleado lo ha completado aún</Text>
                                    ) : (
                                        (vistasMap[item.id] || []).map((v, i) => (
                                            <View key={i} style={styles.vistaItem}>
                                                <MaterialCommunityIcons name='account-check' size={16} color='#4CAF50' />
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
                        </View>
                    )}
                />

                <Modal visible={modalVisible} animationType="slide">
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nueva Novedad/Tarea</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Título"
                            value={titulo}
                            onChangeText={setTitulo}
                        />
                        <TextInput
                            style={[styles.input, { height: 100 }]}
                            placeholder="Descripción"
                            multiline
                            value={descripcion}
                            onChangeText={setDescripcion}
                        />
                        <Text style={styles.label}>Tipo:</Text>
                        <View style={styles.row}>
                            {['novedad', 'tarea', 'aviso'].map(t => (
                                <TouchableOpacity
                                    key={t}
                                    onPress={() => setTipo(t)}
                                    style={[styles.choice, tipo === t && styles.activeChoice]}
                                >
                                    <Text style={tipo === t ? { color: 'white' } : {}}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.label}>Prioridad:</Text>
                        <View style={styles.row}>
                            {['alta', 'media', 'baja'].map(p => (
                                <TouchableOpacity
                                    key={p}
                                    onPress={() => setPrioridad(p)}
                                    style={[styles.choice, prioridad === p && styles.activeChoice]}
                                >
                                    <Text style={prioridad === p ? { color: 'white' } : {}}>{p}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.btnPublicar} onPress={handlePublicar}>
                            <Text style={styles.btnText}>Publicar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={{ textAlign: 'center', color: 'red', marginTop: 20 }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }

    // ── VISTA EMPLEADO ───────────────────────────────────────────────────────
    const listaActual = tabActivo === 'pendientes' ? listaPendientes : listaCompletadas;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.header, { justifyContent: 'flex-start', gap: 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color="#5b5b5b" />
                </TouchableOpacity>
                <Text style={styles.titleInline}>Novedades</Text>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, tabActivo === 'pendientes' && styles.tabActivo]}
                    onPress={() => setTabActivo('pendientes')}
                >
                    <Text style={tabActivo === 'pendientes' ? styles.tabTextoActivo : styles.tabTexto}>Pendientes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tabActivo === 'completadas' && styles.tabActivo]}
                    onPress={() => setTabActivo('completadas')}
                >
                    <Text style={tabActivo === 'completadas' ? styles.tabTextoActivo : styles.tabTexto}>Completadas</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={listaActual}
                contentContainerStyle={{ padding: 20 }}
                keyExtractor={(item) => item.id?.toString()}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center', marginTop: 50, gap: 12 }}>
                        {tabActivo === 'pendientes' ? (
                            <>
                                <MaterialCommunityIcons name="check-all" size={72} color="#4CAF50" />
                                <Text style={{ color: '#666' }}>¡Todo al día! No tienes pendientes</Text>
                            </>
                        ) : (
                            <>
                                <MaterialCommunityIcons name="clipboard-check-outline" size={72} color="#9CA3AF" />
                                <Text style={{ color: '#666' }}>Aún no has completado ninguna</Text>
                            </>
                        )}
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{item.titulo}</Text>
                            {tabActivo === 'completadas' ? (
                                <MaterialCommunityIcons name="check-circle" size={22} color="#4CAF50" />
                            ) : (
                                <View style={[styles.badge, { backgroundColor: item.prioridad === 'alta' ? '#FEE2E2' : '#DBEAFE' }]}>
                                    <Text style={{ color: item.prioridad === 'alta' ? '#EF4444' : '#2563EB', fontSize: 10, fontWeight: 'bold' }}>
                                        {item.prioridad?.toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.cardDesc}>{item.descripcion}</Text>
                        <View style={styles.cardFooter}>
                            <Text style={styles.cardType}>{item.tipo === 'tarea' ? '📌 Tarea' : '🔔 Novedad'}</Text>
                            <Text style={styles.cardDate}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</Text>
                        </View>
                        {tabActivo === 'pendientes' && (
                            <TouchableOpacity style={styles.btnVisto} onPress={() => handleMarcarVisto(item.id)}>
                                <MaterialCommunityIcons name="check-circle-outline" size={18} color="#2456ee" />
                                <Text style={styles.btnVistoTexto}>Marcar como visto</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
    header: { padding: 20, paddingTop: 40, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    titleInline: { fontSize: 22, fontWeight: 'bold' },
    card: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    cardTitle: { fontSize: 18, fontWeight: 'bold' },
    cardDesc: { fontSize: 14, color: '#4B5563', marginBottom: 12 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8 },
    cardType: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
    cardDate: { fontSize: 12, color: '#9CA3AF' },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
    modalContent: { flex: 1, padding: 30, justifyContent: 'center' },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { backgroundColor: '#f9fafb', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    label: { fontWeight: 'bold', marginBottom: 10 },
    row: { flexDirection: 'row', marginBottom: 20, justifyContent: 'space-between' },
    choice: { padding: 10, borderWidth: 1, borderColor: '#2456ee', borderRadius: 8, flex: 1, alignItems: 'center', marginHorizontal: 2 },
    activeChoice: { backgroundColor: '#2456ee' },
    btnPublicar: { backgroundColor: '#2456ee', padding: 15, borderRadius: 10, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold' },
    tabs: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
    tabActivo: { borderBottomWidth: 2, borderBottomColor: '#2456ee' },
    tabTexto: { fontSize: 14, color: '#5b5b5b' },
    tabTextoActivo: { fontSize: 14, color: '#2456ee', fontWeight: 'bold' },
    btnVisto: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    btnVistoTexto: { color: '#2456ee', fontSize: 13, fontWeight: '600' },
    btnExpandir: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    btnExpandirTexto: { fontSize: 12, color: '#5b5b5b' },
    vistasContainer: { marginTop: 8, padding: 10, backgroundColor: '#F9FAFB', borderRadius: 8 },
    vistasVacio: { fontSize: 12, color: '#9CA3AF', textAlign: 'center' },
    vistaItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
    vistaNombre: { flex: 1, fontSize: 13, color: '#374151' },
    vistaFecha: { fontSize: 11, color: '#9CA3AF' },
});