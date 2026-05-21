import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

export function useFile() {

    const handleSelectFile = async (setFileInfo) => {
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: [
                    'image/*',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                ], copyToCacheDirectory: true
            });

            if (res.canceled) {
                return;
            }

            let fileUri = '';
            let fileName = 'archivo seleccionado';
            let fileSize = 0;
            let fileType = 'application/octet-stream';

            if (res.assets && res.assets.length > 0) {
                fileUri = res.assets[0].uri;
                fileName = res.assets[0].name;
                fileSize = res.assets[0].size;
                fileType = res.assets[0].mimeType || res.assets[0].type;
            } else {
                fileUri = res.uri;
                fileName = res.name;
                fileSize = res.size;
                fileType = res.type;
            }

            if (!fileUri) {
                console.log('No se pudo detectar ningun uri valida en el archivo');
                return;
            }

            console.log("Procesando Base64 para el archivo", fileName);

            const base64Data = await FileSystem.readAsStringAsync(fileUri, {
                encoding: 'base64',
            });

            setFileInfo(
                {
                    uri: fileUri,          
                    mimeType: fileType,   
                    name: fileName,        
                    size: fileSize,        
                    base64: base64Data,
                }
            )
        } catch (err) {
            console.log("Error al seleccionar archivo: ", err)
            setFileInfo(null)
        }
    };

    return { handleSelectFile };
}