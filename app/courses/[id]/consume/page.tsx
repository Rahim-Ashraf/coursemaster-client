"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthRedirect } from "@/src/lib/hooks/useAuthRedirect";
import api from "@/src/lib/api";

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
interface Enrollment {
    course: Course;
    user: string
    progress: number;
    enrolledAt: string;
    __v: number
    _id: string
}

export default function ConsumeCoursePage() {
    useAuthRedirect({ requiredRole: "student" });
    const params = useParams()
    const { id } = params;
    const [course, setCourse] = useState<Course | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [completeLoading, setCompleteLoading] = useState(false)

    useEffect(() => {
        if (id) {
            const fetchCourseDetails = async () => {
                try {
                    const response = await api.get(`/my-courses/course/${id}`);
                    setCourse(response.data.course);
                    setEnrollment(response.data)
                } catch (err: any) {
                    console.error(err.response?.data)
                }
            };
            fetchCourseDetails();
        }
    }, [id, completeLoading]);


    const handleMarkAsCompleted = async () => {
        setCompleteLoading(true)
        try {
            const res = await api.put(`/my-courses/complete`, { courseId: course?._id });
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to mark as completed.");
        }
        finally {
            setCompleteLoading(false)
        }
    };

    return (
        <div className="bg-gray-100">
            {course ? (
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="my-4 text-3xl font-bold text-gray-800">
                        {course.title}
                    </h2>
                    <div>
                        <iframe width="695" height="391"
                            src="https://www.youtube.com/embed/W6NZfCO5SIk"
                            title="JavaScript Course for Beginners – Your First Step to Web Development"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        >
                        </iframe>
                    </div>
                    <p className="my-6 text-gray-700">{course.description}</p>

                    {!enrollment?.progress ? (
                        <button
                            onClick={handleMarkAsCompleted}
                            disabled={completeLoading}
                            className="prm-btn"
                        >
                            Mark as Completed
                        </button>
                    )
                        : enrollment?.progress && (
                            <p className="text-green-600 font-semibold text-lg">Lesson Completed!</p>
                        )}
                </div>
            ) : (
                <p className="text-center text-gray-600">Please select a lesson from the sidebar.</p>
            )}
        </div>
    );
}