import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/icon.png')}
        style={styles.logo}
      />
      <Text style={styles.titulo}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#9CA3AF"
        style={[styles.input, { marginTop: 40 }]}
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry={true}
      />

      <Text style={styles.link}>Olvidaste tu contraseña?</Text>

      <Pressable
        style={({ pressed }) => [
          styles.boton,
          { backgroundColor: pressed ? '#6CB1FF' : '#2456EE' },
        ]}
        onPress={() => {
          // Aquí conectaremos Supabase después
        }}
      >
        <Text style={styles.botonTexto}>Ingresar</Text>
      </Pressable>

      <View style={{ flexDirection: 'row', marginTop: 30 }}>
        <Text style={styles.texto}>No tienes cuenta? </Text>
        <Pressable onPress={() => navigation.navigate('RegisterEmpresa')}>
          <Text style={styles.link}>Regístrate</Text>
        </Pressable>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 90,
    height: 90,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2456EE',
    marginTop: 20,
    marginBottom: 10,
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
  link: {
    color: '#2456EE',
    fontSize: 16,
    marginTop: 5,
  },
  boton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  texto: {
    color: '#5B5B5B',
    fontSize: 16,
  },
});