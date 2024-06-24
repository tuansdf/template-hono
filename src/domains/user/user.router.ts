import { authenticate } from "~/domains/auth/auth.middleware";
import {
  getUserDetailByEmailQuerySchema,
  getUserDetailByIdParamSchema,
  getUserDetailByUsernameQuerySchema,
  searchUserQuerySchema,
} from "~/domains/user/user.schema";
import { userService } from "~/domains/user/user.service";
import { validator } from "~/middlewares/validator.middleware";
import { RouterUtils } from "~/utils/router.util";

export const userRouter = RouterUtils.init();

userRouter.get(
  "/detail/by-username",
  authenticate(),
  validator("query", getUserDetailByUsernameQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const result = await userService.findOneByUsername(query.q);
    return RouterUtils.response(c, 200, { data: result });
  },
);

userRouter.get("/detail/by-email", authenticate(), validator("query", getUserDetailByEmailQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const result = await userService.findOneByEmail(query.q);
  return RouterUtils.response(c, 200, { data: result });
});

userRouter.get("/detail/:id", authenticate(), validator("param", getUserDetailByIdParamSchema), async (c) => {
  const params = c.req.valid("param");
  const id = params.id;
  const result = await userService.findOneById(id);
  return RouterUtils.response(c, 200, { data: result });
});

userRouter.get("/", authenticate(), async (c) => {
  const result = await userService.findAll();
  return RouterUtils.response(c, 200, { data: result });
});

userRouter.get("/search", authenticate(), validator("query", searchUserQuerySchema), async (c) => {
  const requestDTO = c.req.valid("query");
  const result = await userService.search(requestDTO);
  return RouterUtils.response(c, 200, { data: result });
});
