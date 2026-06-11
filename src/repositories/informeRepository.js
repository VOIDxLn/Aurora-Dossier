import { supabase } from '../lib/supabase';

export const informeRepository = {
    findAllByUser: (userId) =>
        supabase
            .from('informes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false }),

    create: (userId, titulo, contenido) =>
        supabase.from('informes').insert({
            user_id:          userId,
            titulo,
            informe_generado: contenido,
            estado:           'completado',
            created_at:       new Date().toISOString(),
        }),

    deleteById: (id) =>
        supabase.from('informes').delete().eq('id', id),

    findByUserIds: (userIds) =>
        supabase.from('informes').select('estado').in('user_id', userIds),
};
