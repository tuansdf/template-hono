import { roleRepository } from "~/domains/role/role.repository";
import { CreateRoleBodyDTO, UpdateRoleBodyDTO } from "~/domains/role/role.type";
import { CustomException } from "~/exceptions/custom-exception";

class RoleService {
  public async findAll() {
    return await roleRepository.findAll();
  }

  public async findOneById(id: number) {
    const result = await roleRepository.findTopById(id);
    if (!result) {
      throw new CustomException("dynamic.error.not_found;field.role", 404);
    }
    return result;
  }

  public async create(requestDTO: CreateRoleBodyDTO) {
    if (!requestDTO.code.startsWith("ROLE_")) {
      requestDTO.code = "ROLE_" + requestDTO.code;
    }
    const isCodeDuplicated = await roleRepository.existByCode(requestDTO.code);
    if (isCodeDuplicated) {
      throw new CustomException("dynamic.error.duplicated;field.code", 409);
    }
    return await roleRepository.save(requestDTO);
  }

  public async update(requestDTO: UpdateRoleBodyDTO) {
    const isIdValid = await roleRepository.existById(requestDTO.id);
    if (!isIdValid) {
      throw new CustomException("dynamic.error.not_found;field.role", 404);
    }
    return await roleRepository.update(requestDTO);
  }
}

export const roleService = new RoleService();
