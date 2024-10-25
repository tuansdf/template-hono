import { Hono } from "hono";
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
import { authenticate } from "~/middlewares/auth.middleware";

export const authRouter = new Hono();

authRouter.post("/login", async (c) => {
  const body = loginRequestSchema.parse(c.req.json());
  const result = await authService.login(body);
  return c.json({ data: result }, 200);
});

authRouter.post("/register", async (c) => {
  const t = c.get("t");
  const body = registerRequestSchema.parse(c.req.json());
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

authRouter.post("/password/forgot", async (c) => {
  const t = c.get("t");
  const body = forgotPasswordRequestSchema.parse(c.req.json());
  await authService.forgotPassword(body, t);
  return c.json({ message: t("auth.message.reset_password_email_sent") }, 200);
});

authRouter.post("/password/reset", async (c) => {
  const t = c.get("t");
  const body = resetPasswordRequestSchema.parse(c.req.json());
  await authService.resetPassword(body);
  return c.json({ message: t("auth.message.reset_password_success") }, 200);
});

authRouter.post("/account/activate", async (c) => {
  const t = c.get("t");
  const body = activateAccountBodySchema.parse(c.req.json());
  await authService.activateAccount(body.t);
  return c.json({ message: t("auth.message.activate_account_success") }, 200);
});
