import { authenticate, authorize } from "~/domains/auth/auth.middleware";
import { PERM_SUPER_ADMIN } from "~/domains/permission/permission.constant";
import { createRoleBodySchema, updateRoleBodySchema } from "~/domains/role/role.schema";
import { roleService } from "~/domains/role/role.service";
import { validator } from "~/middlewares/validator.middleware";
import { routerUtils } from "~/utils/router.util";

export const roleRouter = routerUtils.init((app) => {
  app.use(authenticate());
  app.use(authorize([PERM_SUPER_ADMIN]));

  app.get("/detail/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const result = await roleService.findOneById(id);
    return routerUtils.response(c, 200, { data: result });
  });

  app.get("/", async (c) => {
    const result = await roleService.findAll();
    return routerUtils.response(c, 200, { data: result });
  });

  app.post("/", validator("json", createRoleBodySchema), async (c) => {
    const body = c.req.valid("json");
    await roleService.create(body);
    return routerUtils.response(c, 200);
  });

  app.patch("/", validator("json", updateRoleBodySchema), async (c) => {
    const body = c.req.valid("json");
    await roleService.update(body);
    return routerUtils.response(c, 200);
  });
});
