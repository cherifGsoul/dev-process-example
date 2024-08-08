import { Hono } from "hono";
import coursesRouter from "./courses/router";

const app = new Hono();

app.route("courses/", coursesRouter);

export default app;
