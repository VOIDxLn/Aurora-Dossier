import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet,
         SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

export default function InformesScreen({ navigation }) {
  const [informes, setInformes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarInformes();
  }, []);

  const cargarInformes = async () => {
    setCargando(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setCargando(false); return; }

    const { data, error } = await supabase
      .from('informes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) Alert.alert('Error', error.message);
    else setInformes(data || []);
    setCargando(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name='arrow-left' size={26} color='#5b5b5b' />
        </TouchableOpacity>
        <Text style={styles.titulo}>Mis Informes</Text>
        <View style={{ width: 26 }} />
      </View>

      {cargando ? (
        <ActivityIndicator size='large' color='#2456ee' style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={informes}
          contentContainerStyle={{ padding: 20 }}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={styles.vacio}>
              <MaterialCommunityIcons name='file-document-outline' size={72} color='#ccc' />
              <Text style={styles.vacioTexto}>No tienes informes aún</Text>
              <TouchableOpacity
                style={styles.btnCrear}
                onPress={() => navigation.navigate('CrearInforme')}
              >
                <Text style={styles.btnCrearTexto}>Crear mi primer informe</Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('InformeDetalle', { informe: item })}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name='file-document' size={22} color='#2456ee' />
                <Text style={styles.cardTitulo} numberOfLines={1}>{item.titulo}</Text>
              </View>
              {item.resumen ? (
                <Text style={styles.cardResumen} numberOfLines={2}>{item.resumen}</Text>
              ) : (
                <Text style={styles.cardResumen} numberOfLines={3}>{item.informe_generado}</Text>
              )}
              <View style={styles.cardFooter}>
                <View style={[styles.badge, { backgroundColor: item.estado === 'completado' ? '#DCFCE7' : '#FEF9C3' }]}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: item.estado === 'completado' ? '#16A34A' : '#CA8A04' }}>
                    {item.estado?.toUpperCase() || 'BORRADOR'}
                  </Text>
                </View>
                <Text style={styles.cardFecha}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            padding: 20, paddingTop: 40, backgroundColor: 'white',
            borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#1A1A2E' },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 12,
          marginBottom: 12, elevation: 2,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06, shadowRadius: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardTitulo: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', flex: 1 },
  cardResumen: { fontSize: 13, color: '#4B5563', marginBottom: 12, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  cardFecha: { fontSize: 11, color: '#9CA3AF' },
  vacio: { alignItems: 'center', marginTop: 80, gap: 12 },
  vacioTexto: { fontSize: 16, color: '#9CA3AF' },
  btnCrear: { backgroundColor: '#2456ee', paddingVertical: 12, paddingHorizontal: 24,
              borderRadius: 10, marginTop: 8 },
  btnCrearTexto: { color: 'white', fontWeight: 'bold', fontSize: 15 },
});
