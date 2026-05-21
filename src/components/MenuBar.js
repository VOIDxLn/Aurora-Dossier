import { View, TouchableOpacity } from 'react-native';

import Icons from './Icons';
import Logo from './Logo';

export default function MenuBar({ onPressMenu }) {

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 }}>
            <TouchableOpacity onPress={onPressMenu}>
                <Icons name='menu' size={45} color='#5b5b5b' />
            </TouchableOpacity>
            <View>
                <Logo width={45} height={45} />
            </View>
        </View>
    )
}