import { authenticate, authorize } from "~/domains/auth/auth.middleware.js";
import { PERM_SUPER_ADMIN } from "~/domains/permission/permission.constant.js";
import { createRoleBodySchema, updateRoleBodySchema } from "~/domains/role/role.schema.js";
import { RoleService } from "~/domains/role/role.service.js";
import { validator } from "~/middlewares/validator.middleware.js";
import { RouterUtils } from "~/utils/router.util.js";

export const roleRouter = RouterUtils.init();

roleRouter.use(authenticate());
roleRouter.use(authorize([PERM_SUPER_ADMIN]));

roleRouter.get("/detail/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await RoleService.findOneById(id);
  return RouterUtils.response(c, { status: 200, data: result });
});

roleRouter.get("/", async (c) => {
  const result = await RoleService.findAll();
  return RouterUtils.response(c, { status: 200, data: result });
});

roleRouter.post("/", validator("json", createRoleBodySchema), async (c) => {
  const body = c.req.valid("json");
  await RoleService.create(body);
  return RouterUtils.response(c, { status: 200 });
});

roleRouter.patch("/", validator("json", updateRoleBodySchema), async (c) => {
  const body = c.req.valid("json");
  await RoleService.update(body);
  return RouterUtils.response(c, { status: 200 });
});
