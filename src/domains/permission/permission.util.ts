import { PERM_INDEX } from "@/domains/permission/permission.constant";
import { PermissionDTO } from "@/domains/permission/permission.type";

class PermissionUtils {
  public codesToIndexes(perms: string[]): number[] {
    const result: number[] = [];
    perms.forEach((item) => {
      const index = PERM_INDEX[item];
      if (index) result.push(index);
    });
    return result;
  }

  public dtosToIndexes(perms: PermissionDTO[]) {
    const result: number[] = [];
    perms.forEach((item) => {
      if (!item.code) return;
      const index = PERM_INDEX[item.code];
      if (index) result.push(index);
    });
    return result;
  }

  public hasPerm(currentPerm: string, requiredPerms: (string | number)[]) {
    const index = PERM_INDEX[currentPerm];
    if (!index) return false;
    return requiredPerms.some((item) => index == item);
  }
}

export const permissionUtils = new PermissionUtils();
