import { useState } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';

import MenuBar from '../../components/MenuBar';

import { useChatService } from './hooks/useChatService';
import { useKeyboardAnimations } from './hooks/useKeyboardAnimations';

import WelcomeHeader from './components/WelcomeHeader';
import MessageList from './components/MessageList';
import ChatInputBar from './components/ChatInputBar';

import { useFile } from './UploadFiles/hooks/useFile';
import { FileSelectorBox } from './UploadFiles/components/FileSelectorBox';

export default function CrearInformeScreen() {

    const [fileInfo, setFileInfo] = useState(null);
    const { handleSelectFile } = useFile();

    const { pront,
        bubbleMessage,
        deleteTitle,
        createChat,
        setPront,
        send,
        generatePdf } = useChatService();

    const { keyboardVisible,
        translateTittle,
        translateInput } = useKeyboardAnimations();

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

                {/* TITLE */}
                <WelcomeHeader deleteTitle={deleteTitle} translateTittle={translateTittle} />

                {/* CHAT */}
                <MessageList createChat={createChat} bubbleMessage={bubbleMessage} generatePdf={generatePdf} />

                <View style={{ alignItems: 'center' }}>
                    {/* INPUT */}
                    <ChatInputBar translateInput={translateInput} pront={pront} setPront={setPront} send={() => send(fileInfo, setFileInfo)}
                    onSelectFile={() => handleSelectFile(setFileInfo)} fileInfo={fileInfo} setFileInfo={setFileInfo} />
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