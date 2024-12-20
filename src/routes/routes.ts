import { Hono } from "hono";
import { authRouter } from "~/routes/auth.router";
import { healthRouter } from "~/routes/health.router";
import { permissionRouter } from "~/routes/permission.router";
import { roleRouter } from "~/routes/role.router";
import { userRouter } from "~/routes/user.router";

export const routes = new Hono();

routes.route("/health", healthRouter);
routes.route("/auth", authRouter);
routes.route("/users", userRouter);
routes.route("/roles", roleRouter);
routes.route("/permissions", permissionRouter);
