import { useState, useEffect, useCallback } from 'react';
import { Alert }             from 'react-native';
import { authService }       from '../../../services/authService';
import { novedadesService }  from '../../../services/novedadesService';
import { useUser }           from '../../../context/UserContext';

/**
 * Hook de novedades.
 *
 * Fuente de verdad para rol y empresa_id: UserContext.
 * Solo resolvemos el auth UUID directamente porque novedades_vistas.empleado_id
 * espera auth.uid(), no el id de la tabla empleados.
 */
export function useNovedades() {
    const { userData } = useUser();

    // auth.uid() — necesario para novedades_vistas FK
    const [authUserId,       setAuthUserId]       = useState(null);
    const [cargando,         setCargando]         = useState(true);

    const [listaAdmin,       setListaAdmin]       = useState([]);
    const [listaPendientes,  setListaPendientes]  = useState([]);
    const [listaCompletadas, setListaCompletadas] = useState([]);
    const [tarjetaExpandida, setTarjetaExpandida] = useState(null);
    const [vistasMap,        setVistasMap]        = useState({});

    // Resolvemos solo el UUID de Auth (no el ID de la tabla empleados)
    useEffect(() => {
        authService.getUser().then(({ data: { user } }) => {
            if (user) setAuthUserId(user.id);
            else setCargando(false);
        });
    }, []);

    /* ── Carga de datos ── */

    const cargarDatosAdmin = useCallback(async (empresaId) => {
        setCargando(true);
        try {
            const data = await novedadesService.obtenerNovedades(empresaId);
            setListaAdmin(data);
        } catch (e) {
            console.error('useNovedades.cargarDatosAdmin:', e.message);
        } finally {
            setCargando(false);
        }
    }, []);

    const cargarDatosEmpleado = useCallback(async (uid, empresaId) => {
        setCargando(true);
        try {
            const [pendientes, completadas] = await Promise.all([
                novedadesService.obtenerPendientes(uid, empresaId),
                novedadesService.obtenerCompletadas(uid),
            ]);
            setListaPendientes(pendientes);
            setListaCompletadas(completadas);
        } catch (e) {
            console.error('useNovedades.cargarDatosEmpleado:', e.message);
            Alert.alert('Error', 'No se pudieron cargar las novedades.');
        } finally {
            setCargando(false);
        }
    }, []);

    /**
     * Disparamos la carga cuando AMBAS fuentes estén listas:
     * - userData (de UserContext, que ya resolvió rol y empresa_id correctamente)
     * - authUserId (UUID de auth.users, para novedades_vistas)
     */
    useEffect(() => {
        if (!userData || !authUserId) return;

        const rol       = userData.tipo;
        const empresaId = userData.empresa_id;

        if (!empresaId) {
            console.warn('useNovedades: empresa_id ausente en userData', userData);
            setCargando(false);
            return;
        }

        if (rol === 'admin') {
            cargarDatosAdmin(empresaId);
        } else {
            cargarDatosEmpleado(authUserId, empresaId);
        }
    }, [userData, authUserId, cargarDatosAdmin, cargarDatosEmpleado]);

    /* ── Acciones ── */

    const handlePublicar = async ({ titulo, descripcion, tipo, prioridad }) => {
        if (!titulo || !descripcion) {
            Alert.alert('Error', 'Por favor llena todos los campos');
            return false;
        }
        if (!authUserId) {
            Alert.alert('Error', 'No se pudo obtener el usuario. Intenta de nuevo.');
            return false;
        }
        try {
            await novedadesService.crearNovedad({
                titulo,
                descripcion,
                tipo,
                prioridad,
                empresa_id: userData?.empresa_id,
                creado_por: authUserId,
            });
            Alert.alert('Éxito', 'Publicado correctamente');
            await cargarDatosAdmin(userData?.empresa_id);
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
        const markedItem = listaPendientes.find(n => n.id === novedadId);
        if (markedItem) {
            // Mover localmente de inmediato (UX optimista)
            setListaPendientes(prev => prev.filter(n => n.id !== novedadId));
            setListaCompletadas(prev => [{ ...markedItem, vista_at: new Date().toISOString() }, ...prev]);
        }
        // Persistimos en BD — si falla (ej: empleado sin auth_uid en tabla empleados),
        // el error se loguea pero no interrumpe al usuario
        if (authUserId) {
            novedadesService.marcarComoVisto(novedadId, authUserId)
                .catch(e => console.warn('useNovedades.handleMarcarVisto:', e.message));
        }
    };

    return {
        cargando,
        rol:             userData?.tipo ?? null,
        listaAdmin,
        listaPendientes,
        listaCompletadas,
        tarjetaExpandida,
        vistasMap,
        handlePublicar,
        handleExpandir,
        handleMarcarVisto,
    };
}
