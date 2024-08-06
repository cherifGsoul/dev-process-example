import { Hono } from "hono"
import { validator } from 'hono/validator';

const coursesRouter = new Hono()

coursesRouter.post("/enroll", async (c) => {
  
}) 

export default coursesRouter;