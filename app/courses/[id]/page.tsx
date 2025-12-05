"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/redux/store";
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

export default function CourseDetails() {
  const params = useParams()
  const router = useRouter();
  const { id } = params;
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollStatus, setEnrollSatus] = useState<string | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCourseDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await api.get(`/courses/${id}`);
          setCourse(response.data);
          setLoading(false);
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to fetch course details")
          setLoading(false);
        }
      };
      fetchCourseDetails();
    }
  }, [id]);


  const handleEnrollNow = async () => {
    if (isAuthenticated) {
      setEnrollLoading(true);
      try {
        await api.post("/my-courses", { courseId: id, });
        setEnrollSatus('Successfully enrolled')
      } catch (error: any) {
        console.error(error.response?.data || "Failed to enroll");
        setEnrollSatus(error.response?.data?.msg)
      } finally {
        setEnrollLoading(false);
      }
    } else {
      router.push("/auth/login");
    }
  }


  if (loading) return <p className="p-8 text-center">Loading course details...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;
  if (!course) return <p className="p-8 text-center">Course not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">{course.title}</h1>
        <p className="mb-2 text-xl text-gray-600">Instructor: {course.instructor}</p>
        <p className="mb-4 text-2xl font-bold text-indigo-600">${course.price}</p>

        <div className="mb-6 border-t border-gray-200 pt-6">
          <h2 className="mb-2 text-2xl font-semibold text-gray-700">Description</h2>
          <p className="text-gray-700">{course.description}</p>
        </div>

        <div className="mb-6 border-t border-gray-200 pt-6">
          <h2 className="mb-2 text-2xl font-semibold text-gray-700">Syllabus</h2>
          <ul className="list-disc pl-5 text-gray-700">
            {course.syllabus.map((item, idx) => (
              <div key={idx} className="flex justify-around">
                <h4>{item.content}</h4>
                <h4>{item.module}</h4>
              </div>
            ))}
          </ul>
        </div>

        <div className="mb-6 border-t border-gray-200 pt-6">
          <h2 className="mb-2 text-2xl font-semibold text-gray-700">Category</h2>
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
            {course.category}
          </span>
        </div>
        {enrollLoading ?
          <span className="text-emerald-500">Enrolling to the course...</span>
          : <span className="text-rose-500">{enrollStatus}</span>
        }
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={handleEnrollNow}
            className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}