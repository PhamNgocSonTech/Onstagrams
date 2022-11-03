import { createSlice } from "@reduxjs/toolkit";

export const LoginReducer = createSlice({
    name: "LOGIN_STATE_MANAGER",
    initialState: {
        user: null,
    },
    reducers: {
        setUserInfor: (state, action) => {
            state.user = action.payload;
        },
        removeUserInfor: (state) => {
            state.user = null;
        },
    },
});

export const { setUserInfor, removeUserInfor } = LoginReducer.actions;

export default LoginReducer.reducer;
