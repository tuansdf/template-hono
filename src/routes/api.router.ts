import { Hono } from "hono";
import { authRouter } from "~/routes/auth.router";
import { healthRouter } from "~/routes/health.router";
import { permissionRouter } from "~/routes/permission.router";
import { roleRouter } from "~/routes/role.router";
import { userRouter } from "~/routes/user.router";

export const apiRouter = new Hono();

apiRouter.route("/health", healthRouter);
apiRouter.route("/auth", authRouter);
apiRouter.route("/users", userRouter);
apiRouter.route("/roles", roleRouter);
apiRouter.route("/permissions", permissionRouter);
