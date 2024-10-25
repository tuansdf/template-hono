import { permissionRepository } from "~/domains/permission/permission.repository";
import { CreatePermissionBodyDTO, UpdatePermissionBodyDTO } from "~/domains/permission/permission.type";
import { CustomException } from "~/exceptions/custom-exception";

class PermissionService {
  public async findAll() {
    return await permissionRepository.findAll();
  }

  public async findOneById(id: number) {
    const result = await permissionRepository.findTopById(id);
    if (!result) {
      throw new CustomException("dynamic.error.not_found;field.permission", 404);
    }
    return result;
  }

  public async create(requestDTO: CreatePermissionBodyDTO) {
    if (!requestDTO.code.startsWith("PERM_")) {
      requestDTO.code = "PERM_" + requestDTO.code;
    }
    const isCodeDuplicated = await permissionRepository.existByCode(requestDTO.code);
    if (isCodeDuplicated) {
      throw new CustomException("dynamic.error.duplicated;field.code", 409);
    }
    return await permissionRepository.save(requestDTO);
  }

  public async update(requestDTO: UpdatePermissionBodyDTO) {
    const isIdValid = await permissionRepository.existById(requestDTO.id);
    if (!isIdValid) {
      throw new CustomException("dynamic.error.not_found;field.permission", 404);
    }
    return await permissionRepository.update(requestDTO);
  }
}

export const permissionService = new PermissionService();
