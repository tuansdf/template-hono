import { Hono } from "hono";
import { authRouter } from "~/domains/auth/auth.router.js";
import { healthRouter } from "~/domains/health/health.router.js";
import { userRouter } from "~/domains/user/user.router.js";

export const routes = new Hono();

routes.route("/health", healthRouter);
routes.route("/auth", authRouter);
routes.route("/users", userRouter);
