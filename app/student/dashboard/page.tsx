"use client";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Link from "next/link";
import { RootState } from "@/src/lib/redux/store";
import { useAuthRedirect } from "@/src/lib/hooks/useAuthRedirect";
import api from "@/src/lib/api";

interface EnrolledCourse {
    _id: string;
    course: {
        _id: string;
        title: string;
        instructor: string;
    };
    progress: number;
    completedLessons: string[];
}

export default function StudentDashboardPage() {
    useAuthRedirect({ requiredRole: "student" });
    const { user } = useSelector((state: RootState) => state.auth);

    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [completed, setCompleted] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get("/my-courses");
                setEnrolledCourses(response.data);
                let completCount = 0;
                for (const enroll of response.data) {
                    completCount += enroll.progress
                }
                setCompleted(Math.floor((100 / response.data.length) * completCount))
                setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch enrolled courses");
                setLoading(false);
            }
        };
        if (user) {
            fetchEnrolledCourses();
        }
    }, [user]);


    if (!user) {
        return <p>Loading user data...</p>;
    }

    if (loading) return <p className="p-8 text-center">Loading enrolled courses...</p>;
    if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">
                Welcome, {user.name || "Student"} to your Dashboard!
            </h1>
            <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">Your Enrolled Courses</h2>
                {enrolledCourses.length === 0 ? (
                    <p className="text-gray-600">You have not enrolled in any courses yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {enrolledCourses.map((enrollment) => (
                            <div key={enrollment._id} className="rounded-lg border border-gray-200 p-4 shadow-sm">
                                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                                    <Link href={`/courses/${enrollment.course._id}/consume`} className="hover:text-indigo-600">
                                        {enrollment.course.title}
                                    </Link>
                                </h3>
                                <p className="mb-2 text-gray-600">Instructor: {enrollment.course.instructor}</p>

                                <Link
                                    href={`/courses/${enrollment.course._id}/consume`}
                                    className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                                >
                                    Continue Learning
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
                <div className="my-6 h-8 w-full rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-indigo-500 text-xs text-white flex items-center justify-center"
                        style={{ width: `${completed}%` }}
                    >
                        {completed}% Completed
                    </div>
                </div>
            </div>

        </div>
    );
}