import { StyleSheet, View, TextInput } from 'react-native';
import { useState } from 'react';

export default function TextInputs(props) {

    const [focused, setFocused] = useState(false);

    return <TextInput onFocus={() => { setFocused(true) }} onBlur={() => { setFocused(false) }}
        placeholder={props.placeholder} style={[styles.input, focused &&
            { borderColor: "#2456ee" }]} />
}

const styles = StyleSheet.create({
    input: {
        width: '80%',
        height: 55,
        borderColor: '#5b5b5b',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
})