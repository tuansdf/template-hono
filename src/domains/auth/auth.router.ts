import { loginRequestSchema, registerRequestSchema } from "~/domains/auth/auth.schema.js";
import { AuthService } from "~/domains/auth/auth.service.js";
import { validator } from "~/middlewares/validator.middleware.js";
import { RouterUtils } from "~/utils/router.util.js";

export const authRouter = RouterUtils.init();

authRouter.post("/login", validator("json", loginRequestSchema), async (c) => {
  const body = c.req.valid("json");
  const result = await AuthService.login(body);
  return RouterUtils.response(c, { status: 200, data: result });
});

authRouter.post("/register", validator("json", registerRequestSchema), async (c) => {
  const body = c.req.valid("json");
  const result = await AuthService.register(body);
  return RouterUtils.response(c, { status: 200, data: result });
});
