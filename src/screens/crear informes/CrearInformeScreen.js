import { StyleSheet, Pressable, KeyboardAvoidingView, Keyboard, Animated, View, Text, TextInput, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import Icons from '../../components/Icons';
import Button from '../../components/Button';
import MenuBar from '../../components/MenuBar';
import Logo from '../../components/Logo';
import DrawerMenu from '../../components/DrawerMenu';

export default function CrearInformeScreen({ navigation }) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const translateTittle = useRef(new Animated.Value(0)).current;
    const translateInput = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', (e) => {
            const height = e.endCoordinates.height;
            Animated.timing(translateTittle, {
                toValue: -height * 0.3,
                duration: 250,
                useNativeDriver: true,
            }).start();
            Animated.timing(translateInput, {
                toValue: height,
                duration: 250,
                useNativeDriver: true,
            }).start();
            setKeyboardVisible(true);
        });

        const hide = Keyboard.addListener('keyboardDidHide', () => {
            Animated.timing(translateTittle, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
            Animated.timing(translateInput, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
            setKeyboardVisible(false);
        });

        return () => {
            show.remove();
            hide.remove();
        }
    }, [])

    return (
        <View style={styles.container}>
            <DrawerMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                navigation={navigation}
            />

            <View style={{ alignItems: 'center', marginTop: 50, zIndex: 10 }}>
                <View style={{ width: '90%' }}>
                    <MenuBar onPressMenu={() => setDrawerVisible(true)} />
                </View>
            </View>

            <View
                style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingTop: 120 }}
            >
                <Animated.View style={{ marginTop: 80, transform: [{ translateY: translateTittle }] }}>
                    <View style={{ width: '80%', alignSelf: 'center' }}>
                        <Text style={styles.tittle}>Que informe haremos hoy?</Text>
                    </View>
                </Animated.View>

                <View style={{ alignItems: 'center', width: '100%' }}>
                    <Animated.View style={{ width: '90%', transform: [{ translateY: Animated.multiply(translateInput, - 1) }] }}>
                        <View style={styles.chatBar}>
                            <Icons name='paperclip' size={22} color='#2456ee' />
                            <TextInput
                                placeholder='Creemos tu informe juntos'
                                style={styles.textInput}
                                placeholderTextColor="#9CA3AF"
                            />
                            <Icons name='send' size={24} color='#2456ee' />
                        </View>
                    </Animated.View>
                </View>
            </View>

            {!keyboardVisible && (
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <Text style={styles.text}>Accede a más funcionalidades con </Text>
                        <Text style={styles.link}> Aurora AI</Text>
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    tittle: {
        color: '#5b5b5b',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    textInput: {
        flex: 1,
        height: 45,
        backgroundColor: '#dfdfdf',
        color: '#1A1A2E',
        fontSize: 15,
        paddingHorizontal: 8,
    },
    chatBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        backgroundColor: '#dfdfdf',
        borderRadius: 10,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderColor: '#6cb1ff',
        height: 52,
    },
    text: {
        color: '#b1b1b1',
        fontSize: 12,
        fontWeight: 'light'
    },
    link: {
        color: '#2456ee',
        fontSize: 12,
        fontWeight: 'normal'
    }
})