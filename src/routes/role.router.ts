import { Hono } from "hono";
import { PERM_SUPER_ADMIN } from "~/domains/permission/permission.constant";
import { createRoleBodySchema, updateRoleBodySchema } from "~/domains/role/role.schema";
import { roleService } from "~/domains/role/role.service";
import { authenticate, authorize } from "~/middlewares/auth.middleware";

export const roleRouter = new Hono();

roleRouter.use(authenticate());
roleRouter.use(authorize([PERM_SUPER_ADMIN]));

roleRouter.get("/detail/:id", async (c) => {
  const id = c.req.param("id");
  const result = await roleService.findOneById(id);
  return Response.json({ data: result });
});

roleRouter.get("/", async () => {
  const result = await roleService.findAll();
  return Response.json({ data: result });
});

roleRouter.post("/", async (c) => {
  const body = createRoleBodySchema.parse(c.req.json());
  await roleService.create(body);
  return Response.json(null);
});

roleRouter.patch("/", async (c) => {
  const body = updateRoleBodySchema.parse(c.req.json());
  await roleService.update(body);
  return Response.json(null);
});
