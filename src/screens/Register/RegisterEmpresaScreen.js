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

import Logo from '../../components/Logo';
import TextInputs from '../auth/components/TextInputs';

export default function RegisterEmpresaScreen({ navigation }) {
  // Estas variables guardan lo que el usuario escribe
  const [nit, setNit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [domicilio, setDomicilio] = useState('');

  return (
      <ScrollView contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >

        {/* Logo */}
        <Logo width={80} height={80} />
        

        {/* Título */}
        <Text style={styles.titulo}>Crear cuenta</Text>

        <TextInputs placeholder="Nit" autoCapitalize="none" value={nit}
          onChangeText={setNit}
        />

        {/* Campo Razón Social */}
        <TextInputs placeholder="Razon social" autoCapitalize="none" value={razonSocial}
          onChangeText={setRazonSocial}
        />

        {/* Campo Domicilio Fiscal */}
        <TextInputs placeholder="Domicilio fiscal" autoCapitalize="none" value={domicilio}
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

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
          <Text style={styles.text}>Ya tienes cuenta?</Text>
          <Text style={styles.link} onPress={() => navigation.goBack()}>Inicia sesión</Text>
        </View>

      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 70
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
    marginTop: 80,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    color: "#2456ee",
    fontSize: 16,
    fontWeight: "regular",
    marginTop: 5,
  },
  text: {
    color: "#5b5b5b",
    fontSize: 16,
    marginTop: 5,
    paddingRight: 5,
  }
});