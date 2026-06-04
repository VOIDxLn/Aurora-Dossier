import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function InformeDetalleScreen({ navigation, route }) {
  const { informe } = route.params;

  const esCompletado = informe.estado === 'completado';

  const renderContenido = (texto) => {
    if (!texto) return null;
    const lineas = texto.split('\n');
    return lineas.map((linea, index) => {
      if (linea.startsWith('**') && linea.endsWith('**') && linea.length > 4) {
        const contenido = linea.replace(/\*\*/g, '');
        return (
          <Text key={index} style={styles.subtitulo}>{contenido}</Text>
        );
      }
      if (linea.includes('**')) {
        const partes = linea.split(/\*\*(.*?)\*\*/g);
        return (
          <Text key={index} style={styles.contenidoTexto}>
            {partes.map((parte, i) =>
              i % 2 === 1
                ? <Text key={i} style={styles.negrita}>{parte}</Text>
                : parte
            )}
          </Text>
        );
      }
      if (linea.trim() === '---' || linea.trim() === '_' || linea.trim() === '') {
        return <View key={index} style={styles.separador} />;
      }
      return (
        <Text key={index} style={styles.contenidoTexto}>{linea}</Text>
      );
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name='arrow-left' size={26} color='#5b5b5b' />
        </TouchableOpacity>
        <Text style={styles.headerTitulo} numberOfLines={1}>{informe.titulo}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contenido}>
        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: informe.estado === 'completado' ? '#DCFCE7' : '#FEF9C3' }]}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: informe.estado === 'completado' ? '#16A34A' : '#CA8A04' }}>
              {informe.estado?.toUpperCase() || 'BORRADOR'}
            </Text>
          </View>
          <Text style={styles.fecha}>
            {informe.created_at ? new Date(informe.created_at).toLocaleDateString() : ''}
          </Text>
        </View>
        {renderContenido(informe.informe_generado)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, paddingTop: 40, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', flex: 1, textAlign: 'center', marginHorizontal: 8 },
  contenido: { padding: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeTexto: { fontSize: 11, fontWeight: 'bold' },
  fecha: { fontSize: 13, color: '#9CA3AF' },
  separador: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 20, marginVertical: 10 },
  cuerpo: { fontSize: 15, color: '#374151', lineHeight: 24 },
  contenidoTexto: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 2 },
  subtitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginTop: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  negrita: {
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
});
