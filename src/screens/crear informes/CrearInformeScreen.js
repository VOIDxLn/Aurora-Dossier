import { useState } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';

import MenuBar from '../../components/MenuBar';
import DrawerMenu from '../../components/DrawerMenu'; // Asegúrate de que este import exista si lo usas abajo

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
    const { handleSelectFile } = useFile();

    const { pront,
        bubbleMessage,
        deleteTitle,
        createChat,
        setPront,
        send } = useChatService();

    const { keyboardVisible,
        translateTittle,
        translateInput } = useKeyboardAnimations();

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
                style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}
            >
                {/* TITLE */}
                <WelcomeHeader deleteTitle={deleteTitle} translateTittle={translateTittle} />

                {/* CHAT */}
                <MessageList createChat={createChat} bubbleMessage={bubbleMessage} />

                <View style={{ alignItems: 'center' }}>
                    {/* INPUT */}
                    <ChatInputBar 
                        translateInput={translateInput} 
                        pront={pront} 
                        setPront={setPront} 
                        send={() => send(fileInfo, setFileInfo)}
                        onSelectFile={() => handleSelectFile(setFileInfo)} 
                        fileInfo={fileInfo} 
                        setFileInfo={setFileInfo} 
                    />
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