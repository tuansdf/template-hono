import { Hono } from "hono";
import { searchUserQuerySchema } from "@/domains/user/user.schema";
import { userService } from "@/domains/user/user.service";
import { authenticate } from "@/middlewares/auth.middleware";

export const userRouter = new Hono();

userRouter.get("/", authenticate(), async (c) => {
  const result = await userService.findAll();
  return Response.json({ data: result });
});

userRouter.get("/:id", authenticate(), async (c) => {
  const id = c.req.param("id");
  const result = await userService.findOneById(id);
  return Response.json({ data: result });
});

userRouter.get("/search", authenticate(), async (c) => {
  const requestDTO = searchUserQuerySchema.parse(c.req.queries);
  const result = await userService.search(requestDTO);
  return Response.json({ data: result });
});
