import { supabase } from '../lib/supabase';

export const folderRepository = {
    findAllFolders: (ascending) =>
        supabase
            .from('carpetas')
            .select('id, nombre, created_at')
            .order('created_at', { ascending }),

    findAllFiles: async (ascending, userIds) => {
        const ids = Array.isArray(userIds) ? userIds : [userIds];
        const result = await supabase
            .from('informes')
            .select('id, titulo, created_at')
            .in('user_id', ids)
            .order('created_at', { ascending });
        return {
            ...result,
            data: result.data?.map(i => ({ ...i, nombre: i.titulo })) ?? null,
        };
    },

    createFolder: (nombre, empresaId) =>
        supabase.from('carpetas').insert({ nombre, empresa_id: empresaId }).select().single(),

    deleteFolders: (ids) =>
        supabase.from('carpetas').delete().in('id', ids),

    deleteFiles: (ids) =>
        supabase.from('informes').delete().in('id', ids),
};
