import { authRouter } from "~/domains/auth/auth.router";
import { healthRouter } from "~/domains/health/health.router";
import { permissionRouter } from "~/domains/permission/permission.router";
import { roleRouter } from "~/domains/role/role.router";
import { userRouter } from "~/domains/user/user.router";
import { RouterUtils } from "~/utils/router.util";

export const apiRouter = RouterUtils.init();

apiRouter.route("/health", healthRouter);
apiRouter.route("/auth", authRouter);
apiRouter.route("/users", userRouter);
apiRouter.route("/roles", roleRouter);
apiRouter.route("/permissions", permissionRouter);
