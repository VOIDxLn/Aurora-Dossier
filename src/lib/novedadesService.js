import { supabase } from './supabase'; 

export const novedadesService = {
    // 1. Obtener datos (Select)
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

    // 2. Crear datos (Insert) - AQUÍ ARREGLAMOS EL ERROR DE MAYÚSCULAS
    async crearNovedad(nuevaNovedad) {
        const { data, error } = await supabase
            .from('novedades')
            .insert([{
                titulo: nuevaNovedad.titulo,
                descripcion: nuevaNovedad.descripcion,
                // Forzamos minúsculas para que la base de datos no lo rechace
                tipo: nuevaNovedad.tipo.toLowerCase().trim(),
                prioridad: nuevaNovedad.prioridad.toLowerCase().trim(),
                empresa_id: nuevaNovedad.empresa_id,
                creado_por: nuevaNovedad.creado_por
            }]);
        
        if (error) throw error;
        return data;
    }
};
export default novedadesService;