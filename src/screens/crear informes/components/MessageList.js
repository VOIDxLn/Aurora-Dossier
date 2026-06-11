import { View, TouchableOpacity, StyleSheet, ScrollView, Text } from 'react-native';

export default function MessageList({ createChat, bubbleMessage, generatePdf, deleteLoadingMessage, setDeleteLoadingMessage, onDateSelect }) {
    return (
        <View style={styles.container}>
            {createChat && (
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {bubbleMessage.map((message, index) =>
                        message.value ? (
                            <View
                                key={index}
                                style={[
                                    styles.bubble,
                                    message.author === 'user' ? styles.bubbleUser : styles.bubbleAi,
                                ]}
                            >
                                {typeof message.value === 'string'
                                    ? <Text>{message.value}</Text>
                                    : message.value
                                }

                                {message.isPicker && (
                                    <TouchableOpacity
                                        style={styles.dateBtn}
                                        onPress={() => onDateSelect && onDateSelect('seleccionar')}
                                    >
                                        <Text style={styles.dateBtnText}>📅 Seleccionar fecha</Text>
                                    </TouchableOpacity>
                                )}

                                {message.author === 'ai' && message.isPdfReport && (
                                    <TouchableOpacity
                                        style={styles.pdfButton}
                                        onPress={() => generatePdf(message.value)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.pdfButtonText}>📄 Exportar informe a PDF</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : null
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        gap: 5,
        paddingVertical: 8,
    },
    bubble: {
        maxWidth: '80%',
        borderRadius: 15,
        padding: 10,
    },
    bubbleUser: {
        alignSelf: 'flex-end',
        backgroundColor: '#6cb1ff',
    },
    bubbleAi: {
        alignSelf: 'flex-start',
        backgroundColor: '#DFDFDF',
    },
    dateBtn: {
        backgroundColor: '#2456ee',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    dateBtnText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pdfButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#2456ee',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'center',
        elevation: 1,
    },
    pdfButtonText: {
        color: '#2456ee',
        fontSize: 12,
        fontWeight: '600',
    },
});
