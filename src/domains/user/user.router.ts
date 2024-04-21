import { AuthMiddleware } from "~/domains/auth/auth.middleware.js";
import { UserService } from "~/domains/user/user.service.ts";
import { CustomException } from "~/exceptions/custom-exception.js";
import { RouterUtils } from "~/utils/router.util.js";

export const userRouter = RouterUtils.init();

userRouter.get("/detail/:id", AuthMiddleware.authenticate(), async (c) => {
  const t = c.get("t");
  const id = Number(c.req.param("id"));

  const result = await UserService.findOneById(id, t);
  return c.json(result, 200);
});

userRouter.get("/detail", AuthMiddleware.authenticate(), async (c) => {
  const t = c.get("t");
  const username = c.req.query("username");
  const email = c.req.query("email");

  if (username) {
    const result = await UserService.findOneByUsername(username, t);
    return c.json(result, 200);
  } else if (email) {
    const result = await UserService.findOneByEmail(email, t);
    return c.json(result, 200);
  } else {
    throw new CustomException("Missing username or email");
  }
});

userRouter.get("/", AuthMiddleware.authenticate(), async (c) => {
  console.log(c.get("authPayload"));
  const result = await UserService.findAll();
  return c.json(result, 200);
});
