import { Hono } from "hono";
import { PERM_SUPER_ADMIN } from "~/domains/permission/permission.constant";
import { createPermissionBodySchema, updatePermissionBodySchema } from "~/domains/permission/permission.schema";
import { permissionService } from "~/domains/permission/permission.service";
import { authenticate, authorize } from "~/middlewares/auth.middleware";

export const permissionRouter = new Hono();

permissionRouter.use(authenticate());
permissionRouter.use(authorize([PERM_SUPER_ADMIN]));

permissionRouter.get("/detail/:id", async (c) => {
  const id = c.req.param("id");
  const result = await permissionService.findOneById(id);
  return Response.json({ data: result });
});

permissionRouter.get("/", async (c) => {
  const result = await permissionService.findAll();
  return Response.json({ data: result });
});

permissionRouter.post("/", async (c) => {
  const body = createPermissionBodySchema.parse(c.req.json());
  await permissionService.create(body);
  return Response.json({});
});

permissionRouter.patch("/", async (c) => {
  const body = updatePermissionBodySchema.parse(c.req.json());
  await permissionService.update(body);
  return Response.json(null);
});
