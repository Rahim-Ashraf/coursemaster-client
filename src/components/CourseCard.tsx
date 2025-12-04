import Link from 'next/link'

interface Syllabus {
    content: string;
    module: string;
    id: string;
}
interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    price: number;
    syllabus: Syllabus[];
    category: string;
}

export default function CourseCard({ course }: { course: Course }) {
    return (
        <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                <Link href={`/courses/${course._id}`} className="hover:text-indigo-600">
                    {course.title}
                </Link>
            </h2>
            <p className="mb-2 text-gray-600">Instructor: {course.instructor}</p>
            <p className="mb-4 text-gray-700">{course.description.substring(0, 100)}...</p>
            <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-indigo-600">${course.price}</span>
                <Link
                    href={`/courses/${course._id}`}
                    className="prm-btn"
                >
                    View Details
                </Link>
            </div>
        </div>
    )
}