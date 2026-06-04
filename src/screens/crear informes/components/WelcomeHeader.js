import { View, Text } from 'react-native'

export default function WelcomeHeader({ deleteTitle }) {

    return (
        <>
            {deleteTitle && (
                <View style={{ marginTop: 120, width: '80%' }}>
                    <Text style={styles.tittle}>¿Qué informe haremos hoy?</Text>
                </View>
            )}
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