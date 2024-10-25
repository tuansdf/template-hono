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
import { routerUtils } from "~/utils/router.util";

export const authRouter = routerUtils.init((app) => {
  app.post("/login", validator("json", loginRequestSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await authService.login(body);
    return routerUtils.response(c, 200, { data: result });
  });

  app.post("/register", validator("json", registerRequestSchema), async (c) => {
    const t = c.get("t");
    const body = c.req.valid("json");
    await authService.register(body, t);
    return routerUtils.response(c, 200, { message: t("auth.message.activate_account_email_sent") });
  });

  app.post("/token/refresh", authenticate(JWT_TYPE.REFRESH), async (c) => {
    const authPayload = c.get("authPayload");
    const result = await authService.refreshToken(Number(authPayload?.sid), Number(authPayload?.tid));
    return routerUtils.response(c, 200, { data: result });
  });

  app.post("/token/revoke/all", authenticate(JWT_TYPE.ACCESS), async (c) => {
    const authPayload = c.get("authPayload");
    const userId = Number(authPayload?.sid);
    await tokenService.revokeTokenByUserId(userId);
    return routerUtils.response(c, 200);
  });

  app.post("/token/revoke/:tokenId", authenticate(JWT_TYPE.ACCESS), async (c) => {
    const tokenId = Number(c.req.param("tokenId"));
    const authPayload = c.get("authPayload");
    const userId = Number(authPayload?.sid);
    await tokenService.revokeTokenById(tokenId, userId);
    return routerUtils.response(c, 200);
  });

  app.post("/password/forgot", validator("json", forgotPasswordRequestSchema), async (c) => {
    const t = c.get("t");
    const body = c.req.valid("json");
    await authService.forgotPassword(body, t);
    return routerUtils.response(c, 200, { message: t("auth.message.reset_password_email_sent") });
  });

  app.post("/password/reset", validator("json", resetPasswordRequestSchema), async (c) => {
    const t = c.get("t");
    const body = c.req.valid("json");
    await authService.resetPassword(body);
    return routerUtils.response(c, 200, { message: t("auth.message.reset_password_success") });
  });

  app.post("/account/activate", validator("json", activateAccountBodySchema), async (c) => {
    const t = c.get("t");
    const body = c.req.valid("json");
    await authService.activateAccount(body.t);
    return routerUtils.response(c, 200, { message: t("auth.message.activate_account_success") });
  });
});
