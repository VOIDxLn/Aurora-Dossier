import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';

import Icons from '../../../components/Icons';

export default function ChatInputBar({ translateInput, pront, setPront, send }) {

    return <Animated.View style={{ transform: [{ translateY: Animated.multiply(translateInput, - 1) }] }}>

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