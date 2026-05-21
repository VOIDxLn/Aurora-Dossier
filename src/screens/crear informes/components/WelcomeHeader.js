import { View, Text, Animated } from 'react-native'

export default function MessageList({ deleteTitle, translateTittle }) {

    return (
        <>
            {deleteTitle && (<Animated.View style={{ marginTop: 200, transform: [{ translateY: translateTittle }] }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.tittle}>Que informe haremos hoy?</Text>
                </View>
            </Animated.View>)}
        </>
    )
}

const styles = {
    tittle: {
        color: '#5b5b5b',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center'
    },
}