import { Hono } from "hono";
import { authenticate } from "~/middlewares/auth.middleware";
import {
  getUserDetailByEmailQuerySchema,
  getUserDetailByIdParamSchema,
  getUserDetailByUsernameQuerySchema,
  searchUserQuerySchema,
} from "~/domains/user/user.schema";
import { userService } from "~/domains/user/user.service";
import { validator } from "~/middlewares/validator.middleware";

export const userRouter = new Hono();

userRouter.get(
  "/detail/by-username",
  authenticate(),
  validator("query", getUserDetailByUsernameQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const result = await userService.findOneByUsername(query.q);
    return c.json({ data: result }, 200);
  },
);

userRouter.get("/detail/by-email", authenticate(), validator("query", getUserDetailByEmailQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const result = await userService.findOneByEmail(query.q);
  return c.json({ data: result }, 200);
});

userRouter.get("/detail/:id", authenticate(), validator("param", getUserDetailByIdParamSchema), async (c) => {
  const params = c.req.valid("param");
  const id = params.id;
  const result = await userService.findOneById(id);
  return c.json({ data: result }, 200);
});

userRouter.get("/", authenticate(), async (c) => {
  const result = await userService.findAll();
  return c.json({ data: result }, 200);
});

userRouter.get("/search", authenticate(), validator("query", searchUserQuerySchema), async (c) => {
  const requestDTO = c.req.valid("query");
  const result = await userService.search(requestDTO);
  return c.json({ data: result }, 200);
});
