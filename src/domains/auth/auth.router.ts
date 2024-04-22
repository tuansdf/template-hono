import { AuthService } from "~/domains/auth/auth.service.js";
import { AuthValidator } from "~/domains/auth/auth.validator.js";
import { RouterUtils } from "~/utils/router.util.js";

export const authRouter = RouterUtils.init();

authRouter.post("/login", async (c) => {
  const t = c.get("t");

  const body = AuthValidator.validateLoginRequest(await c.req.json());
  const result = await AuthService.login(body, t);

  return c.json(result, 200);
});

authRouter.post("/register", async (c) => {
  const t = c.get("t");

  const body = AuthValidator.validateRegisterRequest(await c.req.json());
  const result = await AuthService.register(body, t);
  return c.json(result, 200);
});
