import { authenticate, authorize } from "~/domains/auth/auth.middleware";
import { PERM_SUPER_ADMIN } from "~/domains/permission/permission.constant";
import { createPermissionBodySchema, updatePermissionBodySchema } from "~/domains/permission/permission.schema";
import { permissionService } from "~/domains/permission/permission.service";
import { validator } from "~/middlewares/validator.middleware";
import { routerUtils } from "~/utils/router.util";

export const permissionRouter = routerUtils.init((app) => {
  app.use(authenticate());
  app.use(authorize([PERM_SUPER_ADMIN]));

  app.get("/detail/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const result = await permissionService.findOneById(id);
    return routerUtils.response(c, 200, { data: result });
  });

  app.get("/", async (c) => {
    const result = await permissionService.findAll();
    return routerUtils.response(c, 200, { data: result });
  });

  app.post("/", validator("json", createPermissionBodySchema), async (c) => {
    const body = c.req.valid("json");
    await permissionService.create(body);
    return routerUtils.response(c, 200);
  });

  app.patch("/", validator("json", updatePermissionBodySchema), async (c) => {
    const body = c.req.valid("json");
    await permissionService.update(body);
    return routerUtils.response(c, 200);
  });
});
