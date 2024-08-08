import { sql } from "kysely";
import { kyselyDb } from "../config/db";

// Model
export type Course = {
  title: string;
  size: ClassSize;
  learners: string[];
};

export type ClassSize = {
  min: number;
  max: number;
};

export type CourseForTitle = (title: string) => Promise<Course>;

export type SaveCourse = (course: Course) => Promise<void>;

// Use cases
export const proposeCourse = async (
  saveCourse: SaveCourse,
  title: string,
  min: number,
  max: number,
) => {
  const course = Course.propose(title, min, max);
  await saveCourse(course);
};

export const enrol = async (
  courseForTitle: CourseForTitle,
  saveCourse: SaveCourse,
  learner: string,
  title: string,
) => {
  const course = await courseForTitle(title);
  Course.enrol(course, learner);
  await saveCourse(course);
};

export const isCourseViable = async (
  courseForTitle: CourseForTitle,
  title: string,
) => {
  const course = await courseForTitle(title);
  return Course.isViable(course);
};

// Calculations
export namespace Course {
  export const propose = (title: string, min: number, max: number): Course => {
    return {
      title,
      size: ClassSize.between(min, max),
      learners: [],
    };
  };

  export const enrol = (course: Course, learner: string) => {
    if (!canAcceptEnrollment(course)) {
      throw new Error("Course class is already at capacity!");
    }
    course.learners.push(learner);
  };

  export const isViable = (course: Course) =>
    ClassSize.isViable(course.learners, course.size);

  const canAcceptEnrollment = (course: Course) =>
    ClassSize.hasCapacity(course.learners, course.size);
}

export namespace ClassSize {
  export const between = (min: number, max: number) => ({
    min,
    max,
  });

  export const isViable = (learners: string[], size: ClassSize) =>
    learners.length >= size.min;

  export const hasCapacity = (learners: string[], size: ClassSize) =>
    learners.length < size.max;
}

// Persistence
export namespace CoursesPersistence {
  export const saveCourse: SaveCourse = async (
    course: Course,
  ): Promise<void> => {
    try {
      const existingRecord = await kyselyDb
        .selectFrom("courses")
        .selectAll()
        .where("courses.title", "=", course.title)
        .executeTakeFirst();

      await kyselyDb
        .insertInto("courses")
        .values({
          id: crypto.randomUUID(),
          title: course.title,
          min: course.size.min,
          max: course.size.max,
          learners: course.learners,
        })
        .onConflict((oc) =>
          oc.column("title").doUpdateSet(({ ref }) => {
            // Retrieve existing learners or default to an empty array
            const existingLearners = existingRecord?.learners || [];

            // Find new learners that are not in existing learners
            const newLearners = course.learners.filter(
              (item) => !existingLearners.includes(item),
            );

            // Update the learners by combining existing learners with new ones
            return {
              title: course.title,
              min: course.size.min,
              max: course.size.max,
              learners: sql`array_cat(${ref("courses.learners")}, ${sql.val(newLearners)})`,
            };
          }),
        )
        .executeTakeFirstOrThrow();
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  export const courseForTitle = async (title: string): Promise<Course> => {
    const record = await kyselyDb
      .selectFrom("courses")
      .selectAll()
      .where("courses.title", "=", title)
      .executeTakeFirst();

    if (!record) {
      throw new Error("Course can not be found");
    }
    return {
      title: record.title,
      size: {
        min: record.min,
        max: record.max,
      },
      learners: record.learners?.length ? Array.from(record.learners) : [],
    };
  };
}
