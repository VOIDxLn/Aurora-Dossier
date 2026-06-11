import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { authService }    from '../../../services/authService';
import { profileService } from '../../../services/profileService';
import { empleadoService } from '../../../services/empleadoService';

export function useUserManagement() {
    const [empleados,       setEmpleados]       = useState([]);
    const [loading,         setLoading]         = useState(true);
    const [refreshing,      setRefreshing]      = useState(false);
    const [editingEmpleado, setEditingEmpleado] = useState(null);

    const cargarEmpleados = useCallback(async () => {
        try {
            const { data: { user } } = await authService.getUser();
            const empresaId = await profileService.getEmpresaIdByUser(user.id);

            const { data, error } = await empleadoService.getAllByEmpresa(empresaId);
            if (error) throw error;
            setEmpleados(data ?? []);
        } catch {
            Alert.alert('Error', 'No se pudo cargar la lista de usuarios.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { cargarEmpleados(); }, [cargarEmpleados]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        cargarEmpleados();
    }, [cargarEmpleados]);

    const toggleActivo = async (empleado) => {
        const nuevoActivo = !empleado.activo;
        setEmpleados(prev => prev.map(e => e.id === empleado.id ? { ...e, activo: nuevoActivo } : e));

        const { error } = await empleadoService.update(empleado.id, { activo: nuevoActivo });
        if (error) {
            setEmpleados(prev => prev.map(e => e.id === empleado.id ? { ...e, activo: empleado.activo } : e));
            Alert.alert('Error', 'No se pudo actualizar el estado.');
        }
    };

    const togglePermiso = async (key) => {
        if (!editingEmpleado) return;

        const permsActuales = editingEmpleado.permisos ?? {};
        const nuevosPerms   = { ...permsActuales, [key]: !permsActuales[key] };
        const updated       = { ...editingEmpleado, permisos: nuevosPerms };

        setEditingEmpleado(updated);
        setEmpleados(prev => prev.map(e => e.id === editingEmpleado.id ? updated : e));

        const { error } = await empleadoService.update(editingEmpleado.id, { permisos: nuevosPerms });
        if (error) {
            setEditingEmpleado(editingEmpleado);
            setEmpleados(prev => prev.map(e => e.id === editingEmpleado.id ? editingEmpleado : e));
            Alert.alert('Error', 'No se pudo actualizar el permiso.');
        }
    };

    const handleEliminar = (empleado) => {
        Alert.alert(
            'Eliminar usuario',
            `¿Deseas eliminar a ${empleado.nombre}?\nEsta acción no se puede deshacer.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar', style: 'destructive',
                    onPress: async () => {
                        const { error } = await empleadoService.remove(empleado.id);
                        if (!error) setEmpleados(prev => prev.filter(e => e.id !== empleado.id));
                        else Alert.alert('Error', 'No se pudo eliminar el usuario.');
                    },
                },
            ]
        );
    };

    return {
        empleados,
        loading,
        refreshing,
        editingEmpleado,
        setEditingEmpleado,
        onRefresh,
        toggleActivo,
        togglePermiso,
        handleEliminar,
    };
}
