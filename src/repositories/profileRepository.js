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

    upsertProfile: (uid, empresaId, rol) =>
        supabase.from('profiles').upsert({ id: uid, empresa_id: empresaId, rol }, { onConflict: 'id' }),
};
