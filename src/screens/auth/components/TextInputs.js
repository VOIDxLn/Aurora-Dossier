import { StyleSheet, View, TextInput } from 'react-native';
import { useState } from 'react';

export default function TextInputs(props) {

    const [focused, setFocused] = useState(false);

    return <TextInput onFocus={() => { setFocused(true) }} onBlur={() => { setFocused(false) }}
        style={[styles.input, focused &&
            { borderColor: "#2456ee" }]} 
        
        onChangeText={(text) => props.onChangeText(text)}

        placeholder={props.placeholder}
        secureTextEntry={props.security}
        autoCapitalize={props.autoCapitalize}
        keyboardType={props.keyboardType}
        autoCorrect={props.autoCorrect}
        />
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