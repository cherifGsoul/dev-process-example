// Model
export type Course = {
  title: string;
  size: ClassSize;
  learners: string[];
}

export type ClassSize = {
  min: number;
  max: number;
};

export type CourseForTitle = (title: string) => Promise<Course>

export type SaveCourse = (course: Course) => Promise<void>


// Use cases
export const proposeCourse = async (saveCourse: SaveCourse, title: string, min: number, max: number) => {
  const course = Course.propose(title, min, max)
  await saveCourse(course)
}

export const enrol = async (courseForTitle: CourseForTitle, saveCourse: SaveCourse, learner: string, title: string) => {
  const course = await courseForTitle(title)
  Course.enrol(course, learner);
  await saveCourse(course)
}

export const isCourseViable = async (courseForTitle: CourseForTitle, title: string) => {
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

  export const isViable = (course: Course) =>  ClassSize.isViable(course.learners, course.size)

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