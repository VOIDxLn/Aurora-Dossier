import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function RegisterEmpresaScreen({ navigation }) {
  // Estas variables guardan lo que el usuario escribe
  const [nit, setNit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [domicilio, setDomicilio] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* Logo */}
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logo}
        />

        {/* Título */}
        <Text style={styles.titulo}>Crear cuenta</Text>

        {/* Campo NIT */}
        <TextInput
          style={styles.input}
          placeholder="NIT"
          placeholderTextColor="#9CA3AF"
          value={nit}
          onChangeText={setNit}
          keyboardType="numeric"
        />

        {/* Campo Razón Social */}
        <TextInput
          style={styles.input}
          placeholder="Razón social"
          placeholderTextColor="#9CA3AF"
          value={razonSocial}
          onChangeText={setRazonSocial}
        />

        {/* Campo Domicilio Fiscal */}
        <TextInput
          style={styles.input}
          placeholder="Domicilio fiscal"
          placeholderTextColor="#9CA3AF"
          value={domicilio}
          onChangeText={setDomicilio}
        />

        {/* Botón Continuar */}
        <Pressable
          style={({ pressed }) => [
            styles.boton,
            { backgroundColor: pressed ? '#6CB1FF' : '#2456EE' },
          ]}
          onPress={() => navigation.navigate('RegisterUsuario', {
            nit,
            razonSocial,
            domicilio,
          })}
        >
          <Text style={styles.botonTexto}>Continuar</Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2456EE',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 55,
    borderColor: '#D1D5DB',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#1A1A2E',
  },
  boton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});