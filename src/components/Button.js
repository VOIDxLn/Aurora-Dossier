import { StyleSheet, Pressable, Text } from 'react-native';

export default function Button(props) {

    return <Pressable
        style={({ pressed }) => (
            {
                backgroundColor: pressed ? props.pressedButtonColor : props.buttonColor,
                width: props.width,
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
                marginTop: props.marginTop,
            }
        )}>
        {({ pressed }) => (
            <Text style={props.buttonStyle}>{props.buttonText}</Text>
        )}
    </Pressable>
}