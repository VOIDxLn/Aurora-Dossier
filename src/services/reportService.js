import { supabase }           from '../lib/supabase';
import { informeRepository }  from '../repositories/informeRepository';
import { empleadoRepository } from '../repositories/empleadoRepository';
import { profileRepository }  from '../repositories/profileRepository';

export const reportService = {
    /**
     * Guarda un informe.
     * 1. Resuelve el UUID real de auth.users (evita FK con IDs de otras tablas).
     * 2. Garantiza que exista un row en `profiles` antes de insertar
     *    (la FK informes_user_id_fkey → profiles.id lo requiere).
     *    Esto cubre empleados antiguos que no pasaron por el flujo de CrearUsuario.
     */
    async save(userId, titulo, contenido) {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('reportService.save: no hay sesión activa', authError?.message);
            return;
        }

        const authUserId = user.id;

        // Garantizar que el perfil existe para cumplir la FK informes_user_id_fkey → profiles.id
        const { data: perfil } = await profileRepository.findByUid(authUserId);
        if (!perfil) {
            console.log('[reportService] sin profile para', authUserId, '— buscando empleado...');

            let { data: empleado } = await empleadoRepository.findByUid(authUserId);
            console.log('[reportService] porUid:', empleado?.id ?? 'null');

            if (!empleado && user.email) {
                const { data: porEmail } = await empleadoRepository.findByEmail(user.email);
                console.log('[reportService] porEmail:', porEmail?.id ?? 'null', '| empresa_id:', porEmail?.empresa_id ?? 'null');
                empleado = porEmail;
            }

            if (empleado?.empresa_id) {
                const { error: pErr } = await profileRepository.upsertProfile(
                    authUserId,
                    empleado.empresa_id,
                    empleado.rol ?? 'empleado',
                    empleado.email || user.email,
                    empleado.nombre
                );
                if (pErr) {
                    console.error('[reportService] upsertProfile FALLÓ:', pErr.message, '| code:', pErr.code);
                } else {
                    console.log('[reportService] profile creado OK para', authUserId);
                }
            } else {
                console.warn('[reportService] sin empresa_id — no se puede crear profile. empleado:', JSON.stringify(empleado));
            }
        }

        const { error } = await informeRepository.create(authUserId, titulo, contenido);
        if (error) console.error('reportService.save:', error.message);
    },

    getByUser: (userId) => informeRepository.findAllByUser(userId),

    deleteById: (id) => informeRepository.deleteById(id),
};

