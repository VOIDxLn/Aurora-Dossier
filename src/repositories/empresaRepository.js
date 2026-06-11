import { supabase } from '../lib/supabase';

export const empresaRepository = {
    findById: (id) =>
        supabase.from('empresas').select('*').eq('id', id).single(),

    findSummaryById: (id) =>
        supabase.from('empresas').select('razon_social, correo').eq('id', id).maybeSingle(),

    create: (nit, razonSocial, domicilio, email) =>
        supabase
            .from('empresas')
            .insert([{ nit, razon_social: razonSocial, domicilio_fiscal: domicilio, correo: email }])
            .select()
            .single(),

    update: (id, data) =>
        supabase.from('empresas').update(data).eq('id', id),
};
