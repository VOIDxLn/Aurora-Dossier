import { supabase } from '../lib/supabase';

export const profileRepository = {
    findByUid: (uid) =>
        supabase.from('profiles').select('rol, empresa_id').eq('id', uid).maybeSingle(),

    findWithEmpresaByUid: (uid) =>
        supabase.from('profiles').select('empresa_id').eq('id', uid).maybeSingle(),

    updateEmpresaAndRole: (uid, empresaId, rol) =>
        supabase.from('profiles').update({ empresa_id: empresaId, rol }).eq('id', uid),

    findByEmpresaId: (empresaId) =>
        supabase.from('profiles').select('id').eq('empresa_id', empresaId),

    upsertProfile: (uid, empresaId, rol, email) => {
        const data = { id: uid, empresa_id: empresaId, rol };
        if (email) data.email = email;
        return supabase.from('profiles').upsert(data, { onConflict: 'id' });
    },
};
