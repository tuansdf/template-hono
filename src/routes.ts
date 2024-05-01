import { authRouter } from "~/domains/auth/auth.router.js";
import { healthRouter } from "~/domains/health/health.router.js";
import { permissionRouter } from "~/domains/permission/permission.router.js";
import { roleRouter } from "~/domains/role/role.router.js";
import { userRouter } from "~/domains/user/user.router.js";
import { RouterUtils } from "~/utils/router.util.js";

export const routes = RouterUtils.init();

routes.route("/health", healthRouter);
routes.route("/auth", authRouter);
routes.route("/users", userRouter);
routes.route("/roles", roleRouter);
routes.route("/permissions", permissionRouter);
