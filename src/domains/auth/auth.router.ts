import { JWT_TYPE, TOKEN_TYPE } from "~/domains/auth/auth.constant";
import { authenticate } from "~/domains/auth/auth.middleware";
import {
  activateAccountBodySchema,
  forgotPasswordRequestSchema,
  loginRequestSchema,
  registerRequestSchema,
  resetPasswordRequestSchema,
} from "~/domains/auth/auth.schema";
import { authService } from "~/domains/auth/auth.service";
import { tokenService } from "~/domains/token/token.service";
import { validator } from "~/middlewares/validator.middleware";
import { RouterUtils } from "~/utils/router.util";

export const authRouter = RouterUtils.init();

authRouter.post("/login", validator("json", loginRequestSchema), async (c) => {
  const body = c.req.valid("json");
  const result = await authService.login(body);
  return RouterUtils.response(c, 200, { data: result });
});

authRouter.post("/register", validator("json", registerRequestSchema), async (c) => {
  const t = c.get("t");
  const body = c.req.valid("json");
  await authService.register(body, t);
  return RouterUtils.response(c, 200, { message: t("auth.message.activate_account_email_sent") });
});

authRouter.post("/token/refresh", authenticate(JWT_TYPE.REFRESH, TOKEN_TYPE.JWT_WITH_ID), async (c) => {
  const authPayload = c.get("authPayload");
  const authToken = c.get("originalAuthToken");
  const result = await authService.refreshToken(Number(authPayload?.sid), String(authToken));
  return RouterUtils.response(c, 200, { data: result });
});

authRouter.post("/token/revoke/all", authenticate(JWT_TYPE.ACCESS), async (c) => {
  const authPayload = c.get("authPayload");
  const userId = Number(authPayload?.sid);
  await tokenService.revokeTokenByUserId(userId);
  return RouterUtils.response(c, 200);
});

authRouter.post("/token/revoke/:tokenId", authenticate(JWT_TYPE.ACCESS), async (c) => {
  const tokenId = Number(c.req.param("tokenId"));
  const authPayload = c.get("authPayload");
  const userId = Number(authPayload?.sid);
  await tokenService.revokeTokenById(tokenId, userId);
  return RouterUtils.response(c, 200);
});

authRouter.post("/password/forgot", validator("json", forgotPasswordRequestSchema), async (c) => {
  const t = c.get("t");
  const body = c.req.valid("json");
  await authService.forgotPassword(body, t);
  return RouterUtils.response(c, 200, { message: t("auth.message.reset_password_email_sent") });
});

authRouter.post("/password/reset", validator("json", resetPasswordRequestSchema), async (c) => {
  const t = c.get("t");
  const body = c.req.valid("json");
  await authService.resetPassword(body);
  return RouterUtils.response(c, 200, { message: t("auth.message.reset_password_success") });
});

authRouter.post("/account/activate", validator("json", activateAccountBodySchema), async (c) => {
  const t = c.get("t");
  const body = c.req.valid("json");
  await authService.activateAccount(body.t);
  return RouterUtils.response(c, 200, { message: t("auth.message.activate_account_success") });
});
