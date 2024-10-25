import { Hono } from "hono";
import {
  getUserDetailByEmailQuerySchema,
  getUserDetailByUsernameQuerySchema,
  searchUserQuerySchema,
} from "~/domains/user/user.schema";
import { userService } from "~/domains/user/user.service";
import { authenticate } from "~/middlewares/auth.middleware";

export const userRouter = new Hono();

userRouter.get("/detail/by-username", authenticate(), async (c) => {
  const query = getUserDetailByUsernameQuerySchema.parse(c.req.queries);
  const result = await userService.findOneByUsername(query.q);
  return c.json({ data: result }, 200);
});

userRouter.get("/detail/by-email", authenticate(), async (c) => {
  const query = getUserDetailByEmailQuerySchema.parse(c.req.queries);
  const result = await userService.findOneByEmail(query.q);
  return c.json({ data: result }, 200);
});

userRouter.get("/detail/:id", authenticate(), async (c) => {
  const id = Number(c.req.param("id"));
  const result = await userService.findOneById(id);
  return c.json({ data: result }, 200);
});

userRouter.get("/", authenticate(), async (c) => {
  const result = await userService.findAll();
  return c.json({ data: result }, 200);
});

userRouter.get("/search", authenticate(), async (c) => {
  const requestDTO = searchUserQuerySchema.parse(c.req.queries);
  const result = await userService.search(requestDTO);
  return c.json({ data: result }, 200);
});
