import { zValidator } from "@hono/zod-validator";
import { authenticate, authorize } from "~/domains/auth/auth.middleware.js";
import { ROLE_PERM_SYSTEM_ADMIN } from "~/domains/permission/permission.constant.js";
import {
  createPermissionBodySchema,
  updatePermissionBodySchema,
} from "~/domains/permission/permission.schema.js";
import { PermissionService } from "~/domains/permission/permission.service.js";
import { RouterUtils } from "~/utils/router.util.js";

export const permissionRouter = RouterUtils.init();

permissionRouter.get("/detail/:id", authenticate(), authorize([ROLE_PERM_SYSTEM_ADMIN]), async (c) => {
  const id = Number(c.req.param("id"));
  const result = await PermissionService.findOneById(id);
  return c.json(result, 200);
});

permissionRouter.get("/", authenticate(), authorize([ROLE_PERM_SYSTEM_ADMIN]), async (c) => {
  const result = await PermissionService.findAll();
  return c.json(result, 200);
});

permissionRouter.post(
  "/",
  authenticate(),
  authorize([ROLE_PERM_SYSTEM_ADMIN]),
  zValidator("json", createPermissionBodySchema),
  async (c) => {
    const body = c.req.valid("json");
    await PermissionService.create(body);
    return c.json(null, 200);
  },
);

permissionRouter.patch(
  "/",
  authenticate(),
  authorize([ROLE_PERM_SYSTEM_ADMIN]),
  zValidator("json", updatePermissionBodySchema),
  async (c) => {
    const body = c.req.valid("json");
    await PermissionService.update(body);
    return c.json(null, 200);
  },
);
