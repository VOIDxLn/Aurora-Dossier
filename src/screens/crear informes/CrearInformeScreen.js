import { StyleSheet, Pressable, KeyboardAvoidingView, Keyboard, Animated, View, ScrollView, Text, TextInput, Platform, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useState, useEffect, useRef } from 'react';

import Icons from '../../components/Icons';
import MenuBar from '../../components/MenuBar';
import Logo from '../../components/Logo';

export default function CrearInformeScreen() {

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const translateTittle = useRef(new Animated.Value(0)).current;
    const translateInput = useRef(new Animated.Value(0)).current;

    // Pront message chat 
    const [pront, setPront] = useState("");
    const [chat, setChat] = useState("");
    const [bubleMessage, setBubbleMessage] = useState([{ value: "" }]);
    const [deleteTitle, setDeleteTitle] = useState(true);
    const [createChat, setCreateChat] = useState(false);

    const author = 'user';
    const messageText = [];

    const send = (event) => {
        event.preventDefault();

        if (pront.trim() === "") {
            event.preventDefault();
            return;
        } else {
            const message = { author, messageText: pront };

            setBubbleMessage([...bubleMessage, { value: message.messageText }]);
            setDeleteTitle(false);
            setCreateChat(true);
            setPront("");

            return setChat(bubleMessage);
        }
    }

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

            <View style={{ alignItems: 'center', marginTop: 50, zIndex: 10 }}>
                <View style={{ width: '90%' }}>
                    <MenuBar />
                </View>

            </View>

            <View
                style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >

                {deleteTitle && (<Animated.View style={{ marginTop: 200, transform: [{ translateY: translateTittle }] }}>
                    <View style={{ width: '80%' }}>
                        <Text style={styles.tittle}>Que informe haremos hoy?</Text>
                    </View>
                </Animated.View>)}

                {/* Chat */}
                {createChat && (<ScrollView style={{ width: '90%', marginBottom: 5 }}
                    contentContainerStyle={{ gap: 5 }}>
                    {bubleMessage.map((message, index) => (
                        message.value ? 
                        <View key={index}
                            style={{
                                maxWidth: '80%',
                                borderRadius: 15,
                                padding: 10,
                                alignSelf: author === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: author === 'user' ? '#6cb1ff' : '#000000'
                            }}
                        >
                            <Text>{message.value}</Text>
                        </View>
                        : null
                    ))}
                </ScrollView>)}


                <View style={{ alignItems: 'center' }}>

                    <Animated.View style={{ transform: [{ translateY: Animated.multiply(translateInput, - 1) }] }}>

                        <View style={styles.chatBar}>
                            <Icons name='paperclip' size={22} color='#2456ee' />
                            <TextInput
                                onChangeText={setPront} value={pront}
                                placeholder='Creemos tu informe juntos' style={styles.textInput}>
                            </TextInput>

                            <TouchableOpacity
                                onPress={send}

                            ><Icons name='send' size={24} color='#2456ee' />
                            </TouchableOpacity>


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
        width: '78%',
        height: 45,
        backgroundColor: '#dfdfdf',
    },
    chatBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        width: '100%',
        backgroundColor: '#dfdfdf',
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 2,
        borderColor: '#6cb1ff'
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