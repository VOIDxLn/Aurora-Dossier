import { empleadoService }   from './empleadoService';
import { profileService }    from './profileService';
import { empresaService }    from './empresaService';
import { profileRepository } from '../repositories/profileRepository';

/**
 * Facade that preserves the original public API while delegating
 * to segregated single-responsibility services.
 */
export const userService = {
    fetchEmpleadoByUid:          (uid)                 => empleadoService.findByUid(uid),
    fetchEmpleadoByEmail:        (email)               => empleadoService.findByEmail(email),
    fetchProfileByUid:           (uid)                 => profileRepository.findByUid(uid),
    fetchEmpresaById:            (id)                  => empresaService.findById(id),
    getEmpleadoData:             (userId, email)       => empleadoService.resolveByAuth(userId, email),
    getAdminData:                (userId, email)       => profileService.getAdminUserData(userId, email),
    createEmpresa:               (nit, rs, dom, email) => empresaService.create(nit, rs, dom, email),
    updateProfileEmpresaAndRole: (uid, empresaId, rol) => profileService.linkEmpresaToUser(uid, empresaId, rol),
    getEmpleados:                (empresaId)           => empleadoService.getAllByEmpresa(empresaId),
    updateEmpleado:              (id, data)            => empleadoService.update(id, data),
    deleteEmpleado:              (id)                  => empleadoService.remove(id),
    createEmpleado:              (data)                => empleadoService.create(data),
    updateEmpresaData:           (id, data)            => empresaService.update(id, data),
    fetchAdminProfileAndEmpresa: (userId)              => profileService.getProfileWithEmpresa(userId),
};
