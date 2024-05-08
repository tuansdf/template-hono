import { JWT_TYPE } from "~/domains/auth/auth.constant.js";
import { authenticate } from "~/domains/auth/auth.middleware.js";
import {
  forgotPasswordRequestSchema,
  loginRequestSchema,
  registerRequestSchema,
  resetPasswordRequestSchema,
} from "~/domains/auth/auth.schema.js";
import { AuthService } from "~/domains/auth/auth.service.js";
import { validator } from "~/middlewares/validator.middleware.js";
import { RouterUtils } from "~/utils/router.util.js";

export const authRouter = RouterUtils.init();

authRouter.post("/login", validator("json", loginRequestSchema), async (c) => {
  const body = c.req.valid("json");
  const result = await AuthService.login(body);
  return RouterUtils.response(c, 200, { data: result });
});

authRouter.post("/register", validator("json", registerRequestSchema), async (c) => {
  const body = c.req.valid("json");
  const result = await AuthService.register(body);
  return RouterUtils.response(c, 200, { data: result });
});

authRouter.post("/token/refresh", authenticate(JWT_TYPE.REFRESH), async (c) => {
  const authPayload = c.get("authPayload");
  const result = await AuthService.refreshToken(Number(authPayload?.sid), Number(authPayload?.iat));
  return RouterUtils.response(c, 200, { data: result });
});

authRouter.post("/token/invalidate", authenticate(JWT_TYPE.ACCESS), async (c) => {
  const authPayload = c.get("authPayload");
  await AuthService.invalidateToken(Number(authPayload?.sid));
  return RouterUtils.response(c, 200);
});

authRouter.post("/password/forgot", validator("json", forgotPasswordRequestSchema), async (c) => {
  const t = c.get("t");
  const body = c.req.valid("json");
  await AuthService.forgotPassword(body);
  return RouterUtils.response(c, 200, { message: t("auth.message.forgot_password_email_sent") });
});

authRouter.post(
  "/password/reset",
  authenticate(JWT_TYPE.RESET_PASSWORD),
  validator("json", resetPasswordRequestSchema),
  async (c) => {
    const authPayload = c.get("authPayload");
    const username = String(authPayload?.sub);
    const body = c.req.valid("json");
    await AuthService.resetPassword(body, username);
    return RouterUtils.response(c, 200);
  },
);
