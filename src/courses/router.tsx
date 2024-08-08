import { Hono } from "hono"
import { validator } from 'hono/validator';
import { Layout } from "../layout";
import type { FC } from "hono/jsx";
import { z } from "zod";

const coursesRouter = new Hono()

const proposeCourseSchema = z.object({
  title: z.string().min(3).max(100),
  min: z.coerce.number().min(2).max(100),
  max: z.coerce.number().min(2).max(100)
}).refine(data => data.max > data.min, {
  message: "Max must be greater than Min",
  path: ["max"],
});

type ProposeCourse = z.infer<typeof proposeCourseSchema>

const ProposeCourse: FC = () => {
  return (
    <Layout>
      <h1 class="title is-2">Propose a Course</h1>
      <form method="post">
        <div class="field">
          <label for="title" class="label">Title</label>
          <div class="control">
            <input type="text" class="input" id="title" name="title"/>
          </div>
        </div>

        <div class="field">
          <label for="min" class="label">Min Size</label>
          <div class="control">
            <input type="number" class="input" id="min" name="min" />
          </div>
        </div>

        <div class="field">
          <label for="max" class="label">Max Size</label>
          <div class="control">
            <input type="number" class="input" id="max" name="max" />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-primary">Submit</button>
          </div>
        </div>
      </form>
    </Layout>
  )
}

const EnrollCourse: FC<{ messages: string[] }> = (props: {
  messages: string[]
}) => {
  return (
    <Layout>
      <h1>Hello Hono!</h1>
      <ul>
        {props.messages.map((message) => {
          return <li>{message}!!</li>
        })}
      </ul>
    </Layout>
  )
}

coursesRouter.get("/propose", async (c) => {
  const messages = ['Good Morning', 'Good Evening', 'Good Night']
  return c.html(<ProposeCourse messages={messages} />)
})

coursesRouter.post("/propose", validator('form', (value, c) => {
  const parsed = proposeCourseSchema.safeParse(value);
  if (!parsed.success) {
    console.log(parsed.error.flatten());
  }
  console.log(parsed.data);
  return parsed.data;
}), async (c) => {

});

export default coursesRouter;