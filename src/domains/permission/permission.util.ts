import { PERM_INDEX } from "~/domains/permission/permission.constant";
import { Permission } from "~/domains/permission/permission.type";

export class PermissionUtils {
  static codesToIndexes = (perms: string[]): number[] => {
    const result: number[] = [];
    perms.forEach((item) => {
      const index = PERM_INDEX[item];
      if (index) result.push(index);
    });
    return result;
  };

  static dtosToIndexes = (perms: Permission[]) => {
    const result: number[] = [];
    perms.forEach((item) => {
      const index = PERM_INDEX[item.code];
      if (index) result.push(index);
    });
    return result;
  };

  static hasPerm = (currentPerm: string, requiredPerms: (string | number)[]) => {
    const index = PERM_INDEX[currentPerm];
    if (!index) return false;
    return requiredPerms.some((item) => index == item);
  };
}
