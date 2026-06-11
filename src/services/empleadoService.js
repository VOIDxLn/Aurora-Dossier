import { empleadoRepository } from '../repositories/empleadoRepository';

export const empleadoService = {
    async resolveByAuth(userId, email) {
        const { data: porUid } = await empleadoRepository.findByUid(userId);
        if (porUid) return porUid;

        const { data: porEmail } = await empleadoRepository.findByEmail(email);
        return porEmail ?? null;
    },

    findByUid:     (uid)          => empleadoRepository.findByUid(uid),
    findByEmail:   (email)        => empleadoRepository.findByEmail(email),
    getAllByEmpresa:(empresaId)    => empleadoRepository.findAllByEmpresa(empresaId),
    create:        (data)         => empleadoRepository.create(data),
    update:        (id, data)     => empleadoRepository.update(id, data),
    remove:        (id)           => empleadoRepository.remove(id),
};
