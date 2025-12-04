"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useAuthLoader } from "./useAuthLoader";

function AuthLoaderWrapper({ children }: { children: React.ReactNode }) {
    useAuthLoader();
    return <>{children}</>
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthLoaderWrapper>
                {children}
            </AuthLoaderWrapper>
        </Provider>
    );
}