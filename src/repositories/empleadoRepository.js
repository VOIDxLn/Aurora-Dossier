import { supabase } from '../lib/supabase';

export const empleadoRepository = {
    findByUid: (uid) =>
        supabase.from('empleados').select('*').eq('auth_uid', uid).maybeSingle(),

    findByEmail: (email) =>
        supabase.from('empleados').select('*').eq('email', email).maybeSingle(),

    findAllForMapping: () =>
        supabase.from('empleados').select('auth_uid, nombre'),

    findAllByEmpresa: (empresaId) =>
        supabase
            .from('empleados')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('created_at', { ascending: false }),

    create: (data) =>
        supabase.from('empleados').insert([data]),

    update: (id, data) =>
        supabase.from('empleados').update(data).eq('id', id),

    remove: (id) =>
        supabase.from('empleados').delete().eq('id', id),
};
