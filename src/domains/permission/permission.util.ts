import { PERMISSION_TO_BINARY } from "~/domains/permission/permission.constant.js";

export class PermissionUtils {
  static codesToBinaries = (perms: string[]): number[] => {
    const result: number[] = [];
    for (let i = 0; i < perms.length; i++) {
      const binary = PERMISSION_TO_BINARY[perms[i]!];
      if (!binary) continue;
      result[binary[0]] = (result[binary[0]] || 0) | binary[1];
    }
    return Array.from(result).map((item) => item || 0);
  };

  static hasPerm = (perm: string, perms: number[]) => {
    const binary = PERMISSION_TO_BINARY[perm];
    if (!binary) return false;
    return ((perms[binary[0]] || 0) & binary[1]) === binary[1]!;
  };
}
