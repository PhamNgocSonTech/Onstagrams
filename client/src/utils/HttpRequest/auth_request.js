import axios from "axios";
import { END_POINT_API2 } from "../../Default/constant";

const usersConfig = axios.create({
    baseURL: `http://localhost:5000/api/auth`,
    validateStatus: function (status) {
        return status >= 200 && status <= 500;
    },
});

/**
 * url: https://localhost:5000/api/auth/{url}
 * options: https://localhost:5000/api/auth/{url}&{params}
 */

export const login = async (body) => {
    const results = await usersConfig.post("/login/", body);
    return results.data;
};

export const loginGoogle = async () => {
    const results = await usersConfig.get("/google");
    return results;
};

export const responseGoogle = async () => {
    const results = await usersConfig.get("/google/callback");
    return results;
};

export const register = async (body) => {
    const results = await usersConfig.post("/register/", body);
    return results;
};

export const verifyEmail = async (userId, otp) => {
    const results = await usersConfig.post("/verify/mail/", { userId, otp });
    return results;
};

export const refreshToken = async (rt) => {
    console.log(rt);
    const results = await usersConfig.post("/refreshToken", { token: rt });
    console.log(results);
    return results;
};
