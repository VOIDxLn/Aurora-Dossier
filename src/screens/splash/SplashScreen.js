import { View, image, StyleSheet, Animated, Text } from 'react-native';
import { useEffect, useRef } from 'react';

import Logo from '../../components/Logo';

export default function SplashScreen({ navigation }) {

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade-in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            navigation.replace('Login');
        }, 2000);
    }, []);


    return (
        <View style={styles.content}>
            <Animated.Text style={[styles.text, {opacity: fadeAnim}]}>
                Aurora Dossier
            </Animated.Text>
            <Animated.View style={{ opacity: fadeAnim}}>
                <Logo width={250} height={250} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        container: 1,
        flex: 1,
        alignItems: 'center',
        marginTop: 250,
        backgroundColor: '#f3f4f6',
    },
    text: {
        fontFamily: 'inter',
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2456ee',
    },
})