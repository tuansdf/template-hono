import { roleRepository } from "~/domains/role/role.repository";
import { CreateRoleBodyDTO, UpdateRoleBodyDTO } from "~/domains/role/role.type";
import { CustomException } from "~/exceptions/custom-exception";

class RoleService {
  public findAll = async () => {
    return roleRepository.findAll();
  };

  public findOneById = async (id: number) => {
    const result = roleRepository.findTopById(id);
    if (!result) {
      throw new CustomException("dynamic.error.not_found:::field.role", 404);
    }
    return result;
  };

  public create = async (requestDTO: CreateRoleBodyDTO) => {
    if (!requestDTO.code.startsWith("ROLE_")) {
      requestDTO.code = "ROLE_" + requestDTO.code;
    }
    const isCodeDuplicated = await roleRepository.existByCode(requestDTO.code);
    if (isCodeDuplicated) {
      throw new CustomException("dynamic.error.duplicated:::field.code", 409);
    }
    return roleRepository.save(requestDTO);
  };

  public update = async (requestDTO: UpdateRoleBodyDTO) => {
    const isIdValid = await roleRepository.existById(requestDTO.id);
    if (!isIdValid) {
      throw new CustomException("dynamic.error.not_found:::field.role", 404);
    }
    return roleRepository.update(requestDTO);
  };
}

export const roleService = new RoleService();
