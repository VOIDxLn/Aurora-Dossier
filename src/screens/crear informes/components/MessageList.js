import { ScrollView, View, Text } from 'react-native';

export default function MessageList({ createChat, bubbleMessage }) {


    return (
        <>
            {/* Chat */}
            {createChat && (<ScrollView style={{ width: '90%', marginBottom: 5 }}
                contentContainerStyle={{ gap: 5 }}>
                {bubbleMessage.map((message, index) => (
                    message.value ?
                        <View key={index}
                            style={{
                                maxWidth: '80%',
                                borderRadius: 15,
                                padding: 10,
                                alignSelf: message.author === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: message.author === 'user' ? '#6cb1ff' : '#DFDFDF'
                            }}
                        >
                            <Text>{message.value}</Text>
                        </View>
                        : null
                ))}
            </ScrollView>)}
        </>
    )
}