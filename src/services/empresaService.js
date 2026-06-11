import { empresaRepository } from '../repositories/empresaRepository';

export const empresaService = {
    create: (nit, razonSocial, domicilio, email) =>
        empresaRepository.create(nit, razonSocial, domicilio, email),

    update: (id, data) =>
        empresaRepository.update(id, data),

    findById: (id) =>
        empresaRepository.findById(id),
};
