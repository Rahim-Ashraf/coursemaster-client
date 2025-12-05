"use client";

import api from "@/src/lib/api";
import { useAuthRedirect } from "@/src/lib/hooks/useAuthRedirect";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    price: number;
    category: string;
    syllabus: string[];
}

export default function CourseManagementPage() {
    useAuthRedirect({ requiredRole: "admin" });

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [f, setF] = useState(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get("/courses")
                setCourses(response.data.courses || response.data)
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch courses");
            }
            finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [f]);

    const handleDeleteCourse = async (courseId: string) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await api.delete(`/courses/${courseId}`);
                alert("Course deleted successfully!");
                setF(!f)
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to delete course");
            }
        }
    };

    if (loading) return <p className="p-8 text-center">Loading courses...</p>;
    if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Admin Course Management</h1>
            <div className="mb-8">
                <Link href='/admin/courses/create'
                    className="prm-btn"
                >
                    Add New Course
                </Link>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">Existing Courses</h2>
                {courses.length === 0 ? (
                    <p className="text-gray-600">No courses available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Instructor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {courses.map((course) => (
                                    <tr key={course._id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                            {course.title}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {course.instructor}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            ${course.price}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {course.category}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                            <Link href={`/admin/courses/update/${course._id}`}
                                                className="prm-btn mr-1"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteCourse(course._id)}
                                                className="bg-red-600 px-2 py-1.5 text-white rounded cursor-pointer hover:bg-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
