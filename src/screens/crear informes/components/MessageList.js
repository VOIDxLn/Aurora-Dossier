import { TouchableOpacity, StyleSheet, ScrollView, View, Text } from 'react-native';

export default function MessageList({ createChat, bubbleMessage, generatePdf, onDateSelect }) {

    return (
        <>
            {createChat && (
                <ScrollView style={{ width: '90%', marginBottom: 5 }}
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

                                {message.isPicker && (
                                    <View>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#2456ee',
                                                padding: 12,
                                                borderRadius: 8,
                                                alignItems: 'center',
                                                marginTop: 8,
                                            }}
                                            onPress={() => onDateSelect && onDateSelect('seleccionar')}
                                        >
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                                📅 Seleccionar fecha
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {message.author === 'ai' && message.isPdfReport && (
                                    <TouchableOpacity
                                        style={styles.pdfButton}
                                        onPress={() => generatePdf(message.value)}
                                        activateOpacity={0.7}
                                    >
                                        <Text style={styles.pdfButtonText}>📄 Exportar informe a PDF</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            : null
                    ))}
                </ScrollView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    pdfButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#2456ee',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    pdfButtonText: {
        color: '#2456ee',
        fontSize: 12,
        fontWeight: '600',
    },
});
