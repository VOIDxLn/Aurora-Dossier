import { useState }                                                        from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../constants/colors';

export default function NuevaNovedadModal({ visible, onPublicar, onClose }) {
    const [titulo,      setTitulo]      = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipo,        setTipo]        = useState('novedad');
    const [prioridad,   setPrioridad]   = useState('media');

    const handlePublicar = () => {
        onPublicar({ titulo, descripcion, tipo, prioridad });
        setTitulo('');
        setDescripcion('');
        setTipo('novedad');
        setPrioridad('media');
    };

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.container}>
                <Text style={styles.title}>Nueva Novedad/Tarea</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Título"
                    value={titulo}
                    onChangeText={setTitulo}
                />
                <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="Descripción"
                    multiline
                    value={descripcion}
                    onChangeText={setDescripcion}
                />

                <Text style={styles.label}>Tipo:</Text>
                <View style={styles.row}>
                    {['novedad', 'tarea', 'aviso'].map(t => (
                        <TouchableOpacity
                            key={t}
                            onPress={() => setTipo(t)}
                            style={[styles.choice, tipo === t && styles.choiceActive]}
                        >
                            <Text style={tipo === t ? styles.choiceActiveText : {}}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Prioridad:</Text>
                <View style={styles.row}>
                    {['alta', 'media', 'baja'].map(p => (
                        <TouchableOpacity
                            key={p}
                            onPress={() => setPrioridad(p)}
                            style={[styles.choice, prioridad === p && styles.choiceActive]}
                        >
                            <Text style={prioridad === p ? styles.choiceActiveText : {}}>{p}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.btnPublicar} onPress={handlePublicar}>
                    <Text style={styles.btnText}>Publicar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container:        { flex: 1, padding: 30, justifyContent: 'center' },
    title:            { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input:            { backgroundColor: '#f9fafb', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    textarea:         { height: 100 },
    label:            { fontWeight: 'bold', marginBottom: 10 },
    row:              { flexDirection: 'row', marginBottom: 20, justifyContent: 'space-between' },
    choice:           { padding: 10, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, flex: 1, alignItems: 'center', marginHorizontal: 2 },
    choiceActive:     { backgroundColor: COLORS.primary },
    choiceActiveText: { color: 'white' },
    btnPublicar:      { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
    btnText:          { color: 'white', fontWeight: 'bold' },
    cancelText:       { textAlign: 'center', color: COLORS.danger, marginTop: 20 },
});
