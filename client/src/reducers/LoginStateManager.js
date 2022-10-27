import { createSlice } from "@reduxjs/toolkit";

export const LoginReducer = createSlice({
    name: "LOGIN_STATE_MANAGER",
    initialState: {
        isLogIn: false,
    },
    reducers: {
        acceptLogin: (state) => {
            state.isLogIn = true;
        },
        rejectLogin: (state) => {
            state.isLogIn = false;
        },
        toggleLoginState: (state) => {
            state.isLogIn = !state.isLogIn;
        },
        changeLoginState: (state, action) => {
            state.isLogIn = action.payload;
        },
    },
});

export const { acceptLogin, rejectLogin, toggleLoginState, changeLoginState } = LoginReducer.actions;

export default LoginReducer.reducer;
