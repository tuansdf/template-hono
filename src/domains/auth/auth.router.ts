import { zValidator } from "@hono/zod-validator";
import { loginRequestSchema, registerRequestSchema } from "~/domains/auth/auth.schema.js";
import { AuthService } from "~/domains/auth/auth.service.js";
import { RouterUtils } from "~/utils/router.util.js";

export const authRouter = RouterUtils.init();

authRouter.post("/login", zValidator("json", loginRequestSchema), async (c) => {
  const body = c.req.valid("json");
  const result = await AuthService.login(body);
  return c.json(result, 200);
});

authRouter.post("/register", zValidator("json", registerRequestSchema), async (c) => {
  const body = c.req.valid("json");
  const result = await AuthService.register(body);
  return c.json(result, 200);
});
