import { PermissionRepository } from "~/domains/permission/permission.repository.js";
import { CreatePermissionBodyDTO, UpdatePermissionBodyDTO } from "~/domains/permission/permission.type.js";
import { CustomException } from "~/exceptions/custom-exception.js";

export class PermissionService {
  static findAll = async () => {
    return PermissionRepository.findAll();
  };

  static findOneById = async (id: number) => {
    const result = PermissionRepository.findTopById(id);
    if (!result) {
      throw new CustomException("permission.error.not_found", 404);
    }
    return result;
  };

  static create = async (requestDTO: CreatePermissionBodyDTO) => {
    if (!requestDTO.code.startsWith("ROLE_PERM_")) {
      requestDTO.code = "ROLE_PERM_" + requestDTO.code;
    }
    const isCodeDuplicated = await PermissionRepository.existByCode(requestDTO.code);
    if (isCodeDuplicated) {
      throw new CustomException("permission.error.duplicated_code", 409);
    }
    return PermissionRepository.save(requestDTO);
  };

  static update = async (requestDTO: UpdatePermissionBodyDTO) => {
    const isIdValid = await PermissionRepository.existById(requestDTO.id);
    if (!isIdValid) {
      throw new CustomException("permission.error.not_found", 404);
    }
    return PermissionRepository.update(requestDTO);
  };
}
