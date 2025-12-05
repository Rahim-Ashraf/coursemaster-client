"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../redux/store";

interface AuthRedirectOptions {
    requiredRole: "student" | "admin";
}

export function useAuthRedirect({
    requiredRole,
}: AuthRedirectOptions) {
    const router = useRouter();
    const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login')
        } else if (role !== requiredRole) {
            router.push('/courses');
        }
    }, [isAuthenticated, role, router, requiredRole]);
}