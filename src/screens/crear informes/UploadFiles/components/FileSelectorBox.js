import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Material from 'react-native-vector-icons/MaterialCommunityIcons';

export function FileSelectorBox({ fileInfo, setFileInfo }) {


    const getIconName = (fileName) => {
        if (!fileName) return 'upload';
        const nameLower = fileName.toLowerCase();

        if (nameLower.includes('.pdf')) return 'file-pdf-box';
        if (nameLower.includes('.doc') || nameLower.includes('.docx')) return 'file-word';
        if (nameLower.includes('.xls') || nameLower.includes('.xlsx')) return 'file-excel';
        if (nameLower.includes('.ppt') || nameLower.includes('.pptx')) return 'file-powerpoint';
        if (nameLower.includes('.jpg') || nameLower.includes('.jpeg') || nameLower.includes('.png')) return 'file-image';

        return 'file-document-outline';
    }

    if (!fileInfo) return null;


    return (
        <View style={styles.boxContainer}>
            <Material name={getIconName(fileInfo.name)} size={28} color="#2456ee" />

            <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.fileName}>
                    {fileInfo.name}
                </Text>
                <Text style={styles.fileSize}>
                    {(fileInfo.size / (1024 * 1024)).toFixed(2)} MB
                </Text>
            </View>

            <TouchableOpacity onPress={() => setFileInfo(null)}>
                <Material name="close-circle" size={20} color="#ff4d4d" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    boxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6efff',
        padding: 10,
        borderRadius: 10,
        width: '90%',
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#6cb1ff',
        alignSelf: 'center'
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    fileName: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '600',
    },
    fileSize: {
        fontSize: 11,
        color: '#6b7280',
    }
});