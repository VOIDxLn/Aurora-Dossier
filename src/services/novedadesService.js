import { supabase } from '../lib/supabase';

export const novedadesService = {
    async obtenerNovedades(empresaId) {
        const { data, error } = await supabase
            .from('novedades')
            .select(`
                *,
                novedades_vistas (
                    completada
                )
            `)
            .eq('empresa_id', empresaId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error al obtener:", error);
            return [];
        }
        return data;
    },

    async crearNovedad(nuevaNovedad) {
        const { data, error } = await supabase
            .from('novedades')
            .insert([{
                titulo: nuevaNovedad.titulo,
                descripcion: nuevaNovedad.descripcion,
                tipo: nuevaNovedad.tipo.toLowerCase().trim(),
                prioridad: nuevaNovedad.prioridad.toLowerCase().trim(),
                empresa_id: nuevaNovedad.empresa_id,
                creado_por: nuevaNovedad.creado_por
            }]);
        
        if (error) throw error;
        return data;
    },

    async obtenerPendientes(userId, empresaId) {
        const [{ data: todasNovedades, error: errNovedades }, { data: vistas, error: errVistas }] = await Promise.all([
            supabase.from('novedades').select('*').eq('empresa_id', empresaId).order('created_at', { ascending: false }),
            supabase.from('novedades_vistas').select('novedad_id').eq('empleado_id', userId).eq('completada', true),
        ]);

        if (errNovedades) throw errNovedades;
        if (errVistas) throw errVistas;

        const idsCompletadas = new Set((vistas || []).map(v => v.novedad_id));
        return (todasNovedades || []).filter(n => !idsCompletadas.has(n.id));
    },

    async obtenerCompletadas(userId) {
        const { data, error } = await supabase
            .from('novedades_vistas')
            .select('novedad_id, vista_at, novedades(*)')
            .eq('empleado_id', userId)
            .eq('completada', true);

        if (error) throw error;
        return (data || []).map(v => ({ ...v.novedades, vista_at: v.vista_at }));
    },

    async marcarComoVisto(novedadId, userId) {
        const { data, error } = await supabase
            .from('novedades_vistas')
            .upsert({
                novedad_id: novedadId,
                empleado_id: userId,
                completada: true,
                vista_at: new Date().toISOString(),
            }, { onConflict: 'novedad_id,empleado_id' });

        if (error) throw error;
        return data;
    },

    async obtenerVistasNovedad(novedadId) {
        const { data, error } = await supabase
            .from('novedades_vistas')
            .select('empleado_id, vista_at, profiles(nombre, email)')
            .eq('novedad_id', novedadId)
            .eq('completada', true);

        if (error) throw error;
        return data || [];
    }
};

export default novedadesService;
