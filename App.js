import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View, Image, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function App() {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/Logo.png')} style={styles.logo} />
      <Text style={{fontSize: 32, fontWeight: "bold", color: "#2456ee", marginTop: 20}}>Iniciar Sesión</Text>
      <TextInput placeholder="Correo electronico" style={[styles.input, {marginTop: 80}]} />
      <TextInput placeholder="Contraseña" style={styles.input}/>
      <Text style={[styles.link, {marginBottom: 30}]}>Olvidaste tu contraseña?</Text>
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? "#6cb1ff" : "#2456ee",
            width: "80%",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 20,
          }
        ]}>
        {({pressed}) => [
          <Text style={styles.buttonText}>{pressed ? "Ingresar" : "Ingresar"}</Text>
        ]}
      </Pressable>
      <View style={{flexDirection: "row", alignItems: "center", marginTop: 40, marginBottom: 50}}>
        <Text style={styles.text}>No tienes cuenta?</Text>
        <Text style={styles.link}>Registrate</Text>
      </View>
      <Text style={[styles.text, {fontWeight: "light", fontSize: 14}]}>Continua con</Text>
      <View style={{flexDirection: "row", alignItems: "center", marginTop: 20, gap: 20}}>
        <MaterialCommunityIcons name="google" size={24} color="#5b5b5b" />
        <MaterialCommunityIcons name="email" size={24} color="#5b5b5b" />
        <MaterialCommunityIcons name="apple" size={24} color="#5b5b5b" />
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
  logo: {
    width: 90,
    height: 90,
  },
  input: {
    width: '80%',
    height: 55,
    borderColor: '#5b5b5b',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  link: {
    color: "#2456ee",
    fontSize: 16,
    marginTop: 5,
  },
  buttonText: {
    color: "#f3f4f6",
    fontWeight: "bold",
    fontSize: 20,
  },
  text: {
    color: "#5b5b5b",
    fontSize: 16,
    marginTop: 5,
    paddingRight: 5,
  }
});
