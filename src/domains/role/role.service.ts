import { RoleRepository } from "~/domains/role/role.repository.js";
import { CreateRoleBodyDTO, UpdateRoleBodyDTO } from "~/domains/role/role.type.js";
import { CustomException } from "~/exceptions/custom-exception.js";
import { TFn } from "~/i18n/i18n.type.js";

export class RoleService {
  static findAll = async () => {
    return RoleRepository.findAll();
  };

  static findOneById = async (id: number, t: TFn) => {
    const result = RoleRepository.findTopById(id);
    if (!result) {
      throw new CustomException(t("permission.error.not_found"), 404);
    }
    return result;
  };

  static create = async (requestDTO: CreateRoleBodyDTO, t: TFn) => {
    if (!requestDTO.code.startsWith("ROLE_")) {
      requestDTO.code = "ROLE_" + requestDTO.code;
    }
    const isCodeDuplicated = await RoleRepository.existByCode(requestDTO.code);
    if (isCodeDuplicated) {
      throw new CustomException(t("permission.error.duplicated_code"), 409);
    }
    return RoleRepository.save(requestDTO);
  };

  static update = async (requestDTO: UpdateRoleBodyDTO, t: TFn) => {
    const isIdValid = await RoleRepository.existById(requestDTO.id);
    if (!isIdValid) {
      throw new CustomException(t("permission.error.not_found"), 404);
    }
    return RoleRepository.updateById(requestDTO);
  };
}
