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
  Alert,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function RegisterUsuarioScreen({ navigation, route }) {
  const { nit, razonSocial, domicilio } = route.params;

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async () => {
    // Validaciones
    if (!correo || !contrasena || !confirmar) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (contrasena !== confirmar) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener mínimo 6 caracteres');
      return;
    }

    setCargando(true);

    try {
      // Paso 1 — Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: correo,
        password: contrasena,
      });

      if (authError) throw authError;

      // Paso 2 — Guardar empresa en la tabla 'empresas'
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .insert([{
          nit: nit,
          razon_social: razonSocial,
          domicilio_fiscal: domicilio,
          correo: correo,
        }])
        .select()
        .single();

      if (empresaError) throw empresaError;

      // Paso 3 — Actualizar el perfil con empresa_id y rol
      const { error: perfilError } = await supabase
        .from('profiles')
        .update({
          empresa_id: empresaData.id,
          rol: 'empleado',
        })
        .eq('id', authData.user.id);

      if (perfilError) throw perfilError;

      // ¡Éxito!
      Alert.alert(
        '¡Registro exitoso!',
        'Tu cuenta ha sido creada. Ya puedes iniciar sesión.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>

        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logo}
        />

        <Text style={styles.titulo}>Crear cuenta</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#9CA3AF"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#9CA3AF"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry={true}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#9CA3AF"
          value={confirmar}
          onChangeText={setConfirmar}
          secureTextEntry={true}
        />

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            { backgroundColor: pressed ? '#6CB1FF' : '#2456EE' },
            cargando && { backgroundColor: '#9CA3AF' },
          ]}
          onPress={handleRegistro}
          disabled={cargando}
        >
          <Text style={styles.botonTexto}>
            {cargando ? 'Registrando...' : 'Registrarse'}
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={styles.link}>← Volver</Text>
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
  link: {
    color: '#2456EE',
    fontSize: 16,
  },
});