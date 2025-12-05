"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import api from "@/src/lib/api";
import { setCredentials } from "@/src/lib/redux/authSlice";
import { jwtDecode } from "jwt-decode";
import { RootState } from "@/src/lib/redux/store";

type Inputs = {
    email: string
    password: string
}
type JwtPayload = {
    exp: number
    iat: number
    user: {
        email: string
        id: string
        name: string
        role: "student" | "admin"
    }
}

export default function LoginPage() {
    const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    if (isAuthenticated) {
        router.push(`/${role}/dashboard`)
    }
    const dispatch = useDispatch();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setError(null);
        try {
            const response = await api.post("/auth/login", data);
            const { token } = response.data;
            const { user } = jwtDecode<JwtPayload>(token);
            const role = user.role;
            dispatch(setCredentials({ token, user }));
            if (role === "admin") {
                router.push("/admin/dashboard")
            } else {
                router.push("/student/dashboard")
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don not have an account?{" "}
                    <button
                        onClick={() => router.push("/auth/register")}
                        className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
}