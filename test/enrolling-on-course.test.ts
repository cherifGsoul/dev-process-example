import { describe, test, expect } from "bun:test";

// Model
type Course = {
  title: string;
  size: ClassSize;
  learners: string[];
}

type ClassSize = {
  min: number;
  max: number;
};

// persistence dependency
const courses: Map<string, Course> = new Map()

type CourseForTitle = (title: string) => Promise<Course>

type SaveCourse = (course: Course) => Promise<void>

const courseForTitle: CourseForTitle = async (title: string) =>{
  const course = courses.get(title)
  if (!course) {
    throw new Error("course is not proposed!")
  }
  return course;
}

const saveCourse: SaveCourse = async (course: Course) => { courses.set(course.title, course) }

// Use cases
const proposeCourse = async (saveCourse: SaveCourse, title: string, min: number, max: number) => {
  const course = Course.propose(title, min, max)
  await saveCourse(course)
}

const enrol = async (courseForTitle: CourseForTitle, saveCourse: SaveCourse, learner: string, title: string) => {
  const course = await courseForTitle(title)
  Course.enrol(course, learner);
  await saveCourse(course)
}

const isCourseViable = async (courseForTitle: CourseForTitle, title: string) => {
  const course = await courseForTitle(title)
  return Course.isViable(course);
}

// Calculations
export namespace Course {

  export const propose = (title: string, min: number, max: number): Course => {
    return {
      title,
      size: ClassSize.between(min, max),
      learners: []
    }
  }

  export const enrol = (course: Course, learner: string) => {
    if (!canAcceptEnrollment(course)) {
      throw new Error("Course class is already at capacity!")
    }
    course.learners.push(learner)
  }

  export const isViable = (course) =>  ClassSize.isViable(course.learners, course.size)

  const canAcceptEnrollment = (course: Course) => ClassSize.hasCapacity(course.learners, course.size)
}

export namespace ClassSize {
  export const between = (min: number, max: number) => ({
    min,
    max
  })

  export const isViable = (learners: string[], size: ClassSize) => learners.length >= size.min;

  export const hasCapacity = (learners: string[], size: ClassSize) => learners.length < size.max
}

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