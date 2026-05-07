import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import Logo from '../../components/Logo';
import Button from '../../components/Button';
import Icons from '../../components/Icons';

import TextInputs from './components/TextInputs';


import { supabase } from '../../lib/supabase';

export default function LoginScreen() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  async function handleLogin() {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      
        if (error) {
          Alert.alert("Correo o contraseña incorrectos");
          return;
        }

        Alert.alert("Iniciando sesión...");
        navigation.navigate('CrearInforme');

      } catch(error) {
        Alert.alert("Algo salio mal.");
      }
    }

  return (
    <View style={styles.container}>

      <Logo width={80} height={80} />

      <Text style={{ fontSize: 32, fontWeight: "bold", color: "#2456ee", marginTop: 20, marginBottom: 50 }}>Iniciar Sesión</Text>

      <TextInputs placeholder="Correo electronico" value={email} autoCapitalize="none" onChangeText={setEmail} />

      <TextInputs security={true} placeholder="Contraseña"
        value={password} autoCapitalize="none" onChangeText={setPassword} />

      <View style={{ width: "80%", alignItems: "flex-end" }}>
        <Text style={[styles.link, { marginBottom: 25, alignItems: "flex-end" }]}>Olvidaste tu contraseña?</Text>
      </View>

      <Pressable
        onPress={handleLogin}
        style={({ pressed }) => (
          {
            backgroundColor: pressed ? "#6cb1ff" : "#2456ee",
            padding: 12,
            width: "80%",
            borderRadius: 8,
            alignItems: "center",
            marginTop: 10,
          }
        )}>
        {({ pressed }) => (
          <Text style={{ color: "#f3f4f6", fontWeight: "bold", fontSize: 20, }}>Ingresar</Text>
        )}
      </Pressable>


      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 40, marginBottom: 50 }}>
        <Text style={styles.text}>No tienes cuenta?</Text>
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>Registrate</Text>
      </View>
      <Text style={[styles.text, { fontWeight: "light", fontSize: 14 }]}>Continua con</Text>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, gap: 35 }}>
        <Icons name="google" size={32} color="#5b5b5b" />
        <Icons name="email" size={32} color="#5b5b5b" />
        <Icons name="apple" size={32} color="#5b5b5b" />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
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