"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../lib/redux/authSlice";
import { RootState } from "../lib/redux/store";



export default function Navbar() {
    const session = useSelector((state: RootState) => state.auth)
    const pathname = usePathname()
    const dispatch = useDispatch()

    return (
        <div className="px-8 py-4">
            <div className="flex justify-between text-xl">
                <div className="w-1/3 flex justify-between">
                    <div>
                        <Link href="/" className={`${pathname === '/' ? "text-gray-800" : "text-gray-500"} font-bold`
                        }>Home</Link>
                    </div>
                    <div>
                        <Link href="/courses" className={`${pathname === '/courses' ? "text-gray-800" : "text-gray-500"} font-bold`
                        }>Courses</Link>
                    </div>
                </div>
                {session.isAuthenticated ? <div className="w-1/3 flex justify-between">
                    <div>
                        <Link href={session.role === "admin" ? "/admin/dashboard"
                            : "/student/dashboard"}
                            className={`${pathname.includes('/dashboard') || pathname.includes('/agent-dashboard') || pathname.includes('/admin-dashboard') ?
                                "text-gray-800" : "text-gray-500"} font-bold`
                            }>Dashboard</Link>
                    </div>
                    <div>
                        <button onClick={() => dispatch(logout())}
                            className="bg-rose-600 text-white font-semibold px-4 py-2 rounded-2xl cursor-pointer">Logout</button>
                    </div>
                </div>
                    : <div>
                        <Link href="/auth/login"
                            className="prm-btn">Login</Link>
                    </div>}
            </div>
        </div>
    );
};