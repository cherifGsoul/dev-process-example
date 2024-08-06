import { describe, test, expect } from "bun:test";

type Course = {
  title: string;
  size: {
    min: number;
    max: number;
  };
  learners: string[];
}

const courses: Map<string, Course> = new Map()

type CourseForTitle = (title: string) => Course | undefined

type SaveCourse = (course: Course) => void

const courseForTitle: CourseForTitle = (title: string) => courses.get(title)

const saveCourse: SaveCourse = (course: Course) => courses.set(course.title, course)


const proposeCourse = (saveCourse: SaveCourse, title: string, min: number, max: number) => {
  const course = { title: title, size: { min, max }, learners: [] }
  saveCourse(course)
}

const enrol = (courseForTitle: CourseForTitle, saveCourse: SaveCourse, learner: string, title: string) => {
  const course = courseForTitle(title)
  if (course) {
    course.learners.push(learner)
    saveCourse(course)
  }
}

const isCourseViable = (courseForTitle: CourseForTitle, title: string) => {
  const course = courseForTitle(title)
  if (course) {
    return course.learners.length >= course.size.min
  }
  return false;
}

const courseCanAcceptEnrollment = (courseForTitle: CourseForTitle, title: string) => {
  const course = courseForTitle(title)
  if (course) {
    return course.learners.length < course.size.max;
  }
  return false;
}

describe("Enrolling on course", () => {
  test("Course does not get enough enrollments to be viable", () => {
    //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
    const title = "BDD for Beginners"
    proposeCourse(saveCourse, title, 2, 3)

    //When only Alice enrols on this course
    const learner = "Alice"

    enrol(courseForTitle, saveCourse, learner, title)

    //Then this course will not be viable
    expect(isCourseViable(courseForTitle, title)).toBeFalse();

  })

  test("Course gets enough enrollments to be viable", () => {
    //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
    const title = "BDD for Beginners"
    proposeCourse(saveCourse, title, 2, 3)

    // Given Alice has already enrolled on this course
    const learnerAlice = "Alice"
    enrol(courseForTitle, saveCourse, learnerAlice, title)

    // When Bob enrols on this course
    const learnerBob = "Bob"
    enrol(courseForTitle, saveCourse, learnerBob, title)

    //Then this course will be viable
    const isViable = isCourseViable(courseForTitle, title)
    expect(isViable).toBeTrue();
  })

  test("Enrollments are stopped when class size is reached", () => {
    //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
    const title = "BDD for Beginners"
    proposeCourse(saveCourse, title, 2, 3)

    // Given Alice, Bob and Charlie have already enrolled on this course
    const learnerAlice = "Alice"
    enrol(courseForTitle, saveCourse, learnerAlice, title)

    const learnerBob = "Bob"
    enrol(courseForTitle, saveCourse, learnerBob, title)

    const learnerCharlie = "Charlie"
    enrol(courseForTitle, saveCourse, learnerCharlie, title)

    // When Derek tries to enrol on this course
    const learnerDerek = "Derek"
    expect(() => {
      if (!courseCanAcceptEnrollment(courseForTitle, title)) {
        throw new Error("Class is already at capacity")
      }
      enrol(courseForTitle, saveCourse,learnerDerek, title)
    }).toThrow()
  })
})