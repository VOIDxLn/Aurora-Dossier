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

import Logo from '../../components/Logo';
import TextInputs from '../auth/components/TextInputs';

export default function RegisterUsuarioScreen({ navigation, route }) {
  const { nit, razonSocial, domicilio } = route.params || {};

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
          rol: 'admin',
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
    <ScrollView contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >

      <Logo width={80} height={80} />

      <Text style={styles.titulo}>Crear cuenta</Text>

      <TextInputs
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInputs
        placeholder="Contraseña"
        keyboardType="default"
        value={contrasena}
        onChangeText={setContrasena}
        security={true}
        autoCorrect={false}
        autoCapitalize="none"
      />

      <TextInputs
        placeholder="Confirmar contraseña"
        value={confirmar}
        onChangeText={setConfirmar}
        security={true}
        autoCorrect={false}
        autoCapitalize="none"
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 70,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2456EE',
    marginTop: 20,
    marginBottom: 60,
  },
  boton: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 60,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    color: '#2456EE',
    fontSize: 16,
    marginTop: 5
  },
});