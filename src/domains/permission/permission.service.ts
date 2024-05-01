import { PermissionRepository } from "~/domains/permission/permission.repository.js";
import { CreatePermissionBodyDTO, UpdatePermissionBodyDTO } from "~/domains/permission/permission.type.js";
import { CustomException } from "~/exceptions/custom-exception.js";
import { TFn } from "~/i18n/i18n.type.js";

export class PermissionService {
  static findAll = async () => {
    return PermissionRepository.findAll();
  };

  static findOneById = async (id: number, t: TFn) => {
    const result = PermissionRepository.findTopById(id);
    if (!result) {
      throw new CustomException(t("permission.error.not_found"), 404);
    }
    return result;
  };

  static create = async (requestDTO: CreatePermissionBodyDTO, t: TFn) => {
    if (!requestDTO.code.startsWith("ROLE_PERM_")) {
      requestDTO.code = "ROLE_PERM_" + requestDTO.code;
    }
    const isCodeDuplicated = await PermissionRepository.existByCode(requestDTO.code);
    if (isCodeDuplicated) {
      throw new CustomException(t("permission.error.duplicated_code"), 409);
    }
    return PermissionRepository.save(requestDTO);
  };

  static update = async (requestDTO: UpdatePermissionBodyDTO, t: TFn) => {
    const isIdValid = await PermissionRepository.existById(requestDTO.id);
    if (!isIdValid) {
      throw new CustomException(t("permission.error.not_found"), 404);
    }
    return PermissionRepository.updateById(requestDTO);
  };
}
