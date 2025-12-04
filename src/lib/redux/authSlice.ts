import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    user: {
        id: string | null;
        email: string | null;
        name: string | null;
        role: 'student' | 'admin' | null;
    } | null;
    role: 'student' | 'admin' | null;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    user: null,
    role: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                token: string,
                user: { id: string, email: string, name: string, role: 'student' | 'admin' };
            }>
        ) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.role = action.payload.user.role;
            localStorage.setItem('authToken', state.token)
        },
        logout: state => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.role = null;
            localStorage.removeItem('authToken')
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;