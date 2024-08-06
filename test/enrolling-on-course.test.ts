import { describe, test, expect } from "bun:test";
import { Course, CourseForTitle, enrol, isCourseViable, proposeCourse, SaveCourse } from "../src/courses"

// persistence dependency
const courses: Map<string, Course> = new Map()

const courseForTitle: CourseForTitle = async (title: string) =>{
  const course = courses.get(title)
  if (!course) {
    throw new Error("course is not proposed!")
  }
  return course;
}

const saveCourse: SaveCourse = async (course: Course) => { courses.set(course.title, course) }


describe("Enrolling on course", () => {
  test("Course does not get enough enrollments to be viable", async () => {
    //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
    const title = "BDD for Beginners"
    await proposeCourse(saveCourse, title, 2, 3)

    //When only Alice enrols on this course
    const learner = "Alice"

    await enrol(courseForTitle, saveCourse, learner, title)

    //Then this course will not be viable
    expect(await isCourseViable(courseForTitle, title)).toBeFalse();

  })

  test("Course gets enough enrollments to be viable", async () => {
    //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
    const title = "BDD for Beginners"
    await proposeCourse(saveCourse, title, 2, 3)

    // Given Alice has already enrolled on this course
    const learnerAlice = "Alice"
    await enrol(courseForTitle, saveCourse, learnerAlice, title)

    // When Bob enrols on this course
    const learnerBob = "Bob"
    await enrol(courseForTitle, saveCourse, learnerBob, title)

    //Then this course will be viable
    const isViable = await isCourseViable(courseForTitle, title)
    expect(isViable).toBeTrue();
  })

  test("Enrollments are stopped when class size is reached", async () => {
    //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
    const title = "BDD for Beginners"
    await proposeCourse(saveCourse, title, 2, 3)

    // Given Alice, Bob and Charlie have already enrolled on this course
    const learnerAlice = "Alice"
    await enrol(courseForTitle, saveCourse, learnerAlice, title)

    const learnerBob = "Bob"
    await enrol(courseForTitle, saveCourse, learnerBob, title)

    const learnerCharlie = "Charlie"
    await enrol(courseForTitle, saveCourse, learnerCharlie, title)

    // When Derek tries to enrol on this course
    const learnerDerek = "Derek"
    expect(async () => await enrol(courseForTitle, saveCourse,learnerDerek, title)).toThrow()
  })
})