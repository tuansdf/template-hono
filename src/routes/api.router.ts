import { authRouter } from "~/domains/auth/auth.router";
import { healthRouter } from "~/domains/health/health.router";
import { permissionRouter } from "~/domains/permission/permission.router";
import { roleRouter } from "~/domains/role/role.router";
import { userRouter } from "~/domains/user/user.router";
import { routerUtils } from "~/utils/router.util";

export const apiRouter = routerUtils.init((app) => {
  app.route("/health", healthRouter);
  app.route("/auth", authRouter);
  app.route("/users", userRouter);
  app.route("/roles", roleRouter);
  app.route("/permissions", permissionRouter);
});
