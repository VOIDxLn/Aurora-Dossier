import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import { supabase } from '../../lib/supabase';

import Logo from '../../components/Logo';
import Button from '../../components/Button';
import Icons from '../../components/Icons';

import TextInputs from './components/TextInputs';

export default function LoginScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email, password
    })

    if (error) Alert.alert("Errror", error.message);
    setLoading(false);
  }

  async function signUp() {
    setLoading(true);

    const {
      data: { session },
      error,

    } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    if (error) Alert.alert("Error", error.message);
    if (!session) Alert.alert("por favor revisa tu correo para veridicar tu cuenta");
    setLoading(false);
  }

  return (
    <View style={styles.container}>

      <Logo width={80} height={80} />

      <Text style={{ fontSize: 32, fontWeight: "bold", color: "#2456ee", marginTop: 20, marginBottom: 50 }}>Iniciar Sesión</Text>

      <TextInputs placeholder="Correo electronico" onChangeText={(text) => setEmail(text)} value={email} autoCapitalize="none" />

      <TextInputs placeholder="Contraseña" onChangeText={(text) => setPassword(text)}
        value={password} autoCapitalize="none" />

      <Text style={[styles.link, { marginBottom: 30, width: "80%", textAlign: "right" }]}>Olvidaste tu contraseña?</Text>

      <TouchableOpacity onPress={() => signInWithEmail()} disabled={loading} >
        <Button buttonText={loading ? "Ingresando..." : "Ingresar"} buttonStyle={{ color: "#f3f4f6", fontWeight: "bold", fontSize: 20, }}
          pressedButtonColor="#6cb1ff" buttonColor="#2456ee" width="80%" marginTop={20} />
      </TouchableOpacity>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 40, marginBottom: 50 }}>
        <Text style={styles.text}>No tienes cuenta?</Text>
        <Text style={styles.link}>Registrate</Text>
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
