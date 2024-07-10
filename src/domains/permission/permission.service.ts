import { permissionRepository } from "~/domains/permission/permission.repository";
import { CreatePermissionBodyDTO, UpdatePermissionBodyDTO } from "~/domains/permission/permission.type";
import { CustomException } from "~/exceptions/custom-exception";

class PermissionService {
  public findAll = async () => {
    return permissionRepository.findAll();
  };

  public findOneById = async (id: number) => {
    const result = permissionRepository.findTopById(id);
    if (!result) {
      throw new CustomException("dynamic.error.not_found:::field.permission", 404);
    }
    return result;
  };

  public create = async (requestDTO: CreatePermissionBodyDTO) => {
    if (!requestDTO.code.startsWith("ROLE_PERM_")) {
      requestDTO.code = "ROLE_PERM_" + requestDTO.code;
    }
    const isCodeDuplicated = await permissionRepository.existByCode(requestDTO.code);
    if (isCodeDuplicated) {
      throw new CustomException("dynamic.error.duplicated:::field.code", 409);
    }
    return permissionRepository.save(requestDTO);
  };

  public update = async (requestDTO: UpdatePermissionBodyDTO) => {
    const isIdValid = await permissionRepository.existById(requestDTO.id);
    if (!isIdValid) {
      throw new CustomException("dynamic.error.not_found:::field.permission", 404);
    }
    return permissionRepository.update(requestDTO);
  };
}

export const permissionService = new PermissionService();
