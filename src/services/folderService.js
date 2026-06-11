import { folderRepository } from '../repositories/folderRepository';

export const folderService = {
    obtenerCarpetas: (sortLatest)           => folderRepository.findAllFolders(!sortLatest),
    obtenerArchivos: (sortLatest, userIds)  => folderRepository.findAllFiles(!sortLatest, userIds),
    crearCarpeta:    (nombre, empresaId)    => folderRepository.createFolder(nombre, empresaId),
    eliminarCarpetas:(ids)                  => folderRepository.deleteFolders(ids),
    eliminarArchivos:(ids)                  => folderRepository.deleteFiles(ids),
};

export default folderService;
