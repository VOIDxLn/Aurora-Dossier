import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';

import Icons from '../../../components/Icons';
import { FileSelectorBox } from  '../UploadFiles/components/FileSelectorBox';

export default function ChatInputBar({ translateInput, pront, setPront, send, onSelectFile, onSelectFecha, fileInfo, setFileInfo }) {

    return <Animated.View style={{ transform: [{ translateY: Animated.multiply(translateInput, - 1) }] }}>

        <FileSelectorBox fileInfo={fileInfo} setFileInfo={setFileInfo} />

        <View style={styles.chatBar}>
            <TouchableOpacity onPress={onSelectFile}>
                <Icons name='paperclip' size={22} color='#2456ee' />
            </TouchableOpacity>

            <TouchableOpacity onPress={onSelectFecha}>
                <Icons name='calendar' size={22} color='#2456ee' />
            </TouchableOpacity>

            <TextInput
                onChangeText={setPront} value={pront}
                placeholder='Creemos tu informe juntos' style={styles.textInput}>
            </TextInput>

            <TouchableOpacity onPress={send}>
                <Icons name='send' size={24} color='#2456ee' />
            </TouchableOpacity>
        </View>
    </Animated.View>
}

const styles = {
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
    textInput: {
        width: '78%',
        height: 45,
        backgroundColor: '#dfdfdf',
    },
}