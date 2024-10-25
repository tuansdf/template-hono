import { Hono } from "hono";
import { authenticate } from "~/domains/auth/auth.middleware";
import {
  activateAccountBodySchema,
  forgotPasswordRequestSchema,
  loginRequestSchema,
  registerRequestSchema,
  resetPasswordRequestSchema,
} from "~/domains/auth/auth.schema";
import { authService } from "~/domains/auth/auth.service";
import { JWT_TYPE } from "~/domains/token/token.constant";
import { tokenService } from "~/domains/token/token.service";
import { validator } from "~/middlewares/validator.middleware";

export const authRouter = new Hono();

authRouter.post("/login", validator("json", loginRequestSchema), async (c) => {
  const body = c.req.valid("json");
  const result = await authService.login(body);
  return c.json({ data: result }, 200);
});

authRouter.post("/register", validator("json", registerRequestSchema), async (c) => {
  const t = c.get("t");
  const body = c.req.valid("json");
  await authService.register(body, t);
  return c.json({ message: t("auth.message.activate_account_email_sent") }, 200);
});

authRouter.post("/token/refresh", authenticate(JWT_TYPE.REFRESH), async (c) => {
  const authPayload = c.get("authPayload");
  const result = await authService.refreshToken(Number(authPayload?.sid), Number(authPayload?.tid));
  return c.json({ data: result }, 200);
});

authRouter.post("/token/revoke/all", authenticate(JWT_TYPE.ACCESS), async (c) => {
  const authPayload = c.get("authPayload");
  const userId = Number(authPayload?.sid);
  await tokenService.revokeTokenByUserId(userId);
  return c.json({}, 200);
});

authRouter.post("/token/revoke/:tokenId", authenticate(JWT_TYPE.ACCESS), async (c) => {
  const tokenId = Number(c.req.param("tokenId"));
  const authPayload = c.get("authPayload");
  const userId = Number(authPayload?.sid);
  await tokenService.revokeTokenById(tokenId, userId);
  return c.json({}, 200);
});

authRouter.post("/password/forgot", validator("json", forgotPasswordRequestSchema), async (c) => {
  const t = c.get("t");
  const body = c.req.valid("json");
  await authService.forgotPassword(body, t);
  return c.json({ message: t("auth.message.reset_password_email_sent") }, 200);
});

authRouter.post("/password/reset", validator("json", resetPasswordRequestSchema), async (c) => {
  const t = c.get("t");
  const body = c.req.valid("json");
  await authService.resetPassword(body);
  return c.json({ message: t("auth.message.reset_password_success") }, 200);
});

authRouter.post("/account/activate", validator("json", activateAccountBodySchema), async (c) => {
  const t = c.get("t");
  const body = c.req.valid("json");
  await authService.activateAccount(body.t);
  return c.json({ message: t("auth.message.activate_account_success") }, 200);
});
