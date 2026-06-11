import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { authService }  from '../../../services/authService';
import { reportService } from '../../../services/reportService';

export function useInformes() {
    const [informes,   setInformes]   = useState([]);
    const [cargando,   setCargando]   = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const cargar = useCallback(async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setCargando(true);
        try {
            const { data: { user } } = await authService.getUser();
            if (!user) return;

            const { data, error } = await reportService.getByUser(user.id);
            if (error) throw error;
            setInformes(data ?? []);
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setCargando(false);
            setRefreshing(false);
        }
    }, []);

    const eliminar = useCallback((informe, onConfirm) => {
        Alert.alert(
            'Eliminar informe',
            `¿Eliminar "${informe.titulo}"? Esta acción no se puede deshacer.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await reportService.deleteById(informe.id);
                        if (error) {
                            Alert.alert('Error', error.message);
                        } else {
                            setInformes(prev => prev.filter(i => i.id !== informe.id));
                            onConfirm?.();
                        }
                    },
                },
            ]
        );
    }, []);

    return { informes, cargando, refreshing, cargar, eliminar };
}
