import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { authService }    from '../../../services/authService';
import { userService }    from '../../../services/userService';
import { novedadesService } from '../../../services/novedadesService';

export function useNovedades() {
    const [userId,     setUserId]     = useState(null);
    const [rol,        setRol]        = useState(null);
    const [empresaId,  setEmpresaId]  = useState(null);
    const [cargando,   setCargando]   = useState(true);

    const [listaAdmin,       setListaAdmin]       = useState([]);
    const [listaPendientes,  setListaPendientes]  = useState([]);
    const [listaCompletadas, setListaCompletadas] = useState([]);
    const [tarjetaExpandida, setTarjetaExpandida] = useState(null);
    const [vistasMap,        setVistasMap]        = useState({});

    const cargarDatosAdmin = useCallback(async (empId) => {
        setCargando(true);
        const data = await novedadesService.obtenerNovedades(empId);
        setListaAdmin(data);
        setCargando(false);
    }, []);

    const cargarDatosEmpleado = useCallback(async (uid, empId) => {
        try {
            const [pendientes, completadas] = await Promise.all([
                novedadesService.obtenerPendientes(uid, empId),
                novedadesService.obtenerCompletadas(uid),
            ]);
            setListaPendientes(pendientes);
            setListaCompletadas(completadas);
        } catch {
            Alert.alert('Error', 'No se pudieron cargar las novedades.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await authService.getUser();
            if (!user) { setCargando(false); return; }

            setUserId(user.id);

            const { data: perfil }   = await userService.fetchProfileByUid(user.id);
            let userRol     = perfil?.rol;
            let userEmpresa = perfil?.empresa_id;

            if (!userRol) {
                const { data: empleado } = await userService.fetchEmpleadoByUid(user.id);
                if (empleado) {
                    userRol     = empleado.rol;
                    userEmpresa = empleado.empresa_id;
                }
            }

            userRol = userRol ?? 'empleado';
            setRol(userRol);
            setEmpresaId(userEmpresa);

            if (userRol === 'admin') {
                await cargarDatosAdmin(userEmpresa);
            } else {
                await cargarDatosEmpleado(user.id, userEmpresa);
            }
        };
        init();
    }, [cargarDatosAdmin, cargarDatosEmpleado]);

    const handlePublicar = async ({ titulo, descripcion, tipo, prioridad }) => {
        if (!titulo || !descripcion) {
            Alert.alert('Error', 'Por favor llena todos los campos');
            return false;
        }
        if (!userId) {
            Alert.alert('Error', 'No se pudo obtener el usuario. Intenta de nuevo.');
            return false;
        }

        try {
            await novedadesService.crearNovedad({ titulo, descripcion, tipo, prioridad, empresa_id: empresaId, creado_por: userId });
            Alert.alert('Éxito', 'Publicado correctamente');
            await cargarDatosAdmin(empresaId);
            return true;
        } catch (error) {
            Alert.alert('Error al publicar', error.message);
            return false;
        }
    };

    const handleExpandir = async (novedadId) => {
        if (tarjetaExpandida === novedadId) {
            setTarjetaExpandida(null);
            return;
        }
        setTarjetaExpandida(novedadId);
        if (!vistasMap[novedadId]) {
            const vistas = await novedadesService.obtenerVistasNovedad(novedadId);
            setVistasMap(prev => ({ ...prev, [novedadId]: vistas }));
        }
    };

    const handleMarcarVisto = async (novedadId) => {
        try {
            await novedadesService.marcarComoVisto(novedadId, userId);
            setListaPendientes(prev => prev.filter(n => n.id !== novedadId));
        } catch {
            Alert.alert('Error', 'No se pudo marcar la novedad como vista.');
        }
    };

    return {
        cargando, rol, listaAdmin,
        listaPendientes, listaCompletadas,
        tarjetaExpandida, vistasMap,
        handlePublicar, handleExpandir, handleMarcarVisto,
    };
}
