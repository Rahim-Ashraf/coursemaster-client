"use client";

import api from "@/src/lib/api";
import { useAuthRedirect } from "@/src/lib/hooks/useAuthRedirect";
import Link from "next/link";
import { useState, useEffect } from "react";


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
export default function AdminEnrollments() {
    useAuthRedirect({ requiredRole: "admin" });

    const [courses, setCourses] = useState<Course[]>([]);


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses');
                setCourses(response.data.courses)
            } catch (err: any) {
                console.log(err.response?.data?.message || "Failed to fetch courses");
            }
        };
        fetchCourses();
    }, [])

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="min-h-screen bg-gray-100 p-8">
                <h1 className="mb-8 text-4xl font-bold text-gray-800">Available Courses</h1>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.length === 0 ? (
                        <p className="col-span-full text-center text-gray-600">No courses found.</p>
                    ) : (
                        courses.map((course, idx) => (
                            <div key={idx} className="rounded-lg bg-white p-6 shadow-md">
                                <h2 className="mb-2 text-2xl font-semibold text-gray-800 hover:text-indigo-600">
                                        {course.title}
                                </h2>
                                <p className="mb-2 text-gray-600">Instructor: {course.instructor}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-indigo-600">${course.price}</span>
                                    <Link
                                        href={`/admin/enrollments/${course._id}`}
                                        className="prm-btn"
                                    >
                                        View Enrolled students
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}