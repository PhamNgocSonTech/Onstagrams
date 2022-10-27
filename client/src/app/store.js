import { configureStore } from "@reduxjs/toolkit";
import LoginReducer from "../reducers/LoginStateManager";

export default configureStore({
    reducer: {
        loginState_reducer: LoginReducer,
    },
});
