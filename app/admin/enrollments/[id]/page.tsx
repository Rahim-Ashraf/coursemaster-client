"use client"

import api from "@/src/lib/api";
import { useAuthRedirect } from "@/src/lib/hooks/useAuthRedirect";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";


interface User {
    _id: string;
    name: string;
    email: string;
}
interface Enrollment {
    _id: string;
    user: User;
    course: string;
    enrollmentDate: string;
    progress: number;
}

function ViewEnrolledStudents() {
    useAuthRedirect({ requiredRole: "admin" });
    const { id } = useParams()

    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await api.get(`/my-courses/enrollments/${id}`);
                setEnrollments(response.data);
            } catch (err: any) {
                console.log(err.response?.data?.message);
            }
        };
        fetchEnrollments();
    }, [id]);

    return (
        enrollments.length > 0 ? enrollments.map((enrollment, idx) => (
            <div key={idx} className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-2 text-2xl font-semibold text-gray-800 hover:text-indigo-600">
                    {enrollment.user.name}
                </h2>
                <p className="mb-2 text-gray-600">Email: {enrollment.user.email}</p>
            </div>
        ))
            :
            <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-2 text-2xl font-semibold text-gray-800 hover:text-indigo-600">
                    No user enrolled yet
                </h2>
            </div>
    )
}

export default ViewEnrolledStudents