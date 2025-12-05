"use client";

import { useSelector } from "react-redux";
import { useAuthRedirect } from "@/src/lib/hooks/useAuthRedirect";
import { RootState } from "@/src/lib/redux/store";
import Link from "next/link";

export default function AdminDashboardPage() {
    useAuthRedirect({ requiredRole: "admin" });
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex gap-4">
            <div className="w-1/6 flex flex-col gap-4 text-indigo-800 font-semibold border-r border-gray-400">
                <Link href='/admin/courses'>Courses</Link>
                <Link href='/admin/enrollments'>Enrollments</Link>
                <Link href='/admin/assignments'>Assignments</Link>
            </div>
            <div className="w-5/6">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">
                    Welcome, {user.name} to your Admin Dashboard!
                </h1>
            </div>
        </div>
    );
}