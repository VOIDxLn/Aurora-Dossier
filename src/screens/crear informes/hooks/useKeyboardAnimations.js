import { View, Text, Keyboard, Animated } from 'react-native'
import { useState, useEffect, useRef } from 'react';

export function useKeyboardAnimations() {

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const translateTittle = useRef(new Animated.Value(0)).current;
    const translateInput = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', (e) => {
            const height = e.endCoordinates.height;
            Animated.timing(translateTittle, {
                toValue: -height * 0.3,
                duration: 250,
                useNativeDriver: true,
            }).start();
            Animated.timing(translateInput, {
                toValue: -height,
                duration: 250,
                useNativeDriver: true,
            }).start();
            setKeyboardVisible(true);
        });

        const hide = Keyboard.addListener('keyboardDidHide', () => {
            Animated.timing(translateTittle, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
            Animated.timing(translateInput, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
            setKeyboardVisible(false);
        });

        return () => {
            show.remove();
            hide.remove();
        }
    }, [])

    return {
        keyboardVisible,
        translateTittle,
        translateInput,
    }
}
