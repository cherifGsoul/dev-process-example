import { describe, test, expect } from "bun:test";

type Course = {
  title: string;
  size: {
    min: number;
    max: number;
  };
  learners: string[];
}

const courses: Course[] = []

const proposeCourse = (title: string, min: number, max: number) => {
  const course = { title: title, size: { min, max }, learners: [] }
  courses.push(course)
}

const enrol = (learner: string, title: string) => {
  const course = courses.find(course => course.title === title)
  if (course) {
    course.learners.push(learner)
  }
}

const isCourseViable = (title: string) => {
  const course = courses.find(course => course.title === title)
  if (course) {
    return course.learners.length >= course.size.min
  }
  return false;
}

const courseCanAcceptEnrollment = (title: string) => {
  const course = courses.find(course => course.title === title)
  if (course) {
    return course.learners.length < course.size.max;
  }
  return false;
}

describe("Enrolling on course", () => {
  test("Course does not get enough enrollments to be viable", () => {
    //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
    const title = "BDD for Beginners"
    proposeCourse(title, 2, 3)

    //When only Alice enrols on this course
    const learner = "Alice"

    enrol(learner, title)

    //Then this course will not be viable
    expect(isCourseViable(title)).toBeFalse();

  })

  test("Course gets enough enrollments to be viable", () => {
    //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
    const title = "BDD for Beginners"
    proposeCourse(title, 2, 3)

    // Given Alice has already enrolled on this course
    const learnerAlice = "Alice"
    enrol(learnerAlice, title)

    // When Bob enrols on this course
    const learnerBob = "Bob"
    enrol(learnerBob, title)

    //Then this course will be viable
    const isViable = isCourseViable(title)
    expect(isViable).toBeTrue();
  })

  test("Enrollments are stopped when class size is reached", () => {
    //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
    const title = "BDD for Beginners"
    proposeCourse(title, 2, 3)

    // Given Alice, Bob and Charlie have already enrolled on this course
    const learnerAlice = "Alice"
    enrol(learnerAlice, title)

    const learnerBob = "Bob"
    enrol(learnerBob, title)

    const learnerCharlie = "Charlie"
    enrol(learnerCharlie, title)

    // When Derek tries to enrol on this course
    const learnerDerek = "Derek"
    expect(() => {
      if (!courseCanAcceptEnrollment(title)) {
        throw new Error("Class is already at capacity")
      }
      enrol(learnerDerek, title)
    }).toThrow()
  })
})