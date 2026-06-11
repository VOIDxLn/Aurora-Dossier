import { StyleSheet, Pressable, Animated } from 'react-native';
import { useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BottomNavItem({ item, active, onPress }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, speed: 50 }),
            Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 25, bounciness: 10 }),
        ]).start();
        onPress?.();
    };

    return (
        <Pressable style={styles.navItem} onPress={handlePress}>
            <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
                <MaterialCommunityIcons
                    name={item.icon}
                    size={26}
                    color={active ? '#2456ee' : '#9CA3AF'}
                />
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
