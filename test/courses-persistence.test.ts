import {describe, expect, test, beforeEach} from "bun:test";
import { ClassSize, Course, CoursesPersistence } from "../src/courses";
import { sql } from "kysely";
import { kyselyDb } from "../src/config/db";

describe("courses persistence", () => {
  beforeEach(async () => {
    await sql`truncate table ${sql.table('courses')}`.execute(kyselyDb)
  })

  test("should read saved courses", async () => {
    const course = Course.propose("BDD for Beginners", 2, 3)

    await CoursesPersistence.saveCourse(course);

    let persistedCourse = await CoursesPersistence.courseForTitle(course.title);

    expect(persistedCourse).toStrictEqual(course);

    Course.enrol(course, "Derek");

    Course.enrol(course, "Alice");

    Course.enrol(course, "Bob");

    await CoursesPersistence.saveCourse(course)

    persistedCourse = await CoursesPersistence.courseForTitle(course.title);

    expect(persistedCourse).toStrictEqual(course);

    expect(persistedCourse.learners.length).toEqual(3);
  })
})