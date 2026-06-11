import { supabase } from '../lib/supabase';

export const novedadRepository = {
    findAllByEmpresa: (empresaId) =>
        supabase
            .from('novedades')
            .select('*, novedades_vistas(completada)')
            .eq('empresa_id', empresaId)
            .order('created_at', { ascending: false }),

    findPendingByEmpresa: (empresaId) =>
        supabase
            .from('novedades')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('created_at', { ascending: false }),

    findCompletedByUser: (userId) =>
        supabase
            .from('novedades_vistas')
            .select('novedad_id, vista_at, novedades(*)')
            .eq('empleado_id', userId)
            .eq('completada', true),

    findViewsByNovedad: (novedadId) =>
        supabase
            .from('novedades_vistas')
            .select('empleado_id, vista_at, profiles(nombre, email)')
            .eq('novedad_id', novedadId)
            .eq('completada', true),

    findCompletedIdsByUser: (userId) =>
        supabase
            .from('novedades_vistas')
            .select('novedad_id')
            .eq('empleado_id', userId)
            .eq('completada', true),

    create: (novedad) =>
        supabase.from('novedades').insert([{
            titulo:     novedad.titulo,
            descripcion: novedad.descripcion,
            tipo:       novedad.tipo.toLowerCase().trim(),
            prioridad:  novedad.prioridad.toLowerCase().trim(),
            empresa_id: novedad.empresa_id,
            creado_por: novedad.creado_por,
        }]),

    findTiposByEmpresa: (empresaId) =>
        supabase.from('novedades').select('tipo').eq('empresa_id', empresaId),

    findPendingViewsByUser: (userId) =>
        supabase.from('novedades_vistas').select('completada').eq('empleado_id', userId).eq('completada', false),

    markAsViewed: (novedadId, userId) =>
        supabase.from('novedades_vistas').upsert(
            {
                novedad_id:  novedadId,
                empleado_id: userId,
                completada:  true,
                vista_at:    new Date().toISOString(),
            },
            { onConflict: 'novedad_id,empleado_id' }
        ),
};
