import { authenticate, authorize } from "~/domains/auth/auth.middleware";
import { PERM_SUPER_ADMIN } from "~/domains/permission/permission.constant";
import { createPermissionBodySchema, updatePermissionBodySchema } from "~/domains/permission/permission.schema";
import { PermissionService } from "~/domains/permission/permission.service";
import { validator } from "~/middlewares/validator.middleware";
import { RouterUtils } from "~/utils/router.util";

export const permissionRouter = RouterUtils.init();

permissionRouter.use(authenticate());
permissionRouter.use(authorize([PERM_SUPER_ADMIN]));

permissionRouter.get("/detail/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await PermissionService.findOneById(id);
  return RouterUtils.response(c, 200, { data: result });
});

permissionRouter.get("/", async (c) => {
  const result = await PermissionService.findAll();
  return RouterUtils.response(c, 200, { data: result });
});

permissionRouter.post("/", validator("json", createPermissionBodySchema), async (c) => {
  const body = c.req.valid("json");
  await PermissionService.create(body);
  return RouterUtils.response(c, 200);
});

permissionRouter.patch("/", validator("json", updatePermissionBodySchema), async (c) => {
  const body = c.req.valid("json");
  await PermissionService.update(body);
  return RouterUtils.response(c, 200);
});
