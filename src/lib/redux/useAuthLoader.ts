import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { jwtDecode } from "jwt-decode";

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

export const useAuthLoader = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            const {user} = jwtDecode<JwtPayload>(token);
            console.log(user)
            dispatch(
                setCredentials({
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    }
                })
            );
        } catch { }
    }, [dispatch]);
};
