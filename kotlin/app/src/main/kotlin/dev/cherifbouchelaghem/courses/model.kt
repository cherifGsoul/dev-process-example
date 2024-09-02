package dev.cherifbouchelaghem.courses

data class Course(val title: String, val classSize: ClassSize, val learners: MutableList<Learner> = mutableListOf()) {
    companion object {
        fun propose(title: String, classSize: ClassSize): Course {
            return Course(title, classSize)
        }
    }
}

data class ClassSize(val min: Int, val max: Int)

data class Learner(val name: String) {
    companion object {
        fun named(name: String): Learner = Learner(name)
    }
}