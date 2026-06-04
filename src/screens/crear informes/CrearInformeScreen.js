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
import { FileSelectorBox } from './UploadFiles/components/FileSelectorBox';

export default function CrearInformeScreen({ navigation }) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [fileInfo, setFileInfo] = useState(null);
    const [mostrarFecha, setMostrarFecha] = useState(false);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
    const [fechaTemp, setFechaTemp] = useState(new Date());
    const { handleSelectFile } = useFile();

    const { pront,
        bubbleMessage,
        deleteTitle,
        createChat,
        setPront,
        send,
        generatePdf,
        seleccionarFecha } = useChatService();

    const { keyboardVisible,
        translateTittle,
        translateInput } = useKeyboardAnimations();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <View style={{ alignItems: 'center', marginTop: 50, zIndex: 10 }}>
                <View style={{ width: '90%' }}>
                    <MenuBar onPressMenu={() => setDrawerVisible(true)} />
                </View>
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                <WelcomeHeader deleteTitle={deleteTitle} translateTittle={translateTittle} />
                <MessageList
                    createChat={createChat}
                    bubbleMessage={bubbleMessage}
                    generatePdf={generatePdf}
                    onDateSelect={() => setMostrarDatePicker(true)}
                />

                <View style={{ alignItems: 'center', width: '100%' }}>
                    {mostrarFecha && (
                        <DateTimePicker
                            value={fechaSeleccionada}
                            mode='date'
                            display='default'
                            onChange={(event, date) => {
                                setMostrarFecha(false);
                                if (date) {
                                    setFechaSeleccionada(date);
                                    const fechaFormateada = date.toLocaleDateString('es-CO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    });
                                    setPront(fechaFormateada);
                                }
                            }}
                        />
                    )}
                    <ChatInputBar
                        translateInput={translateInput}
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

            {mostrarDatePicker && (
                <DateTimePicker
                    value={fechaTemp}
                    mode='date'
                    display='calendar'
                    onChange={(event, date) => {
                        setMostrarDatePicker(false);
                        if (event.type === 'set' && date) {
                            const fechaFormateada = date.toLocaleDateString('es-CO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });
                            seleccionarFecha(fechaFormateada);
                        }
                    }}
                />
            )}

            {!keyboardVisible && (
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <Text style={styles.text}>Accede a más funcionalidades con </Text>
                        <Text style={styles.link}> Aurora AI</Text>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
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
});