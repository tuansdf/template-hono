import { authRouter } from "~/domains/auth/auth.router";
import { healthRouter } from "~/domains/health/health.router";
import { permissionRouter } from "~/domains/permission/permission.router";
import { publicRouter } from "~/domains/public/public.router";
import { roleRouter } from "~/domains/role/role.router";
import { userRouter } from "~/domains/user/user.router";
import { RouterUtils } from "~/utils/router.util";

export const routes = RouterUtils.init();

routes.route("/health", healthRouter);
routes.route("/auth", authRouter);
routes.route("/users", userRouter);
routes.route("/roles", roleRouter);
routes.route("/permissions", permissionRouter);
routes.route("/public", publicRouter);
