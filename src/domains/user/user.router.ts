import { authenticate } from "~/domains/auth/auth.middleware.js";
import {
  getUserDetailByEmailQuerySchema,
  getUserDetailByIdParamSchema,
  getUserDetailByUsernameQuerySchema,
  searchUserQuerySchema,
} from "~/domains/user/user.schema.js";
import { UserService } from "~/domains/user/user.service.js";
import { validator } from "~/middlewares/validator.middleware.js";
import { RouterUtils } from "~/utils/router.util.js";

export const userRouter = RouterUtils.init();

userRouter.get(
  "/detail/by-username",
  authenticate(),
  validator("query", getUserDetailByUsernameQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const result = await UserService.findOneByUsername(query.q);
    return RouterUtils.response(c, 200, { data: result });
  },
);

userRouter.get("/detail/by-email", authenticate(), validator("query", getUserDetailByEmailQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const result = await UserService.findOneByEmail(query.q);
  return RouterUtils.response(c, 200, { data: result });
});

userRouter.get("/detail/:id", authenticate(), validator("param", getUserDetailByIdParamSchema), async (c) => {
  const params = c.req.valid("param");
  const id = params.id;
  const result = await UserService.findOneById(id);
  return RouterUtils.response(c, 200, { data: result });
});

userRouter.get("/", authenticate(), async (c) => {
  const result = await UserService.findAll();
  return RouterUtils.response(c, 200, { data: result });
});

userRouter.get("/search", authenticate(), validator("query", searchUserQuerySchema), async (c) => {
  const requestDTO = c.req.valid("query");
  const result = await UserService.search(requestDTO);
  return RouterUtils.response(c, 200, { data: result });
});
