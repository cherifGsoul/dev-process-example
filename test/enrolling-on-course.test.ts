import { describe, test, expect } from "bun:test";

describe("Enrolling on course", () => {
  test("Course does not get enough enrollments to be viable", () => {
    //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
    const course: {
      title: string;
      size: {
        min: number;
        max: number;
      };
      learners: string[];
    } = { title: "BDD for Beginners", size: { min: 2, max: 3 }, learners: [] }
    // const courses = [course];

    //When only Alice enrols on this course
    const learner = "Alice"

    course.learners.push(learner)

    //Then this course will not be viable
    const isViable = course.learners.length >= course.size.min
    expect(isViable).toBeFalse();

  })

  test("Course gets enough enrollments to be viable", () => {
    //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
    const course: {
      title: string;
      size: {
        min: number;
        max: number;
      };
      learners: string[];
    } = { title: "BDD for Beginners", size: { min: 2, max: 3 }, learners: [] }

    // Given Alice has already enrolled on this course
    const learnerAlice = "Alice"

    course.learners.push(learnerAlice)

    // When Bob enrols on this course
    const learnerBob = "Bob"
    course.learners.push(learnerBob)

    //Then this course will be viable
    const isViable = course.learners.length >= course.size.min
    expect(isViable).toBeTrue();
  })

  test("Enrollments are stopped when class size is reached", () => {
    //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
    const course: {
      title: string;
      size: {
        min: number;
        max: number;
      };
      learners: string[];
    } = { title: "BDD for Beginners", size: { min: 2, max: 3 }, learners: [] }

    // Given Alice, Bob and Charlie have already enrolled on this course
    const learnerAlice = "Alice"
    course.learners.push(learnerAlice)

    const learnerBob = "Bob"
    course.learners.push(learnerBob)

    const learnerCharlie = "Charlie"
    course.learners.push(learnerCharlie)

    // When Derek tries to enrol on this course
    const learnerDerek = "Derek"
    const canAcceptEnrollment = course.learners.length < course.size.max;
    expect(() => {
      if (!canAcceptEnrollment) {
        throw new Error("Class is already at capacity")
      }
      course.learners.push(learnerDerek)
    }).toThrow()
  })
})