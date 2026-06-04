import { View, TextInput, TouchableOpacity } from 'react-native';

import Icons from '../../../components/Icons';
import { FileSelectorBox } from  '../UploadFiles/components/FileSelectorBox';

export default function ChatInputBar({ pront, setPront, send, onSelectFile, fileInfo, setFileInfo }) {

    return (
        <View style={{ width: '100%' }}>
            <FileSelectorBox fileInfo={fileInfo} setFileInfo={setFileInfo} />

            <View style={styles.chatBar}>
                <TouchableOpacity onPress={onSelectFile}>
                    <Icons name='paperclip' size={22} color='#2456ee' />
                </TouchableOpacity>

                <TextInput
                    onChangeText={setPront}
                    value={pront}
                    placeholder='Creemos tu informe juntos'
                    style={styles.textInput}
                />

                <TouchableOpacity onPress={send}>
                    <Icons name='send' size={24} color='#2456ee' />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = {
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
        height: 50,
    },
    textInput: {
        flex: 1,
        height: '100%',
        backgroundColor: '#dfdfdf',
        fontSize: 15,
        color: '#1a1a2e',
        paddingHorizontal: 4,
    },
}