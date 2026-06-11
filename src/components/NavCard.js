import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NavCard({ card, onPress }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.94,
            useNativeDriver: true,
            speed: 40,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
            bounciness: 8,
        }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.cardPressable}
        >
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <View style={[styles.iconWrapper, { backgroundColor: card.bg || '#EFF6FF' }]}>
                    <MaterialCommunityIcons name={card.icon} size={36} color={card.color} />
                </View>
                <Text style={styles.cardLabel}>{card.label}</Text>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardPressable: { width: '47.5%' },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 26,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
    },
    iconWrapper: {
        width: 64, height: 64, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
    },
    cardLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
        lineHeight: 19,
    },
});
