import {
  activateAccountBodySchema,
  forgotPasswordRequestSchema,
  loginRequestSchema,
  registerRequestSchema,
  resendActivateAccountBodySchema,
  resetPasswordRequestSchema,
} from "@/domains/auth/auth.schema";
import { authService } from "@/domains/auth/auth.service";
import { JWT_TYPE } from "@/domains/token/token.constant";
import { tokenService } from "@/domains/token/token.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { Hono } from "hono";

export const authRouter = new Hono();

authRouter.post("/login", async (c) => {
  const body = loginRequestSchema.parse(await c.req.json());
  const result = await authService.login(body);
  return Response.json({ data: result });
});

authRouter.post("/register", async (c) => {
  const t = c.get("t");
  const body = registerRequestSchema.parse(await c.req.json());
  await authService.register(body, t);
  return Response.json({ message: t("auth.message.activate_account_email_sent") });
});

authRouter.post("/token/refresh", authenticate(JWT_TYPE.REFRESH), async (c) => {
  const authPayload = c.get("authPayload");
  const result = await authService.refreshToken(authPayload?.sid || "", authPayload?.tid || "");
  return Response.json({ data: result });
});

authRouter.post("/token/revoke/all", authenticate(JWT_TYPE.ACCESS), async (c) => {
  const authPayload = c.get("authPayload");
  const userId = authPayload?.sid || "";
  await tokenService.revokeTokenByForeignId(userId);
  return Response.json(null);
});

authRouter.post("/token/revoke/:tokenId", authenticate(JWT_TYPE.ACCESS), async (c) => {
  const tokenId = c.req.param("tokenId") || "";
  const authPayload = c.get("authPayload");
  const userId = authPayload?.sid || "";
  await tokenService.revokeTokenById(tokenId, userId);
  return Response.json(null);
});

authRouter.post("/password/forgot", async (c) => {
  const t = c.get("t");
  const body = forgotPasswordRequestSchema.parse(await c.req.json());
  await authService.forgotPassword(body, t);
  return Response.json({ message: t("auth.message.reset_password_email_sent") });
});

authRouter.post("/password/reset", async (c) => {
  const t = c.get("t");
  const body = resetPasswordRequestSchema.parse(await c.req.json());
  await authService.resetPassword(body);
  return Response.json({ message: t("auth.message.reset_password_success") });
});

authRouter.post("/account/activate", async (c) => {
  const t = c.get("t");
  const body = activateAccountBodySchema.parse(await c.req.json());
  await authService.activateAccount(body.t);
  return Response.json({ message: t("auth.message.activate_account_success") });
});

authRouter.post("/account/activate/resend", async (c) => {
  const t = c.get("t");
  const body = resendActivateAccountBodySchema.parse(await c.req.json());
  await authService.resendActivateAccount(body.email, t);
  return Response.json({ message: t("auth.message.activate_account_email_sent") });
});
