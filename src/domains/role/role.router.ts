import { authenticate, authorize } from "~/domains/auth/auth.middleware";
import { PERM_SUPER_ADMIN } from "~/domains/permission/permission.constant";
import { createRoleBodySchema, updateRoleBodySchema } from "~/domains/role/role.schema";
import { roleService } from "~/domains/role/role.service";
import { validator } from "~/middlewares/validator.middleware";
import { RouterUtils } from "~/utils/router.util";

export const roleRouter = RouterUtils.init();

roleRouter.use(authenticate());
roleRouter.use(authorize([PERM_SUPER_ADMIN]));

roleRouter.get("/detail/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await roleService.findOneById(id);
  return RouterUtils.response(c, 200, { data: result });
});

roleRouter.get("/", async (c) => {
  const result = await roleService.findAll();
  return RouterUtils.response(c, 200, { data: result });
});

roleRouter.post("/", validator("json", createRoleBodySchema), async (c) => {
  const body = c.req.valid("json");
  await roleService.create(body);
  return RouterUtils.response(c, 200);
});

roleRouter.patch("/", validator("json", updateRoleBodySchema), async (c) => {
  const body = c.req.valid("json");
  await roleService.update(body);
  return RouterUtils.response(c, 200);
});
