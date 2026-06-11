import { useState } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import MenuBar from '../../components/MenuBar';
import DrawerMenu from '../../components/DrawerMenu';

import { useChatService } from './hooks/useChatService';
import { useKeyboardAnimations } from './hooks/useKeyboardAnimations';

import WelcomeHeader from './components/WelcomeHeader';
import MessageList from './components/MessageList';
import ChatInputBar from './components/ChatInputBar';

import { useFile } from './UploadFiles/hooks/useFile';

export default function CrearInformeScreen({ navigation }) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [fileInfo, setFileInfo] = useState(null);
    const [mostrarFecha, setMostrarFecha] = useState(false);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
    const [fechaTemp, setFechaTemp] = useState(new Date());
    const { handleSelectFile } = useFile();

    const {
        pront, bubbleMessage, deleteTitle, createChat,
        deleteLoadingMessage, setDeleteLoadingMessage,
        setPront, send, generatePdf, seleccionarFecha,
    } = useChatService();

    const { keyboardVisible } = useKeyboardAnimations();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='padding'
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <DrawerMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                navigation={navigation}
            />

            <View style={styles.menuBarWrapper}>
                <MenuBar onPressMenu={() => setDrawerVisible(true)} />
            </View>

            <View style={styles.body}>
                <WelcomeHeader deleteTitle={deleteTitle} />

                <MessageList
                    createChat={createChat}
                    bubbleMessage={bubbleMessage}
                    generatePdf={generatePdf}
                    deleteLoadingMessage={deleteLoadingMessage}
                    setDeleteLoadingMessage={setDeleteLoadingMessage}
                    onDateSelect={() => setMostrarDatePicker(true)}
                />

                <View style={styles.inputWrapper}>
                    <ChatInputBar
                        pront={pront}
                        setPront={setPront}
                        send={() => send(fileInfo, setFileInfo)}
                        onSelectFile={() => handleSelectFile(setFileInfo)}
                        onSelectFecha={() => setMostrarFecha(true)}
                        fileInfo={fileInfo}
                        setFileInfo={setFileInfo}
                    />
                </View>
            </View>

            {!keyboardVisible && (
                <View style={styles.footer}>
                    <Text style={styles.text}>Accede a más funcionalidades con </Text>
                    <Text style={styles.link}>Aurora AI</Text>
                </View>
            )}

            {mostrarFecha && (
                <DateTimePicker
                    value={fechaSeleccionada}
                    mode='date'
                    display='default'
                    onChange={(event, date) => {
                        setMostrarFecha(false);
                        if (date) {
                            setFechaSeleccionada(date);
                            setPront(date.toLocaleDateString('es-CO', {
                                year: 'numeric', month: 'long', day: 'numeric',
                            }));
                        }
                    }}
                />
            )}

            {mostrarDatePicker && (
                <DateTimePicker
                    value={fechaTemp}
                    mode='date'
                    display='calendar'
                    onChange={(event, date) => {
                        setMostrarDatePicker(false);
                        if (event.type === 'set' && date) {
                            seleccionarFecha(date.toLocaleDateString('es-CO', {
                                year: 'numeric', month: 'long', day: 'numeric',
                            }));
                        }
                    }}
                />
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    menuBarWrapper: {
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: '5%',
    },
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputWrapper: {
        width: '90%',
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    text: { color: '#b1b1b1', fontSize: 12 },
    link: { color: '#2456ee', fontSize: 12 },
});
