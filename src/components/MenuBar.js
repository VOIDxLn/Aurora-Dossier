import { View } from 'react-native';

import Icons from './Icons';
import Logo from './Logo';

export default function MenuBar() {

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 }}>
            <View>
                <Icons name='menu' size={45} color='#5b5b5b' />
            </View>
            <View>
                <Logo width={45} height={45} />
            </View>
        </View>
    )
}