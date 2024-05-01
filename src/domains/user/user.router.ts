import { zValidator } from "@hono/zod-validator";
import { authenticate } from "~/domains/auth/auth.middleware.js";
import { getDetailUserQuerySchema, searchUserQuerySchema } from "~/domains/user/user.schema.js";
import { UserService } from "~/domains/user/user.service.js";
import { RouterUtils } from "~/utils/router.util.js";

export const userRouter = RouterUtils.init();

userRouter.get("/detail/:id", authenticate(), async (c) => {
  const t = c.get("t");
  const id = Number(c.req.param("id"));
  const result = await UserService.findOneById(id, t);
  return c.json(result, 200);
});

userRouter.get("/detail/by-username", authenticate(), zValidator("query", getDetailUserQuerySchema), async (c) => {
  const t = c.get("t");
  const query = c.req.valid("query");
  const result = await UserService.findOneByUsername(query.q, t);
  return c.json(result, 200);
});

userRouter.get("/detail/by-email", authenticate(), zValidator("query", getDetailUserQuerySchema), async (c) => {
  const t = c.get("t");
  const query = c.req.valid("query");
  const result = await UserService.findOneByEmail(query.q, t);
  return c.json(result, 200);
});

userRouter.get("/", authenticate(), async (c) => {
  const result = await UserService.findAll();
  return c.json(result, 200);
});

userRouter.get("/search", authenticate(), zValidator("query", searchUserQuerySchema), async (c) => {
  const requestDTO = c.req.valid("query");
  const result = await UserService.search(requestDTO);
  return c.json(result, 200);
});
