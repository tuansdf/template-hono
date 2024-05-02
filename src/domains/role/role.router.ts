import { zValidator } from "@hono/zod-validator";
import { authenticate, authorize } from "~/domains/auth/auth.middleware.js";
import { ROLE_PERM_SYSTEM_ADMIN } from "~/domains/permission/permission.constant.js";
import { createRoleBodySchema, updateRoleBodySchema } from "~/domains/role/role.schema.js";
import { RoleService } from "~/domains/role/role.service.js";
import { RouterUtils } from "~/utils/router.util.js";

export const roleRouter = RouterUtils.init();

roleRouter.get("/detail/:id", authenticate(), authorize([ROLE_PERM_SYSTEM_ADMIN]), async (c) => {
  const id = Number(c.req.param("id"));
  const result = await RoleService.findOneById(id);
  return c.json(result, 200);
});

roleRouter.get("/", authenticate(), authorize([ROLE_PERM_SYSTEM_ADMIN]), async (c) => {
  const result = await RoleService.findAll();
  return c.json(result, 200);
});

roleRouter.post(
  "/",
  authenticate(),
  authorize([ROLE_PERM_SYSTEM_ADMIN]),
  zValidator("json", createRoleBodySchema),
  async (c) => {
    const body = c.req.valid("json");
    await RoleService.create(body);
    return c.json(null, 200);
  },
);

roleRouter.patch(
  "/",
  authenticate(),
  authorize([ROLE_PERM_SYSTEM_ADMIN]),
  zValidator("json", updateRoleBodySchema),
  async (c) => {
    const body = c.req.valid("json");
    await RoleService.update(body);
    return c.json(null, 200);
  },
);
