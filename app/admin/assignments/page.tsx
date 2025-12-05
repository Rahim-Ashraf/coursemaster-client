"use client"

import api from "@/src/lib/api";
import { useAuthRedirect } from "@/src/lib/hooks/useAuthRedirect";
import { useEffect, useState } from "react";

interface Assignment {
    _id: string;
    course: string;
    submission: string;
    user: { email: string };
}

function SubmittedAssignments() {
    useAuthRedirect({ requiredRole: 'admin' })

    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const response = await api.get("/assignments")
                console.log(response.data)
                setAssignments(response.data.courses || response.data)
            } catch (err: any) {
                console.log(err.response?.data?.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading)
        return <p className="text-center">Loding assignments...</p>
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Course Id
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Submitted by
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Submission
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {assignments.length > 0 && assignments.map((assignment) => (
                        <tr key={assignment._id}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                {assignment.course}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {assignment.user.email}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                ${assignment.submission}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default SubmittedAssignments