import { Animated, Text } from 'react-native';

export default function WelcomeHeader({ deleteTitle, translateTittle }) {
    if (!deleteTitle) return null;

    return (
        <Animated.View style={{ marginTop: 120, width: '80%' }}>
            <Text style={styles.tittle}>Para empezar, dame un titulo para este informe</Text>
        </Animated.View>
    );
}

const styles = {
    tittle: {
        color: '#5b5b5b',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
};
