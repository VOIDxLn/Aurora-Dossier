import { supabase } from '../lib/supabase';

export const folderService = {
    async obtenerCarpetas(sortLatest) {
        return await supabase
            .from('carpetas')
            .select('id, nombre, created_at')
            .order('created_at', { ascending: !sortLatest });
    },

    async obtenerArchivos(sortLatest) {
        return await supabase
            .from('archivos')
            .select('id, nombre, created_at')
            .order('created_at', { ascending: !sortLatest });
    },

    async eliminarCarpetas(ids) {
        return await supabase
            .from('carpetas')
            .delete()
            .in('id', ids);
    },

    async eliminarArchivos(ids) {
        return await supabase
            .from('archivos')
            .delete()
            .in('id', ids);
    }
};

export default folderService;
