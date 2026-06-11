import { profileRepository } from '../repositories/profileRepository';
import { empresaRepository } from '../repositories/empresaRepository';

export const profileService = {
    async getAdminUserData(userId, email) {
        const { data: perfil } = await profileRepository.findByUid(userId);
        if (!perfil?.empresa_id) {
            return {
                tipo:     'admin',
                nombre:   email?.split('@')[0] ?? 'Admin',
                email:    email ?? '',
                rol:      'admin',
                permisos: null,
                activo:   true,
            };
        }

        const { data: empresa } = await empresaRepository.findSummaryById(perfil.empresa_id);
        return {
            tipo:     'admin',
            nombre:   empresa?.razon_social ?? 'Administrador',
            email:    empresa?.correo ?? email,
            rol:      'admin',
            permisos: null,
            activo:   true,
        };
    },

    async getEmpresaIdByUser(userId) {
        const { data: perfil, error } = await profileRepository.findWithEmpresaByUid(userId);
        if (error) throw error;
        return perfil?.empresa_id ?? null;
    },

    async getProfileWithEmpresa(userId) {
        const { data: perfil, error: perfilError } = await profileRepository.findWithEmpresaByUid(userId);
        if (perfilError) throw perfilError;
        if (!perfil?.empresa_id) return null;

        const { data: empresa, error: empresaError } = await empresaRepository.findById(perfil.empresa_id);
        if (empresaError) throw empresaError;

        return { perfil, empresa };
    },

    linkEmpresaToUser: (userId, empresaId, rol) =>
        profileRepository.updateEmpresaAndRole(userId, empresaId, rol),

    ensureProfile: (userId, empresaId, rol) =>
        profileRepository.upsertProfile(userId, empresaId, rol),
};
