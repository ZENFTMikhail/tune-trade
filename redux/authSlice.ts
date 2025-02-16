import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type User = {
    email: string;
    password: string;
}

const initialState: {user: User | null} = {
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },

        logout: (state) => {
            state.user = null
        }
    }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer