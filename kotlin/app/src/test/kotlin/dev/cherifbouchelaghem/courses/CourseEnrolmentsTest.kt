package dev.cherifbouchelaghem.courses

import kotlin.test.*

class CourseEnrolmentsTest {

    private lateinit var proposedCourse: Course
    private var proposedCourses: MutableList<Course> = mutableListOf()

    @BeforeTest
    fun setUp() {
        //Given "BDD for Beginners" was proposed with a class size of 2 to 3 people
        proposedCourse = Course.propose(
            title = "BDD for Beginners",
            classSize = ClassSize(2,3)
        )
    }

    @AfterTest
    fun teardown() {
        proposedCourses = mutableListOf()
    }
    @Test fun `Enrol a learner to a course` () {
        //When only Alice enrols on this course
        val learner = Learner.named("Alice")
        proposedCourse.learners.add(learner)
        val isViable = proposedCourse.learners.size >= proposedCourse.classSize.min
        assertFalse(isViable)
    }

    @Test fun `Course gets enough enrollments to be viable` () {
        // Given Alice has already enrolled on this course
        val learnerAlice = Learner.named("Alice")

        proposedCourse.learners.add(learnerAlice)

        // When Bob enrols on this course
        val learnerBob = Learner.named("Bob")
        proposedCourse.learners.add(learnerBob)

        //Then this course will be viable
        val isViable = proposedCourse.learners.size >= proposedCourse.classSize.min
        assertTrue(isViable)
    }

    @Test fun `Enrollments are stopped when class size is reached` () {
        // Given Alice, Bob and Charlie have already enrolled on this course
        val learnerAlice = Learner.named("Alice")
        proposedCourse.learners.add(learnerAlice)

        val learnerBob = Learner.named("Bob")
        proposedCourse.learners.add(learnerBob)

        val learnerCharlie = Learner.named("Charlie")
        proposedCourse.learners.add(learnerCharlie)

        // When Derek tries to enrol on this course
        val learnerDerek = Learner.named("Derek")
        val canAcceptEnrollment = proposedCourse.learners.size < proposedCourse.classSize.max;

        assertFalse(canAcceptEnrollment)
    }
}